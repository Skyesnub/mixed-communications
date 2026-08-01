// ============================================================
// Live "learning player" simulation — ports the Python realistic-
// player model to JS and drives the actual game characters with it.
//
// Behavior model (matches the Python sim this was built from):
//  - No-lookahead greedy: picks whichever action most reduces
//    distance-to-goal *this frame*, using the same kind of exact
//    per-side shortest-path map the solver uses.
//  - Epsilon-random exploration, boosted when stuck, reduced right
//    at the finish line (careful final approach).
//  - Learns from death: a spike that killed a previous attempt is
//    actively avoided afterward.
//  - Execution noise: small per-frame chance of a slip even in a
//    memorized 'safe' stretch, higher near a known hazard.
//  - Progressive memorization: replays the best prefix found so far
//    (measured by real progress, not just survival time), then goes
//    live past that point.
//  - Gets stuck -> stops and "thinks": a bounded lookahead search
//    (representing the player consciously studying the visible
//    layout) that extends the memorized prefix.
// ============================================================

const LearningAI = (function () {
    const ACTIONS = [[0, false], [0, true], [-5, false], [5, false], [-5, true], [5, true]];

    function spikeHitbox(spike) {
        const [sx, sy, d] = spike;
        if (d === "down") return [sx + 10, sy, sx + 40, sy + 7];
        if (d === "up") return [sx + 10, sy + 43, sx + 40, sy + 50];
        if (d === "left") return [sx + 43, sy + 10, sx + 50, sy + 40];
        if (d === "right") return [sx, sy + 10, sx + 7, sy + 40];
    }

    function overlaps(px, py, box) {
        const [l, t, r, b] = box;
        return px < r && px + 20 > l && py < b && py + 20 > t;
    }

    // Pure joint step: mirrors moving_collisions() exactly (including the
    // win-before-death priority quirk), without mutating any global state.
    function pureStepJoint(blocks, spikeBoxes, p1x, p1y, p2x, p2y, dx, up, canvasWidth, canvasHeight) {
        const pW = 20, pS = 5;
        const movingLeft = dx < 0, movingRight = dx > 0;
        if (movingLeft) { p1x -= pS; p2x -= pS; }
        if (movingRight) { p1x += pS; p2x += pS; }
        for (const block of blocks) {
            const bl = block[0], br = block[0] + 50, bt = block[1], bb = block[1] + 50;
            if (p1x < br && p1x + pW > bl && p1y < bb && p1y + pW > bt) {
                if (movingRight) p1x = bl - pW;
                if (movingLeft) p1x = br;
            }
            if (p2x < br && p2x + pW > bl && p2y < bb && p2y + pW > bt) {
                if (movingRight) p2x = bl - pW;
                if (movingLeft) p2x = br;
            }
        }
        if (p1x + pW > 600) p1x = 600 - pW;
        if (p1x < 0) p1x = 0;
        if (p2x < 600) p2x = 600;
        if (p2x + pW > canvasWidth) p2x = canvasWidth - pW;

        if (up) { p1y -= pS; p2y -= pS; } else { p1y += pS; p2y += pS; }
        for (const block of blocks) {
            const bl = block[0], br = block[0] + 50, bt = block[1], bb = block[1] + 50;
            if (p1x < br && p1x + pW > bl && p1y < bb && p1y + pW > bt) {
                if (!up) p1y = bt - pW; else p1y = bb;
            }
            if (p2x < br && p2x + pW > bl && p2y < bb && p2y + pW > bt) {
                if (!up) p2y = bt - pW; else p2y = bb;
            }
        }
        if (p1y + pW > canvasHeight) p1y = canvasHeight - pW;
        if (p2y + pW > canvasHeight) p2y = canvasHeight - pW;
        if (p1y < 0) p1y = 0;
        if (p2y < 0) p2y = 0;

        const p1InEnd = (p1x + pW > 500 && p1x < 600 && p1y + pW > 0 && p1y < 100);
        const p2InEnd = (p2x + pW > 1100 && p2x < 1200 && p2y + pW > 0 && p2y < 100);
        if (p1InEnd && p2InEnd) {
            return { result: "WIN", p1x, p1y, p2x, p2y };
        }
        for (let i = 0; i < spikeBoxes.length; i++) {
            if (overlaps(p1x, p1y, spikeBoxes[i]) || overlaps(p2x, p2y, spikeBoxes[i])) {
                return { result: "DEAD", hazardIdx: i, p1x, p1y, p2x, p2y };
            }
        }
        return { result: "OK", p1x, p1y, p2x, p2y };
    }

    function pureStepSingle(blocks, spikes, x, y, dx, up, xMin, xMax, canvasHeight, endBox) {
        const pW = 20, pS = 5;
        const movingLeft = dx < 0, movingRight = dx > 0;
        if (movingLeft) x -= pS;
        if (movingRight) x += pS;
        for (const block of blocks) {
            const bl = block[0], br = block[0] + 50, bt = block[1], bb = block[1] + 50;
            if (x < br && x + pW > bl && y < bb && y + pW > bt) {
                if (movingRight) x = bl - pW;
                if (movingLeft) x = br;
            }
        }
        if (x + pW > xMax) x = xMax - pW;
        if (x < xMin) x = xMin;

        if (up) y -= pS; else y += pS;
        for (const block of blocks) {
            const bl = block[0], br = block[0] + 50, bt = block[1], bb = block[1] + 50;
            if (x < br && x + pW > bl && y < bb && y + pW > bt) {
                if (!up) y = bt - pW; else y = bb;
            }
        }
        if (y + pW > canvasHeight) y = canvasHeight - pW;
        if (y < 0) y = 0;

        const [ex, ey, ew, eh] = endBox;
        if (x + pW > ex && x < ex + ew && y + pW > ey && y < ey + eh) {
            return { result: "WIN" };
        }
        for (const spike of spikes) {
            const box = spikeHitbox(spike);
            if (overlaps(x, y, box)) return { result: "DEAD" };
        }
        return { result: "OK", x, y };
    }

    function buildDistanceMap(blocks, spikes, startX, startY, xMin, xMax, canvasHeight, endBox) {
        const key = (x, y) => x + "," + y;
        const visited = new Set([key(startX, startY)]);
        const queue = [[startX, startY]];
        const forwardEdges = new Map();
        const goalPredecessors = new Set();
        let qi = 0;
        while (qi < queue.length) {
            const [x, y] = queue[qi++];
            const edges = [];
            for (const [dx, up] of ACTIONS) {
                const res = pureStepSingle(blocks, spikes, x, y, dx, up, xMin, xMax, canvasHeight, endBox);
                if (res.result === "WIN") {
                    edges.push("GOAL");
                    goalPredecessors.add(key(x, y));
                    continue;
                }
                if (res.result === "DEAD") {
                    const sk = key(startX, startY);
                    edges.push(sk);
                    if (!visited.has(sk)) { visited.add(sk); queue.push([startX, startY]); }
                    continue;
                }
                const k = key(res.x, res.y);
                edges.push(k);
                if (!visited.has(k)) { visited.add(k); queue.push([res.x, res.y]); }
            }
            forwardEdges.set(key(x, y), edges);
        }
        const reverseAdj = new Map();
        for (const [k, edges] of forwardEdges.entries()) {
            for (const e of edges) {
                if (e === "GOAL") continue;
                if (!reverseAdj.has(e)) reverseAdj.set(e, []);
                reverseAdj.get(e).push(k);
            }
        }
        const dist = new Map();
        for (const k of visited) dist.set(k, Infinity);
        const dq = [];
        for (const k of goalPredecessors) {
            if (dist.get(k) > 1) { dist.set(k, 1); dq.push(k); }
        }
        let di = 0;
        while (di < dq.length) {
            const k = dq[di++];
            const preds = reverseAdj.get(k) || [];
            for (const p of preds) {
                if (dist.get(p) > dist.get(k) + 1) {
                    dist.set(p, dist.get(k) + 1);
                    dq.push(p);
                }
            }
        }
        return dist;
    }

    return {
        ACTIONS, spikeHitbox, overlaps, pureStepJoint, pureStepSingle, buildDistanceMap
    };
})();



// ============================================================
// The live controller: greedy/epsilon policy + planning burst +
// progressive-memorization attempt loop, exposed as a single
// per-frame entry point: stepController(). The caller (game.js)
// just needs to: apply the returned action's movingLeft/Right/Up
// flags for the real moving_collisions() to consume, and (if the
// real game reports a death that frame) call notifyDeathHandled()
// -- everything else (learning, memorization, planning) is internal.
// ============================================================

function createLearningController(blocks, spikes, canvasWidth, canvasHeight, opts) {
    opts = opts || {};
    const epsilon = opts.epsilon ?? 0.03;
    const epsilonStuck = opts.epsilonStuck ?? 0.35;
    const stuckWindow = opts.stuckWindow ?? 25;
    const slipRateSafe = opts.slipRateSafe ?? 0.0004;
    const slipRateHazard = opts.slipRateHazard ?? 0.05;
    const stagnationThreshold = opts.stagnationThreshold ?? 6;
    const planMaxNodes = opts.planMaxNodes ?? 60000;
    const planMaxDepth = opts.planMaxDepth ?? 150;
    const nearGoalThreshold = opts.nearGoalThreshold ?? 10;
    const thinkingDisplayMs = opts.thinkingDisplayMs ?? 700;

    const spikeBoxes = spikes.map(LearningAI.spikeHitbox);
    const d1 = LearningAI.buildDistanceMap(blocks, spikes, 0, 0, 0, 600, canvasHeight, [500, 0, 100, 100]);
    const d2 = LearningAI.buildDistanceMap(blocks, spikes, 600, 0, 600, 1200, canvasHeight, [1100, 0, 100, 100]);

    function h(p1x, p1y, p2x, p2y) {
        let da = d1.get(p1x + "," + p1y);
        let db = d2.get(p2x + "," + p2y);
        if (da === undefined || da === Infinity) da = 9999;
        if (db === undefined || db === Infinity) db = 9999;
        return Math.max(da, db);
    }

    function step(p1x, p1y, p2x, p2y, dx, up) {
        return LearningAI.pureStepJoint(blocks, spikeBoxes, p1x, p1y, p2x, p2y, dx, up, canvasWidth, canvasHeight);
    }

    const startH = h(0, 0, 600, 0);

    const S = {
        knownHazards: new Set(),
        bestPrefix: [],
        bestHEver: startH,
        attemptNumber: 1,
        currentFrame: 0,
        stuckCounter: 0,
        lastH: startH,
        currentAttemptActions: [],
        bestHThisAttempt: startH,
        bestHFrameThisAttempt: 0,
        stagnantAttempts: 0,
        totalGameFrames: 0,
        thinkingSecondsSpent: 0,
        thinking: false,
        thinkingUntil: 0,
        done: false,
        won: false,
        lastDeathHazardIdx: null,
    };

    function nearKnownHazard(p1x, p1y, p2x, p2y, margin) {
        margin = margin ?? 25;
        for (const idx of S.knownHazards) {
            const [l, t, r, b] = spikeBoxes[idx];
            const L = l - margin, T = t - margin, R = r + margin, B = b + margin;
            if ((p1x < R && p1x + 20 > L && p1y < B && p1y + 20 > T) ||
                (p2x < R && p2x + 20 > L && p2y < B && p2y + 20 > T)) {
                return true;
            }
        }
        return false;
    }

    function chooseLiveAction(p1x, p1y, p2x, p2y) {
        const curH = h(p1x, p1y, p2x, p2y);
        let eps;
        if (curH <= nearGoalThreshold) eps = 0.01;
        else eps = S.stuckCounter >= stuckWindow ? epsilonStuck : epsilon;

        if (Math.random() < eps) {
            const shuffled = LearningAI.ACTIONS.slice();
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled[0];
        }

        let best = null, bestScore = Infinity;
        for (const [dx, up] of LearningAI.ACTIONS) {
            const res = step(p1x, p1y, p2x, p2y, dx, up);
            let score;
            if (res.result === "WIN") score = -1;
            else if (res.result === "DEAD") {
                if (S.knownHazards.has(res.hazardIdx)) continue;
                score = 9999;
            } else {
                score = h(res.p1x, res.p1y, res.p2x, res.p2y);
            }
            if (score < bestScore) { bestScore = score; best = [dx, up]; }
        }
        return best || LearningAI.ACTIONS[Math.floor(Math.random() * LearningAI.ACTIONS.length)];
    }

    function planBurst(p1x, p1y, p2x, p2y) {
        const startKey = p1x + "," + p1y + "," + p2x + "," + p2y;
        const gScore = new Map([[startKey, 0]]);
        const cameFrom = new Map();
        const sH = h(p1x, p1y, p2x, p2y);
        let heap = [[sH, startKey, p1x, p1y, p2x, p2y, 0]];
        let bestKey = startKey, bestH = sH;
        let explored = 0;

        function heapPush(item) {
            heap.push(item);
            let i = heap.length - 1;
            while (i > 0) {
                const parent = (i - 1) >> 1;
                if (heap[parent][0] <= heap[i][0]) break;
                [heap[parent], heap[i]] = [heap[i], heap[parent]];
                i = parent;
            }
        }
        function heapPop() {
            const top = heap[0];
            const last = heap.pop();
            if (heap.length) {
                heap[0] = last;
                let i = 0;
                while (true) {
                    let l = 2 * i + 1, r = 2 * i + 2, smallest = i;
                    if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
                    if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
                    if (smallest === i) break;
                    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
                    i = smallest;
                }
            }
            return top;
        }

        while (heap.length && explored < planMaxNodes) {
            const [f, key, x1, y1, x2, y2, g] = heapPop();
            if (g > (gScore.get(key) ?? Infinity)) continue;
            explored++;
            if (g >= planMaxDepth) continue;
            const curH = h(x1, y1, x2, y2);
            if (curH < bestH) { bestH = curH; bestKey = key; }
            if (curH === 0) { bestKey = key; break; }
            for (const [dx, up] of LearningAI.ACTIONS) {
                const res = step(x1, y1, x2, y2, dx, up);
                if (res.result === "WIN") {
                    const path = [[dx, up]];
                    let s = key;
                    while (cameFrom.has(s)) { const [ps, pa] = cameFrom.get(s); path.push(pa); s = ps; }
                    path.reverse();
                    return path;
                }
                if (res.result === "DEAD") continue;
                const nk = res.p1x + "," + res.p1y + "," + res.p2x + "," + res.p2y;
                const ng = g + 1;
                if (ng < (gScore.get(nk) ?? Infinity)) {
                    gScore.set(nk, ng);
                    cameFrom.set(nk, [key, [dx, up]]);
                    heapPush([ng + h(res.p1x, res.p1y, res.p2x, res.p2y), nk, res.p1x, res.p1y, res.p2x, res.p2y, ng]);
                }
            }
        }

        if (bestKey === startKey) return null;
        const path = [];
        let s = bestKey;
        while (cameFrom.has(s)) { const [ps, pa] = cameFrom.get(s); path.push(pa); s = ps; }
        path.reverse();
        return path.length ? path : null;
    }

    function tryPlanBurstFromPrefixEnd() {
        let p1x = 0, p1y = 0, p2x = 600, p2y = 0;
        for (const [dx, up] of S.bestPrefix) {
            const res = step(p1x, p1y, p2x, p2y, dx, up);
            if (res.result !== "OK") return; // shouldn't happen; prefix was validated live
            p1x = res.p1x; p1y = res.p1y; p2x = res.p2x; p2y = res.p2y;
        }
        const burst = planBurst(p1x, p1y, p2x, p2y);
        S.thinkingSecondsSpent += 8;
        S.thinking = true;
        S.thinkingUntil = performance.now() + thinkingDisplayMs;
        if (burst) {
            S.bestPrefix = S.bestPrefix.concat(burst);
            let bx = p1x, by = p1y, cx = p2x, cy = p2y;
            for (const [dx, up] of burst) {
                const res = step(bx, by, cx, cy, dx, up);
                if (res.result === "WIN") { S.bestHEver = 0; bx = null; break; }
                bx = res.p1x; by = res.p1y; cx = res.p2x; cy = res.p2y;
            }
            if (bx !== null) {
                const endH = h(bx, by, cx, cy);
                if (endH < S.bestHEver) S.bestHEver = endH;
            }
        }
    }

    // Single per-frame entry point.
    // Returns {dx, up} to apply this frame, or null if the AI is 'thinking'
    // (caller should skip moving_collisions() that frame and show an indicator).
    const maxFramesPerAttempt = opts.maxFramesPerAttempt ?? 4000;

    function giveUpAttempt() {
        S.attemptNumber++;
        if (S.bestHThisAttempt < S.bestHEver) {
            S.bestHEver = S.bestHThisAttempt;
            S.bestPrefix = S.currentAttemptActions.slice(0, S.bestHFrameThisAttempt);
            S.stagnantAttempts = 0;
        } else {
            S.stagnantAttempts++;
        }
        S.currentAttemptActions = [];
        S.currentFrame = 0;
        S.bestHThisAttempt = startH;
        S.bestHFrameThisAttempt = 0;
        S.stuckCounter = 0;
        S.lastH = startH;
        if (S.stagnantAttempts >= stagnationThreshold && S.bestPrefix.length) {
            tryPlanBurstFromPrefixEnd();
            S.stagnantAttempts = 0;
        }
    }

    function stepController(p1x, p1y, p2x, p2y) {
        if (S.done) return null;

        if (S.thinking) {
            if (performance.now() < S.thinkingUntil) return null;
            S.thinking = false;
        }

        if (S.currentFrame >= maxFramesPerAttempt) {
            giveUpAttempt();
            return "RESET"; // caller should reset the real player positions to start
        }

        const usePrefix = S.currentFrame < S.bestPrefix.length;
        let action;
        if (usePrefix) {
            const nearHazard = nearKnownHazard(p1x, p1y, p2x, p2y);
            const slip = nearHazard ? slipRateHazard : slipRateSafe;
            action = (Math.random() >= slip) ? S.bestPrefix[S.currentFrame] : chooseLiveAction(p1x, p1y, p2x, p2y);
        } else {
            action = chooseLiveAction(p1x, p1y, p2x, p2y);
        }

        const [dx, up] = action;
        const outcome = step(p1x, p1y, p2x, p2y, dx, up);
        S.currentAttemptActions.push(action);
        S.totalGameFrames++;

        if (outcome.result === "WIN") {
            S.done = true;
            S.won = true;
            return action;
        }

        if (outcome.result === "DEAD") {
            S.lastDeathHazardIdx = outcome.hazardIdx;
            S.knownHazards.add(outcome.hazardIdx);
            giveUpAttempt();
            return action;
        }

        // OK
        S.currentFrame++;
        const newH = h(outcome.p1x, outcome.p1y, outcome.p2x, outcome.p2y);
        if (newH < S.bestHThisAttempt) {
            S.bestHThisAttempt = newH;
            S.bestHFrameThisAttempt = S.currentFrame;
        }
        if (newH >= S.lastH) S.stuckCounter++; else S.stuckCounter = 0;
        S.lastH = newH;
        return action;
    }

    return { state: S, stepController, h, spikeBoxes };
}
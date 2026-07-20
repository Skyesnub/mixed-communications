// ============================================================
// Human-friendly solutions — found with a search that penalizes
// (a) switching the up/down input rapidly, and (b) passing within
// 1 tile of a spike, when an equally-short alternative exists.
// Biases toward long holdable segments and more breathing room
// around hazards, over frame-perfect precision.
//
// The spike-avoidance penalty only changed the outcome for levels
// 2 and 3 (both improved from 0-tile to 1-tile clearance at a
// small frame cost). For levels 4-8, the search either couldn't
// converge in reasonable time with the extra penalty, or converged
// to a *longer* path with the same 0-tile clearance floor — meaning
// those levels have at least one unavoidable chokepoint where the
// path must pass through a spike's tile regardless. Those levels
// keep the switch-penalty-only solve, which is strictly better
// (shorter, same clearance). Levels 1 and 9 were already at 1-tile
// and 3-tile clearance respectively with no spikes nearby to avoid.
//
// Each run is [direction, up, frameCount]:
//   direction: -1 = left, 0 = none, 1 = right
//   up: whether the up-thrust key is held
// ============================================================

const level1SolutionHuman = [
    [0, false, 4],
    [1, false, 87],
    [1, true, 13],
    [0, true, 53],
    [1, true, 7],
];

const level2SolutionHuman = [
    [1, true, 48],
    [1, false, 32],
    [0, false, 13],
    [-1, false, 20],
    [1, false, 47],
    [1, true, 33],
    [0, true, 28],
    [-1, true, 7],
    [0, true, 7],
    [-1, true, 1],
    [0, true, 5],
    [-1, true, 2],
    [0, true, 3],
    [1, true, 7],
];

const level3SolutionHuman = [
    [1, false, 30],
    [0, false, 10],
    [1, false, 23],
    [-1, false, 17],
    [0, false, 10],
    [-1, false, 10],
    [0, false, 10],
    [-1, false, 10],
    [0, false, 7],
    [-1, false, 3],
    [1, false, 27],
    [1, true, 20],
    [0, true, 1],
    [1, true, 3],
    [0, true, 2],
    [1, true, 27],
    [0, true, 11],
    [1, true, 24],
    [0, true, 28],
    [1, true, 9],
    [0, true, 2],
    [1, true, 27],
    [1, false, 1],
];

const level4SolutionHuman = [
    [1, false, 27],
    [1, true, 11],
    [1, false, 15],
    [1, true, 10],
    [1, false, 23],
    [0, false, 13],
    [-1, false, 34],
    [0, false, 5],
    [-1, false, 4],
    [1, false, 12],
    [1, true, 12],
    [1, false, 29],
    [1, true, 22],
    [0, true, 6],
    [1, true, 13],
    [0, true, 60],
];

const level5SolutionHuman = [
    [1, true, 33],
    [1, false, 17],
    [0, false, 33],
    [-1, false, 3],
    [-1, true, 4],
    [-1, false, 17],
    [0, false, 12],
    [1, false, 14],
    [1, true, 3],
    [0, true, 1],
    [1, false, 29],
    [1, true, 12],
    [0, true, 10],
    [1, true, 22],
    [0, true, 27],
    [1, true, 40],
];

const level6SolutionHuman = [
    [0, false, 17],
    [1, false, 20],
    [0, false, 10],
    [1, false, 2],
    [0, false, 47],
    [1, false, 32],
    [1, true, 23],
    [1, false, 6],
    [1, true, 7],
    [0, true, 20],
    [1, true, 10],
    [0, true, 10],
    [-1, true, 48],
    [1, true, 1],
    [0, true, 1],
    [1, true, 45],
    [1, false, 1],
];

const level7SolutionHuman = [
    [1, false, 23],
    [0, false, 1],
    [-1, false, 4],
    [1, false, 8],
    [0, false, 7],
    [1, true, 11],
    [1, false, 10],
    [1, true, 10],
    [1, false, 11],
    [0, false, 6],
    [1, false, 1],
    [0, false, 9],
    [-1, false, 38],
    [0, false, 16],
    [1, false, 14],
    [0, false, 17],
    [1, false, 35],
    [1, true, 16],
    [1, false, 4],
    [1, true, 5],
    [0, true, 1],
    [1, true, 7],
    [0, true, 6],
    [1, true, 16],
    [-1, true, 2],
    [0, true, 78],
];

const level8SolutionHuman = [
    [1, true, 30],
    [1, false, 7],
    [0, false, 4],
    [1, false, 13],
    [0, false, 5],
    [-1, false, 4],
    [1, false, 4],
    [0, false, 1],
    [1, false, 6],
    [-1, false, 30],
    [0, false, 13],
    [1, false, 3],
    [1, true, 4],
    [1, false, 19],
    [0, false, 6],
    [1, false, 36],
    [1, true, 15],
    [0, true, 10],
    [1, true, 8],
    [0, true, 80],
];

const level9SolutionHuman = [
    [1, true, 96],
    [1, false, 1],
];

// level number -> compressed run-length solution
const humanFriendlySolutions = {
    1: level1SolutionHuman,
    2: level2SolutionHuman,
    3: level3SolutionHuman,
    4: level4SolutionHuman,
    5: level5SolutionHuman,
    6: level6SolutionHuman,
    7: level7SolutionHuman,
    8: level8SolutionHuman,
    9: level9SolutionHuman,
};
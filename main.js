const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const p1xC = 0
const p2xC = 600
const p1yC = 0
const p2yC = 0

let p1x = p1xC
let p2x = p2xC
let p1y = p1yC
let p2y = p2yC

let pWidthHeight = 20
let pSpeed = 5

let movingUp = false;
let movingRight = false;
let movingLeft = false;

let level = 0;

let blocks = []
let spikes = []
let decors = []

let end1X = 500
let end1Y = 0

let end2X = 1100
let end2Y = 0

let p1InEnd = false
let p2InEnd = false

//imagez
let blockImg = new Image();
blockImg.src = "./images-folder/block.png";

let decorBlockImg = new Image();
decorBlockImg.src = "./images-folder/decor-block.png"

let leftSpike = new Image(); leftSpike.src = "./images-folder/left-spike.png";
let rightSpike = new Image(); rightSpike.src = "./images-folder/right-spike.png";
let upSpike = new Image(); upSpike.src = "./images-folder/up-spike.png";
let downSpike = new Image(); downSpike.src = "./images-folder/down-spike.png";

let infoP = document.getElementById("info-paragraph");
let onInfoP = true;


// ============================================================
// Autonomous playback mode
// ============================================================
// Solution data lives in solutions-optimal.js (mathPerfectSolutions)
// and solutions-human.js (humanFriendlySolutions) — both must be
// loaded before this file. 'r' plays the frame-optimal solve for
// the current level, 'h' plays the human-friendly one. Both are
// gated behind a password prompt (not real security — just a
// "did you mean to do that" speed bump).

const ADMIN_PASSWORD = "admin";

let autoPlay = false;
let autoPlayFrame = 0;
let autoPlaySequence = [];
let autoPlayLabel = "";

function checkAdminPassword() {
    const pw = prompt("Admin password:");
    return pw === ADMIN_PASSWORD;
}

function expandSolution(runs) {
    const frames = [];
    for (const [dir, up, count] of runs) {
        for (let i = 0; i < count; i++) {
            frames.push({ left: dir === -1, right: dir === 1, up: up });
        }
    }
    return frames;
}

function jumpToLevel(levelNum) {
    level = levelNum;
    if (levelNum === 1) { blocks = blocks1; spikes = spikes1; decors = decors1 }
    if (levelNum === 2) { blocks = blocks2; spikes = spikes2; decors = decors2 }
    if (levelNum === 3) { blocks = blocks3; spikes = spikes3; decors = decors3 }
    if (levelNum === 4) { blocks = blocks4; spikes = spikes4; decors = decors4 }
    if (levelNum === 5) { blocks = blocks5; spikes = spikes5; decors = decors5 }
    if (levelNum === 6) { blocks = blocks6; spikes = spikes6; decors = decors6 }
    if (levelNum === 7) { blocks = blocks7; spikes = spikes7; decors = decors7 }
    if (levelNum === 8) { blocks = blocks8; spikes = spikes8; decors = decors8 }
    if (levelNum === 9) { blocks = blocks9; spikes = spikes9; decors = decors9 }
    death();
}

function startAutoPlay(levelNum, solutionSet, label) {
    const solution = solutionSet[levelNum];
    if (!solution) {
        console.log(`No ${label} solution recorded for level ${levelNum}.`);
        return;
    }
    jumpToLevel(levelNum);
    autoPlaySequence = expandSolution(solution);
    autoPlayFrame = 0;
    autoPlay = true;
    autoPlayLabel = label;
    movingLeft = false;
    movingRight = false;
    movingUp = false;
    console.log(`Autoplay started [${label}]: level ${levelNum}, ${autoPlaySequence.length} frames`);
}
// ============================================================


document.addEventListener("keydown", e => {
    if (e.key === "q") {
        level = (prompt("What level?"))-1
        changeLevel()
    }
    if (e.key === "r") {
        if (checkAdminPassword()) {
            startAutoPlay(level, mathPerfectSolutions, "MATH-PERFECT");
        }
    }
    if (e.key === "i") {
        onInfoP = !onInfoP
        infoP.classList.toggle("hidden", !onInfoP)
    }
    if (e.key === "h") {
        if (checkAdminPassword()) {
            startAutoPlay(level, humanFriendlySolutions, "HUMAN-FRIENDLY");
        }
    }
    if (e.key === "ArrowUp") {
        movingUp = true;
    }
    if (e.key === "ArrowLeft") {
        movingLeft = true;
    }
    if (e.key === "ArrowRight") {
        movingRight = true;
    }
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowUp") {
        movingUp = false;
    }
    if (e.key === "ArrowLeft") {
        movingLeft = false;
    }
    if (e.key === "ArrowRight") {
        movingRight = false;
    }
});

function changeLevel() {
    level += 1
    if (level == 1) {blocks = blocks1; spikes = spikes1; decors = decors1}
    if (level == 2) {blocks = blocks2; spikes = spikes2; decors = decors2}
    if (level == 3) {blocks = blocks3; spikes = spikes3; decors = decors3}
    if (level == 4) {blocks = blocks4; spikes = spikes4; decors = decors4}
    if (level == 5) {blocks = blocks5; spikes = spikes5; decors = decors5}
    if (level == 6) {blocks = blocks6; spikes = spikes6; decors = decors6}
    if (level == 7) {blocks = blocks7; spikes = spikes7; decors = decors7}
    if (level == 8) {blocks = blocks8; spikes = spikes8; decors = decors8}
    if (level == 9) {blocks = blocks9; spikes = spikes9; decors = decors9}

    death()
}

changeLevel()

function death() {
    p1x = p1xC
    p2x = p2xC
    p1y = p1yC
    p2y = p2yC
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //decors
    for (const decor of decors) {
        ctx.drawImage(decorBlockImg, decor[0], decor[1])
    }

    //players
    ctx.fillStyle = "red"
    ctx.fillRect(p1x, p1y, pWidthHeight, pWidthHeight)

    ctx.fillStyle = "blue"
    ctx.fillRect(p2x, p2y, pWidthHeight, pWidthHeight)

    //spiks
    ctx.fillStyle = "red";

    for (const spike of spikes) {
        let spikeLeft;
        let spikeRight;
        let spikeTop;
        let spikeDown;

        if (spike[2] === "down") {
            ctx.drawImage(downSpike, spike[0], spike[1])
        }

        if (spike[2] === "up") {
            ctx.drawImage(upSpike, spike[0], spike[1])
        }

        if (spike[2] === "left") {
            ctx.drawImage(leftSpike, spike[0], spike[1])
        }

        if (spike[2] === "right") {
            ctx.drawImage(rightSpike, spike[0], spike[1])
        }
    }

    //blocks
    for (const block of blocks) {
        ctx.drawImage(blockImg, block[0], block[1], 50, 50)
    }

    //layering for blue and red side
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "red";
    ctx.fillRect(0,0,600, canvas.height)
    ctx.fillStyle = "blue";
    ctx.fillRect(600,0,600, canvas.height)
    ctx.globalAlpha = 1;

    //ends
    ctx.globalAlpha = 0.5

    if (p1InEnd && !levelChangeAnimOn) {ctx.fillStyle = "#00FF00"} else {ctx.fillStyle = "red"}
    ctx.fillRect(end1X, end1Y, 100, 100)

    if (p2InEnd && !levelChangeAnimOn) {ctx.fillStyle = "#00FF00"} else {ctx.fillStyle = "red"}
    ctx.fillRect(end2X, end2Y, 100, 100)
    ctx.globalAlpha = 1

    //border wall
    ctx.fillStyle = "purple";
    ctx.fillRect(600,0,1, canvas.height)

    // autoplay indicator
    if (autoPlay) {
        ctx.fillStyle = "#00FF00";
        ctx.font = "16px monospace";
        ctx.fillText(`AUTO [${autoPlayLabel}]  frame ${autoPlayFrame}/${autoPlaySequence.length}`, 10, 20);
    }

}

function moving_collisions() {
    //initially
    if (movingLeft) {
        p1x -= pSpeed
        p2x -= pSpeed
    }
    if (movingRight) {
        p1x += pSpeed
        p2x += pSpeed
    }

    //actual collision stuff
    for (const block of blocks) {
        //makin it easier
        const blockLeft = block[0]
        const blockRight = block[0] + 50
        const blockTop = block[1]
        const blockBottom = block[1] + 50

        //hori
        //p1
        if (
            p1x < blockRight &&
            p1x + pWidthHeight > blockLeft &&
            p1y < blockBottom &&
            p1y + pWidthHeight > blockTop
        ) {

                if (movingRight) {
                    p1x = blockLeft - pWidthHeight
                }
                if (movingLeft) {
                    p1x = blockRight
                }
            }
        //p2
        if (
            p2x < blockRight &&
            p2x + pWidthHeight > blockLeft &&
            p2y < blockBottom &&
            p2y + pWidthHeight > blockTop
        ) {
                if (movingRight) {
                    p2x = blockLeft - pWidthHeight
                }
                if (movingLeft) {
                    p2x = blockRight
                }
            }
        }

        //hori wall and sides of screen, p1 and p2
        if (p1x + pWidthHeight > 600) {p1x = 600 - pWidthHeight}
        if (p1x < 0) {p1x = 0}
        if (p2x < 600) {p2x = 600}
        if (p2x + pWidthHeight > canvas.width) {p2x = canvas.width - pWidthHeight}
        
        //do vertical init stuff
        if (movingUp) {
            p1y -= pSpeed
            p2y -= pSpeed
        }
        else {
            p1y += pSpeed
            p2y += pSpeed
        }
        for (const block of blocks) {
            const blockLeft = block[0]
            const blockRight = block[0] + 50
            const blockTop = block[1]
            const blockBottom = block[1] + 50
            //verti
            //p1
            if (
                p1x < blockRight &&
                p1x + pWidthHeight > blockLeft &&
                p1y < blockBottom &&
                p1y + pWidthHeight > blockTop
            ) {
                if (!movingUp) {
                    p1y = blockTop - pWidthHeight
                }
                else {
                    p1y = blockBottom
                }
            }
            //p2
            if (
                p2x < blockRight &&
                p2x + pWidthHeight > blockLeft &&
                p2y < blockBottom &&
                p2y + pWidthHeight > blockTop
            ) {
                if (!movingUp) {
                    p2y = blockTop - pWidthHeight
                }
                else {
                    p2y = blockBottom
                }
            }
        }
    //verti roof and floor, p1 and p2
    if (p1y + pWidthHeight > canvas.height) {p1y = canvas.height - pWidthHeight}
    if (p2y + pWidthHeight > canvas.height) {p2y = canvas.height - pWidthHeight}
    if (p1y < 0) {p1y = 0}
    if (p2y < 0) {p2y = 0}

    //after all collisions check if in end zone
    if (p1x + pWidthHeight > end1X &&
        p1x < end1X + 100 &&
        p1y + pWidthHeight > end1Y &&
        p1y < end1Y + 100
    ) {
        p1InEnd = true
    } else {p1InEnd = false}
    if (p2x + pWidthHeight > end2X &&
        p2x < end2X + 100 &&
        p2y + pWidthHeight > end2Y &&
        p2y < end2Y + 100
    ) {
        p2InEnd = true
    } else {p2InEnd = false}

    //also after allat do spiks
    for (const spike of spikes) {
        let spikeLeft;
        let spikeRight;
        let spikeTop;
        let spikeDown;



        if (spike[2] === "down") {
            spikeLeft = spike[0] + 10;
            spikeRight = spikeLeft + 30;
            spikeTop = spike[1];
            spikeDown = spikeTop + 7;
        }

        if (spike[2] === "up") {
            spikeLeft = spike[0] + 10;
            spikeRight = spikeLeft + 30;
            spikeTop = spike[1] + 43;
            spikeDown = spikeTop + 7;
        }

        if (spike[2] === "left") {
            spikeLeft = spike[0] + 43;
            spikeRight = spikeLeft + 7;
            spikeTop = spike[1] + 10;
            spikeDown = spikeTop + 30;
        }

        if (spike[2] === "right") {
            spikeLeft = spike[0];
            spikeRight = spikeLeft + 7;
            spikeTop = spike[1] + 10;
            spikeDown = spikeTop + 30;


        }
        //hbes
        //ctx.fillStyle= "red"
        //ctx.fillRect(spikeLeft, spikeTop, spikeRight-spikeLeft, spikeDown-spikeTop)

        if (p1x < spikeRight &&
            p1x + pWidthHeight > spikeLeft &&
            p1y < spikeDown &&
            p1y + pWidthHeight > spikeTop) {
                console.log("death")
                death()
            }
        if (p2x < spikeRight &&
            p2x + pWidthHeight > spikeLeft &&
            p2y < spikeDown &&
            p2y + pWidthHeight > spikeTop) {
                console.log("death")
                death()
            }
    }

    //now winning
    if (p1InEnd && p2InEnd) {
        console.log("win", level)
        levelChangeAnimOn = true;
        levelChangeAnimTimer = 0;
    }
    
}

let levelChangeAnimOn = false;
let levelChangeAnimTimer = 0;


function animate() {
    draw()

    if (autoPlay) {
        if (autoPlayFrame < autoPlaySequence.length) {
            const f = autoPlaySequence[autoPlayFrame];
            movingLeft = f.left;
            movingRight = f.right;
            movingUp = f.up;
            autoPlayFrame++;
        } else {
            autoPlay = false;
            movingLeft = false;
            movingRight = false;
            movingUp = false;
        }
    }

    if (!levelChangeAnimOn) {moving_collisions()}
    

    if (levelChangeAnimOn) {
        p1InEnd, p2InEnd = false;

        ctx.fillStyle = "black"
        levelChangeAnimTimer += 0.25
        if (levelChangeAnimTimer <= 10) {
            // Fade in
            ctx.globalAlpha = levelChangeAnimTimer / 10;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        else if (levelChangeAnimTimer <= 20) {
            // Fade out
            ctx.globalAlpha = 1 - ((levelChangeAnimTimer - 10) / 10);
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        else {
            levelChangeAnimOn = false;
            ctx.globalAlpha = 1;
        };
        if (levelChangeAnimTimer == 10) {
            changeLevel()
        }
    }


    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)
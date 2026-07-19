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

let blocks1 = [[0,200],[50,200],[50,250],[50,300],[50,350],[50,400],[50,450],[50,500],[50,550],[50,600],[50,650],[600,200],[650,200],[650,250],[650,300],[650,350],[650,450],[650,500],[650,400],[650,550],[650,600],[650,650],[1200,650],[1200,600],[1200,550],[1200,450],[1200,500],[1200,400],[1200,350],[1200,250],[1200,300],[1200,200],[1200,150],[1200,100],[1200,50],[1200,0],[950,0],[950,50],[950,100],[950,150],[950,200],[950,250],[250,550],[250,600],[250,650],[350,350],[400,350],[550,350],[500,350],[1050,350],[1150,350],[1000,350],[1000,250],[1000,300],[350,300],[350,250],[350,200],[350,150],[350,100],[350,50],[350,0]]
let spikes1 = [[200,550,"left"],[900,250,"left"],[900,200,"left"],[250,500,"up"],[300,550,"right"],[1000,200,"right"],[950,300,"down"]]
let decors1 = [[0,250],[0,300],[0,350],[0,400],[0,450],[0,500],[0,550],[0,600],[0,650],[600,250],[600,300],[600,350],[600,400],[600,450],[600,500],[600,550],[600,600],[600,650],[1000,400],[1050,400],[1050,450],[1000,450],[1000,500],[1050,500],[1050,550],[1000,550],[1000,600],[1050,600],[1050,650],[1000,650],[750,250],[750,300],[800,350],[800,400],[700,250],[700,200],[700,300],[750,350],[700,350],[700,400],[750,400],[800,450],[750,450],[700,450],[700,500],[750,500],[800,500],[850,500],[850,550],[850,600],[900,600],[900,650],[850,650],[800,650],[750,650],[700,650],[700,600],[750,600],[800,600],[800,550],[750,550],[700,550]]

let blocks2 = [[600,150],[650,150],[650,450],[650,500],[650,550],[650,600],[650,650],[0,150],[50,150],[50,200],[50,250],[50,300],[50,350],[50,400],[50,450],[50,500],[50,600],[50,550],[50,650],[200,0],[200,50],[200,100],[200,150],[200,200],[950,150],[900,150],[850,150],[800,150],[750,150],[700,150],[1050,0],[1050,50],[1050,100],[1050,150],[1050,200],[1050,250],[1050,300],[1150,100],[200,250],[200,300],[200,350],[1050,350],[1150,650],[1150,450],[1150,500],[1150,550],[1150,600],[750,200],[750,250],[750,300],[750,350],[750,400],[750,450],[700,450],[250,350],[300,350],[350,350],[400,350],[450,350]]
let spikes2 = [[800,100,"up"],[950,0,"down"],[1150,150,"down"],[1000,350,"left"],[1100,650,"left"],[800,400,"right"],[450,650,"up"],[250,650,"up"],[400,400,"down"],[300,400,"down"]]
let decors2 = [[0,200],[0,250],[0,300],[0,350],[0,400],[0,450],[0,500],[0,550],[0,600],[0,650],[600,200],[600,250],[600,300],[600,350],[600,400],[600,500],[600,550],[600,650],[600,600],[700,200],[700,300],[700,250],[700,350],[700,400],[650,200],[650,250],[650,300],[650,350],[650,400],[600,450]]

let blocks3 = [[600,100],[650,100],[600,150],[600,200],[650,200],[700,200],[700,150],[700,100],[0,100],[100,100],[50,100],[100,150],[100,200],[50,200],[0,200],[0,150],[850,0],[850,50],[850,100],[850,150],[850,200],[500,100],[200,350],[250,350],[300,350],[350,350],[1100,100],[1050,100],[950,100],[950,150],[950,200],[950,250],[950,300],[950,350],[950,400],[950,450],[950,550],[950,500],[950,600],[950,650],[850,600],[900,600],[800,600],[750,600],[650,600],[700,600],[650,650],[1150,100],[1000,100],[200,450],[250,450],[150,450],[300,450],[350,450],[350,550],[300,550],[250,550],[200,550],[150,550],[50,650],[100,650],[150,650],[200,650],[250,650],[300,650],[350,650],[400,0],[400,50],[400,100],[400,150],[400,200],[400,250],[400,300],[400,350],[400,450],[400,500],[400,550],[400,650],[400,400],[450,100],[450,50],[450,0],[100,550]]
let spikes3 = [[150,200,"right"],[800,100,"left"],[800,0,"left"],[800,50,"left"],[950,50,"up"],[900,550,"up"],[850,550,"up"],[800,550,"up"],[750,550,"up"],[700,550,"up"],[650,550,"up"],[350,300,"up"],[350,500,"down"],[500,150,"down"],[500,650,"up"],[550,650,"up"]]
let decors3 = [[50,150],[650,150],[700,650],[750,650],[800,650],[850,650],[900,650],[250,400],[300,400],[200,400],[150,500],[200,500],[250,500],[300,500],[300,600],[250,600],[200,600],[150,600],[100,600],[350,400],[350,600],[400,600]]

let blocks4 = [[600,100],[650,100],[650,150],[650,200],[600,200],[0,250],[50,250],[800,100],[750,100],[700,100],[150,100],[200,100],[100,100],[100,50],[100,0],[1050,0],[1050,50],[1150,100],[1050,100],[800,150],[850,150],[900,150],[950,150],[1050,150],[1050,200],[1050,250],[950,200],[950,250],[950,300],[1050,300],[1050,400],[1000,400],[950,400],[1050,350],[100,250],[150,250],[200,250],[100,350],[150,350],[200,350],[250,350],[300,350],[150,650],[150,600],[150,550],[200,550],[250,550],[250,600],[1150,150],[1150,200],[1150,250],[1150,300],[1150,350],[1150,400],[1150,450],[1150,500],[1150,550],[1150,600],[1150,650],[300,600],[350,600],[400,600],[450,600],[500,600],[350,350],[400,350],[450,350],[550,100],[550,200],[550,250],[550,300],[550,350],[550,400],[550,450],[550,500],[450,100],[450,150],[450,200],[450,250],[450,300],[400,100],[400,50],[400,0],[600,500],[650,500],[700,500],[750,500],[800,500],[800,550],[800,600],[800,650],[450,50],[450,0],[550,150],[550,550],[550,600],[550,650]]
let spikes4 = [[750,50,"up"],[800,50,"up"],[150,150,"down"],[200,150,"down"],[850,100,"up"],[900,100,"up"],[950,100,"up"],[200,500,"up"],[300,400,"down"],[1100,400,"left"],[1100,200,"right"],[400,300,"up"],[400,150,"down"],[600,450,"up"],[650,450,"up"]]
let decors4 = [[600,150],[0,300],[150,300],[100,300],[50,300],[200,300],[0,350],[50,350],[200,400],[150,450],[150,500],[100,550],[100,600],[50,650],[0,650],[0,600],[50,600],[50,550],[0,550],[0,500],[50,500],[100,500],[100,450],[50,450],[0,450],[0,400],[50,400],[100,400],[150,400],[200,600],[200,650],[250,650],[300,650],[350,650],[400,650],[450,650],[500,650],[100,650],[950,450],[1000,450],[1050,450],[1050,500],[1000,500],[950,500],[950,550],[1000,550],[1050,550],[1050,600],[1000,600],[950,600],[950,650],[1000,650],[1050,650],[950,350],[1000,350],[1000,300],[1000,250],[1000,200],[1000,150],[600,550],[600,600],[600,650],[650,650],[650,600],[650,550],[700,550],[700,600],[700,650],[750,650],[750,600],[750,550]]

let blocks5 = [[500,100],[450,50],[450,0],[450,100],[600,100],[650,100],[650,200],[650,250],[650,300],[650,350],[650,400],[650,450],[650,500],[650,550],[650,600],[650,650],[0,550],[50,550],[150,600],[250,450],[350,600],[350,650],[100,550],[100,0],[100,50],[100,100],[100,150],[100,200],[100,250],[100,350],[100,300],[100,400],[150,550],[250,400],[250,350],[200,350],[150,350],[1150,100],[1100,100],[1050,100],[1050,0],[1050,150],[1050,200],[1050,250],[1050,300],[1050,350],[1050,400],[1050,450],[1050,500],[1050,550],[1050,600],[1050,650],[350,350],[300,350],[450,250],[450,300],[450,400],[450,350],[450,450],[450,500],[450,550],[450,600],[400,600],[450,650],[250,300],[250,250],[250,150],[250,200],[250,100],[250,50],[300,50],[350,50],[400,50],[700,100],[750,100],[800,100],[800,150],[800,200],[750,200],[700,200],[950,350],[900,350],[850,350],[800,350],[750,350],[950,300],[950,250],[950,200],[950,150],[950,100],[950,50],[950,0],[750,500],[800,500],[900,500],[900,600],[950,600],[850,600],[800,600],[750,600],[750,650],[1000,600],[900,450],[900,400],[300,650],[250,650],[200,650],[150,650]]
let spikes5 = [[350,550,"up"],[250,500,"down"],[100,450,"down"],[350,300,"up"],[350,400,"down"],[450,200,"up"],[750,50,"up"],[800,50,"up"],[750,300,"up"],[800,300,"up"],[850,300,"up"],[900,300,"up"],[800,450,"up"],[750,450,"up"],[700,650,"up"],[800,550,"down"]]
let decors5 = [[600,150],[600,200],[600,250],[600,300],[600,350],[600,400],[600,450],[600,500],[600,550],[600,600],[600,650],[0,600],[0,650],[50,600],[50,650],[100,650],[100,600],[200,400],[150,400],[150,450],[200,450],[200,500],[150,500],[200,550],[1150,150],[1100,150],[1100,200],[1150,200],[1150,250],[1100,250],[1100,300],[1150,300],[1150,400],[1100,350],[1150,350],[1100,400],[1100,450],[1150,450],[1150,500],[1100,500],[1100,550],[1150,550],[1150,600],[1100,600],[1100,650],[1150,650],[400,650],[200,0],[150,0],[150,50],[200,50],[200,100],[150,100],[150,150],[200,150],[200,200],[150,200],[150,250],[200,250],[200,300],[150,300],[250,0],[300,0],[350,0],[400,0],[650,150],[750,150],[700,150],[800,650],[850,650],[900,650],[950,650],[1000,650]]

let blocks6 = [[600,300],[650,300],[650,350],[650,400],[650,450],[650,500],[650,550],[650,600],[650,650],[0,100],[50,100],[50,150],[50,200],[50,250],[50,300],[50,350],[50,450],[50,400],[50,500],[50,550],[50,600],[800,400],[200,0],[200,50],[200,100],[200,150],[200,200],[200,250],[300,150],[350,150],[400,150],[300,400],[200,400],[250,400],[350,400],[400,400],[950,100],[950,250],[950,300],[800,0],[800,50],[800,100],[800,200],[800,150],[800,250],[800,300],[500,100],[550,100],[450,100],[450,150],[200,300],[200,350],[300,650],[300,600],[300,550],[550,300],[500,300],[500,350],[500,400],[500,450],[500,500],[500,550],[500,600],[500,650],[100,600],[150,600],[200,600],[250,600],[550,150],[550,200],[550,250],[1100,100],[1050,100],[1000,100],[1100,350],[1100,300],[1100,250],[800,350],[800,450],[800,500],[800,550],[850,550],[900,550],[950,550],[1100,500],[1100,550],[1100,600],[1100,650],[1100,400],[1100,450],[1000,400],[1050,250],[950,350],[950,400],[850,400],[900,400],[1150,100],[1150,250],[1150,200],[1150,150]]
let spikes6 = [[100,150,"right"],[100,200,"right"],[150,300,"left"],[150,350,"left"],[100,550,"up"],[150,550,"up"],[200,550,"up"],[250,550,"up"],[300,350,"up"],[250,350,"up"],[400,450,"down"],[350,650,"up"],[800,600,"down"],[850,500,"up"],[900,500,"up"],[950,500,"up"],[900,0,"down"],[850,0,"down"],[1050,50,"up"],[950,650,"up"],[950,150,"down"],[400,100,"up"]]
let decors6 = [[600,350],[550,350],[550,400],[600,400],[600,450],[550,450],[550,500],[600,500],[600,550],[550,550],[550,600],[600,650],[600,600],[550,650],[50,650],[100,650],[150,650],[250,650],[200,650],[0,650],[0,600],[0,550],[0,500],[0,450],[0,400],[0,250],[0,300],[0,350],[0,150],[0,200],[500,250],[500,200],[500,150],[450,200],[450,250],[400,200],[400,250],[400,300],[400,350],[350,350],[350,300],[350,250],[350,200],[300,200],[300,250],[1150,300],[1150,350],[1150,400],[1150,450],[1150,500],[1150,550],[1150,600],[1150,650],[850,600],[850,650],[900,650],[900,600],[1100,200],[1050,150],[1050,200],[1100,150],[1000,200],[1000,150],[1000,250],[1000,350],[1000,300],[1050,300],[1050,350],[1050,400],[1050,450],[1050,500],[1050,550],[1050,600],[1050,650]]

let blocks7 = [[0,150],[50,150],[50,200],[50,250],[50,300],[50,350],[50,400],[50,450],[50,500],[50,550],[50,600],[50,650],[600,150],[650,150],[650,200],[650,250],[650,300],[650,350],[650,400],[650,450],[650,500],[650,550],[650,600],[650,650],[150,100],[150,50],[900,150],[850,150],[800,150],[750,150],[700,150],[100,250],[150,250],[200,250],[200,100],[250,100],[300,100],[250,250],[300,250],[450,0],[450,50],[550,100],[450,100],[550,150],[550,200],[550,250],[550,300],[550,350],[550,400],[550,500],[550,450],[550,550],[550,600],[550,650],[1100,100],[1050,100],[1000,300],[950,300],[900,300],[850,300],[800,300],[800,500],[800,550],[800,450],[900,350],[900,400],[900,450],[900,500],[1000,200],[1000,250],[800,600],[800,650],[200,500],[200,450],[250,450],[350,450],[300,450],[400,450],[450,450],[450,150],[450,200],[450,250],[450,300],[450,350],[450,400],[250,350],[200,350],[300,350],[300,400],[200,400],[1000,600],[1050,600],[1100,600],[1050,300],[1100,300],[1100,350],[1100,400],[1100,450],[1100,500],[1100,550],[1000,150],[1000,100],[350,650],[400,500],[450,650],[300,500],[1000,0],[1000,50],[1050,0],[1050,50]]
let spikes7 = [[150,150,"down"],[750,100,"up"],[800,100,"up"],[850,100,"up"],[900,100,"up"],[150,0,"up"],[100,0,"down"],[200,150,"down"],[250,150,"down"],[300,150,"down"],[950,0,"down"],[800,400,"up"],[800,350,"down"],[200,650,"up"],[200,550,"down"],[150,400,"left"],[100,500,"right"],[900,550,"down"],[1000,550,"up"],[1050,550,"up"],[1150,450,"left"],[350,600,"up"],[450,600,"up"],[300,550,"down"],[400,550,"down"],[500,450,"right"],[500,300,"left"],[500,150,"right"],[200,0,"down"]]
let decors7 = [[600,200],[600,250],[600,300],[600,350],[600,400],[600,450],[600,500],[600,550],[600,600],[600,650],[0,200],[0,250],[0,300],[0,350],[0,450],[0,500],[0,550],[0,600],[0,650],[0,400],[250,400],[1050,400],[1000,400],[950,500],[950,450],[950,400],[950,350],[1000,350],[1050,350],[950,600],[950,550],[950,650],[1000,650],[1050,650],[850,350],[850,400],[850,550],[850,450],[850,500],[850,600],[850,650],[900,650],[1050,150],[1050,200],[1050,250],[1100,250],[1100,200],[1100,150],[250,500],[250,550],[250,600],[250,650],[200,300],[250,300],[300,300],[250,50],[250,0],[300,0],[300,50]]

let blocks8 = [[0,100],[50,100],[50,150],[50,200],[50,250],[50,400],[50,300],[50,350],[50,450],[600,100],[650,100],[650,150],[650,200],[650,250],[650,300],[650,350],[650,400],[650,450],[650,500],[650,550],[650,600],[650,650],[450,0],[450,50],[450,100],[500,100],[1050,0],[1050,100],[100,200],[150,200],[200,200],[800,50],[800,100],[800,150],[800,200],[800,250],[800,300],[1000,250],[950,250],[900,250],[800,450],[850,450],[900,450],[950,450],[700,200],[750,200],[800,500],[900,350],[1050,150],[1050,200],[1050,250],[1050,350],[1050,400],[1050,450],[1150,400],[1150,450],[1150,500],[1150,550],[1150,600],[1150,650],[150,300],[200,300],[250,300],[300,300],[350,300],[400,300],[350,100],[350,150],[350,200],[350,250],[350,400],[350,450],[350,500],[150,450],[200,450],[200,500],[200,550],[200,600],[200,650],[100,450],[350,350],[250,650],[300,650],[350,650],[450,300],[450,350],[450,400],[450,450],[450,500],[450,550],[400,100],[850,150],[750,600],[800,600],[800,550],[700,600],[500,400],[500,450],[1050,50],[1050,300]]
let spikes8 = [[100,150,"up"],[150,150,"up"],[200,150,"up"],[900,300,"up"],[900,400,"down"],[750,250,"down"],[1000,0,"down"],[950,0,"down"],[1150,350,"up"],[300,450,"left"],[300,500,"left"],[250,450,"right"],[250,500,"right"],[200,400,"up"],[250,600,"up"],[300,600,"up"],[450,150,"down"],[450,250,"up"],[550,300,"left"],[550,350,"left"],[550,400,"left"],[500,500,"right"],[500,550,"right"],[800,400,"up"],[750,150,"up"],[1000,200,"up"],[850,100,"up"],[700,550,"up"],[750,550,"up"],[300,250,"up"],[300,350,"down"],[550,650,"up"],[500,650,"up"],[900,650,"up"],[950,650,"up"],[1000,650,"up"],[1050,650,"up"],[1100,650,"up"],[700,650,"right"],[750,650,"down"],[1050,500,"down"]]
let decors8 = [[450,600],[0,150],[0,200],[0,250],[0,300],[0,350],[0,400],[0,450],[0,500],[0,550],[0,600],[0,650],[600,150],[600,200],[600,250],[600,300],[600,350],[600,400],[600,500],[600,550],[600,650],[600,600],[600,450],[750,350],[700,350],[700,400],[750,400],[750,450],[700,450],[700,250],[700,300],[750,300],[950,300],[1000,300],[1000,350],[950,350],[1000,400],[950,400],[1100,450],[1100,500],[1100,550],[850,600],[900,550],[850,550],[850,500],[900,500],[950,500],[1000,500],[50,650],[50,600],[50,550],[50,500],[100,500],[150,500],[150,550],[100,550],[100,600],[150,600],[150,650],[100,650],[400,350],[400,400],[400,450],[400,500],[400,550],[400,600],[400,650],[450,650],[350,550],[200,250],[150,250],[100,250],[100,300],[100,350],[100,400],[150,400],[150,350],[750,500],[500,350],[500,300],[500,250],[500,200],[500,150],[400,150],[400,200],[400,250],[1100,0],[1100,50],[1100,100],[1150,100],[1150,50],[1150,0],[1100,150],[1150,150],[1150,200],[1100,200],[1100,250],[1100,300],[1000,450],[1100,350],[1100,400],[800,650],[850,650]]


let blocks9 = [[650,200],[650,250],[650,300],[650,350],[650,400],[650,450],[700,500],[750,450],[750,400],[750,350],[750,300],[750,250],[750,200],[800,500],[850,450],[850,400],[850,350],[850,300],[850,250],[850,200],[950,350],[950,400],[950,450],[950,500],[950,250],[1050,350],[1050,400],[1050,450],[1050,500],[1100,400],[1150,450],[1150,500],[0,650],[50,650],[100,650],[150,650],[200,650],[250,650],[300,650],[350,650],[400,650],[450,650],[500,650],[550,650],[600,650],[650,650],[700,650],[750,650],[800,650],[850,650],[900,650],[950,650],[1000,650],[1050,650],[1100,650],[1150,650],[0,200],[50,250],[100,300],[150,250],[200,200],[100,350],[100,400],[100,450],[100,500],[200,350],[200,400],[200,450],[200,500],[250,500],[300,500],[300,450],[300,400],[300,350],[250,350],[400,350],[400,400],[400,450],[400,500],[450,500],[500,500],[500,450],[500,400],[500,350]]
let spikes9 = [[650,150,"up"],[850,150,"up"],[950,300,"up"],[1100,450,"down"],[1100,350,"right"],[1200,500,"right"],[700,200,"left"],[900,250,"left"],[200,300,"up"],[250,450,"up"],[450,450,"up"],[400,300,"up"],[50,300,"down"],[250,400,"down"],[500,550,"down"],[200,550,"down"],[50,400,"left"],[350,400,"left"],[350,500,"right"],[150,400,"right"],[250,200,"right"],[550,350,"right"],[900,400,"right"],[700,400,"right"]]
let decors9 = [[150,600],[200,600],[250,600],[300,600],[350,600],[400,600],[450,600],[500,600],[550,600],[600,600],[650,600],[700,600],[750,600],[800,600],[850,600],[950,600],[1000,600],[900,600],[1050,600],[1100,600],[1150,600],[100,600],[50,600],[0,600]]



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


// ============================================================
// Autonomous playback mode
// ============================================================
// A "run" is [direction, up, frameCount] where direction is
// -1 (left) / 0 (none) / 1 (right), and "up" is whether the
// up-thrust key is held. These are the computed solves for each
// level, compressed into held-input segments.

const level1Solution = [
    [0, false, 4],
    [1, false, 87],
    [1, true, 13],
    [0, true, 53],
    [1, true, 7],
];

const level2Solution = [
    [1, true, 1],
    [1, false, 36],
    [1, true, 3],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 31],
    [1, true, 1],
    [1, false, 2],
    [0, false, 15],
    [1, false, 25],
    [-1, false, 2],
    [0, false, 8],
    [1, false, 2],
    [0, false, 1],
    [1, true, 39],
    [0, true, 15],
    [-1, true, 8],
    [0, true, 25],
    [-1, true, 2],
    [0, true, 3],
    [1, true, 7],
];

const level3Solution = [
    [1, false, 30],
    [0, false, 20],
    [1, false, 2],
    [0, false, 42],
    [-1, false, 6],
    [0, false, 10],
    [-1, false, 10],
    [0, false, 6],
    [1, false, 2],
    [0, false, 6],
    [0, true, 1],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 29],
    [0, true, 69],
    [1, true, 31],
];

const level4Solution = [
    [0, false, 2],
    [1, false, 28],
    [0, true, 1],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [0, false, 1],
    [1, false, 4],
    [1, true, 7],
    [1, false, 12],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 6],
    [0, false, 13],
    [-1, false, 26],
    [0, false, 2],
    [-1, false, 8],
    [0, false, 1],
    [-1, false, 6],
    [1, false, 12],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 18],
    [1, true, 18],
    [0, true, 3],
    [1, true, 4],
    [0, true, 3],
    [1, true, 3],
    [0, true, 60],
];

const level5Solution = [
    [1, false, 27],
    [1, true, 3],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 4],
    [0, false, 33],
    [-1, false, 3],
    [-1, true, 4],
    [-1, false, 17],
    [0, false, 13],
    [1, false, 3],
    [1, true, 4],
    [1, false, 39],
    [1, true, 12],
    [0, true, 10],
    [1, true, 22],
    [0, true, 27],
    [1, true, 40],
];

const level6Solution = [
    [0, false, 26],
    [1, false, 20],
    [0, false, 7],
    [-1, false, 2],
    [1, false, 1],
    [0, false, 1],
    [1, false, 1],
    [0, false, 47],
    [1, false, 14],
    [1, true, 1],
    [1, false, 17],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 13],
    [1, false, 1],
    [1, true, 2],
    [1, false, 1],
    [1, true, 2],
    [0, true, 23],
    [1, true, 6],
    [0, true, 12],
    [-1, true, 46],
    [1, true, 1],
    [0, true, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 13],
    [1, false, 10],
    [1, true, 10],
    [1, false, 8],
    [1, true, 1],
    [1, false, 2],
];

const level7Solution = [
    [1, false, 27],
    [0, false, 3],
    [1, true, 2],
    [0, true, 3],
    [0, false, 1],
    [1, false, 2],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 2],
    [1, true, 2],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 4],
    [0, false, 10],
    [1, false, 1],
    [0, false, 1],
    [-1, false, 7],
    [0, false, 5],
    [-1, false, 28],
    [0, false, 1],
    [-1, false, 6],
    [1, false, 6],
    [1, true, 1],
    [1, false, 6],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [-1, false, 2],
    [0, false, 8],
    [1, false, 2],
    [0, false, 17],
    [1, false, 39],
    [1, true, 10],
    [1, false, 1],
    [1, true, 3],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 13],
    [0, true, 3],
    [1, true, 16],
    [-1, true, 2],
    [0, true, 78],
];

const level8Solution = [
    [1, false, 18],
    [1, true, 1],
    [1, false, 4],
    [1, true, 13],
    [1, false, 1],
    [0, false, 6],
    [1, false, 13],
    [0, false, 1],
    [-1, false, 5],
    [1, false, 5],
    [0, false, 4],
    [1, false, 5],
    [-1, false, 29],
    [0, false, 13],
    [1, false, 3],
    [1, true, 4],
    [1, false, 19],
    [0, false, 7],
    [1, false, 30],
    [1, true, 1],
    [1, false, 5],
    [1, true, 3],
    [1, false, 1],
    [1, true, 2],
    [0, true, 1],
    [1, true, 8],
    [0, true, 10],
    [1, true, 8],
    [0, true, 80],
];

const level9Solution = [
    [1, false, 42],
    [1, true, 4],
    [1, false, 1],
    [1, true, 3],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 1],
    [1, true, 1],
    [1, false, 14],
    [1, true, 27],
];

// level number -> compressed run-length solution
const autoPlaySolutions = {
    1: level1Solution,
    2: level2Solution,
    3: level3Solution,
    4: level4Solution,
    5: level5Solution,
    6: level6Solution,
    7: level7Solution,
    8: level8Solution,
    9: level9Solution,
};

let autoPlay = false;
let autoPlayFrame = 0;
let autoPlaySequence = [];

function expandSolution(runs) {
    const frames = [];
    for (const [dir, up, count] of runs) {
        for (let i = 0; i < count; i++) {
            frames.push({ left: dir === -1, right: dir === 1, up: up });
        }
    }
    return frames;
}

function startAutoPlay(levelNum) {
    const solution = autoPlaySolutions[levelNum];
    if (!solution) {
        console.log(`No recorded solution for level ${levelNum} yet.`);
        return;
    }

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
    autoPlaySequence = expandSolution(solution);
    autoPlayFrame = 0;
    autoPlay = true;
    movingLeft = false;
    movingRight = false;
    movingUp = false;
    console.log(`Autoplay started: level ${levelNum}, ${autoPlaySequence.length} frames`);
}
// ============================================================


document.addEventListener("keydown", e => {
    if (e.key === "q") {
        level = (prompt("What level?"))-1
        changeLevel()
    }
    if (e.key === "r") {
        startAutoPlay(level);
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
        ctx.fillText(`AUTO  frame ${autoPlayFrame}/${autoPlaySequence.length}`, 10, 20);
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
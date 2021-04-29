let cvs = document.getElementById("myCanvas");
let ctx = cvs.getContext("2d")
//---------------------------------------------------------------
let bg = new Image();
let fg = new Image();
let kl = new Image();
let tree = new Image();
let grass = new Image();
let pipeSouth = new Image();
let jumpSound = new Audio();
let scoreSound = new Audio();
let gameOverSound = new Audio();
pipeSouth.src = "images/pipeSouth.png"
bg.src = "images/bg.png";
kl.src = "images/khunglong.png";
fg.src = "images/fg.png";
tree.src = "images/tree1.png";
grass.src = "images/grass2.png";
jumpSound.src = "sounds/fly.mp3";
scoreSound.src = "sounds/score.mp3";
gameOverSound = "sounds/gameover.wav";
let score = 0;
let highScore = score;
let pipe = [];
let treeArr = [];
let grassArr = [];
let bgArr = [];
let fgArr = [];
let speed = 20;
let aYY = 0;
let higher = 0;
let statusOnground = true
fgArr[0] = {
    x: 10
}
treeArr[0] = {
    x: cvs.width,
    y: cvs.height - fg.height - tree.height / 2
}
pipe[0] = {
    x: cvs.width,
    y: cvs.height - fg.height + 50,
}
grassArr[0] = {
    x: 50,
    y: 230,
    dx: grass.width,
    dy: grass.height / 2,
}
bgArr[0] = {
    x: 10,
}
let aX = 300;
let aY = cvs.height - fg.height;
let gravity = 10;
let statusCollision = false;
let highestArr = loadScoreArray();
let name = prompt('Nhập tên', 'abc');
let aSpeed = 15;
let jumpHeight = aY - 300;
let state = 'idle';
//-------------------------------------------------------------------------

document.addEventListener("keydown", jump)

function jump() {

    if (aY > cvs.height - fg.height - 10 && statusOnground) {
        aY -= 300;
        jumpSound.play();
    }

}

function saveScoreArray(name, score) {
    let user = [name, score];
    localStorage.setItem('score2', JSON.stringify(user));
}

function loadScoreArray() {
    if (localStorage.hasOwnProperty('score2')) {
        return JSON.parse(localStorage.getItem('score2'));
    } else {
        return [];
    }
}


function drawHighscore(highestArr) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("HI:  " + highestArr[0] + ' - ' + highestArr[1], 8, 50);
    document.getElementById("hi").innerHTML = highestArr[0] + ' - ' + highestArr[1];

}

function drawScore(score) {
    if (score > (+highestArr[1]) || isNaN(highestArr[1])) {
        higher = score;
        saveScoreArray(name, higher);
        highestArr = loadScoreArray();
        console.log(highestArr);

    }
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 8, 70);
}

function draw() {

    // hien chu GameOver khi thua
    if (statusCollision) {
        // ctx.fillStyle = "white"
        // ctx.fillRect(0,0,cvs.width,cvs.height)
        ctx.beginPath();
        ctx.font = "100px Verdana";
        ctx.fillStyle = "#993300";
        ctx.fillText("GameOver", cvs.width / 3 - 50, cvs.height / 4);
        ctx.closePath();
        // ctx.beginPath();
        // ctx.font = "30px Verdana";
        // ctx.fillStyle = "#993300";
        // ctx.fillText("HighScore: " + score, cvs.width / 3, cvs.height / 5 + 50);
        // ctx.closePath();
        return;
    }
    let ratio = cvs.width / fg.width;
    // ctx.drawImage(bg, 0, 0, cvs.width, cvs.height);

    // ve background
    for (let a = 0; a < bgArr.length; a++) {
        ctx.drawImage(bg, bgArr[a].x, 0, cvs.width, cvs.height);
        bgArr[a].x -= 1;
        if (bgArr[a].x === 0) {
            bgArr.push({
                x: cvs.width,
            })
        }
    }
    // ve grass
    for (let b = 0; b < grassArr.length; b++) {
        ctx.drawImage(grass, grassArr[b].x, grassArr[b].y, grassArr[b].dx, grassArr[b].dy);
        grassArr[b].x -= 5;
        if (grassArr[b].x === -5) {
            grassArr.push({
                x: cvs.width,
                y: 230,
                dx: grass.width,
                dy: grass.height / 2
            })
        }
    }

    // ve cay
    for (let j = 0; j < treeArr.length; j++) {
        ctx.drawImage(tree, treeArr[j].x, treeArr[j].y);
        treeArr[j].x -= 10;
        if (treeArr[j].x === 200) {
            treeArr.push({
                x: cvs.width,
                y: cvs.height - fg.height - tree.height / 2
            })
        }
    }

    // tao ong va dieu kien va cham
    for (let i = 0; i < pipe.length; i++) {
        // ve ong
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y);
        pipe[i].x -= speed;
        if (pipe[i].x === 400) {
            pipe.push({
                x: cvs.width,
                y: cvs.height - fg.height + Math.floor(Math.random() * 50) + 50
            })
        }


        // tang diem
        if (pipe[i].x === 0) {
            score++;
            scoreSound.play();
        }


        // check va cham
        if (aX + kl.width >= pipe[i].x
            && aX < pipe[i].x + pipeSouth.width
            && aY + kl.height > pipe[i].y) {
            statusCollision = true
        }

    }

    // nhay cham dat
    if (aY > cvs.height - fg.height - 50) {
        aY = cvs.height - fg.height
        statusOnground = true;
    } else {
        aY += gravity
        statusOnground = false;
    }


    drawScore(score);
    drawHighscore(highestArr);

    ctx.drawImage(kl, aX, aY)
    // ve fg
    for (let c = 0; c < fgArr.length; c++) {
        ctx.drawImage(fg, fgArr[c].x, Math.floor(cvs.height - (fg.height * ratio) - 20), cvs.width, fg.height);
        fgArr[c].x -= 10;
        if (fgArr[c].x === 0) {
            fgArr.push({
                x: cvs.width,
            })
        }
    }

    requestAnimationFrame(draw)
}

// draw();
startGame.addEventListener("click", function () {
    draw();
    document.getElementById("startGame").style.display = "none";
})



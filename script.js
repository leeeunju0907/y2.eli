

const noteArea = document.getElementById('note-area');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const music = document.getElementById('music');

let score = 0;
let gameInterval = null;
let isPlaying = false;

// 블록맵: 다양한 모양(계단, 일자 등)
const blockMaps = [
    // 계단모양
    [ {x:40,y:380}, {x:90,y:330}, {x:140,y:280}, {x:190,y:230}, {x:240,y:180} ],
    // 일자모양
    [ {x:40,y:380}, {x:90,y:380}, {x:140,y:380}, {x:190,y:380}, {x:240,y:380} ],
    // 계단 반대
    [ {x:240,y:380}, {x:190,y:330}, {x:140,y:280}, {x:90,y:230}, {x:40,y:180} ]
];
let currentMap = [];
let currentBlockIdx = 0;

let ball = { x: 40, y: 420, r: 20, color: '#ff4081' };

function drawGame() {
    noteArea.innerHTML = '';
    // Draw blocks
    currentMap.forEach((block, idx) => {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        blockDiv.style.left = (block.x) + 'px';
        blockDiv.style.top = (block.y) + 'px';
        noteArea.appendChild(blockDiv);
    });
    // Draw ball
    const ballDiv = document.createElement('div');
    ballDiv.className = 'ball';
    ballDiv.style.left = (ball.x - ball.r) + 'px';
    ballDiv.style.top = (ball.y - ball.r) + 'px';
    ballDiv.style.background = ball.color;
    noteArea.appendChild(ballDiv);
}

function moveBallToBlock(idx) {
    if (idx < currentMap.length) {
        ball.x = currentMap[idx].x;
        ball.y = currentMap[idx].y - 40;
    }
}

function checkHit() {
    if (currentBlockIdx < currentMap.length) {
        // 판정: 공이 블록 위에 있을 때
        const block = currentMap[currentBlockIdx];
        const dist = Math.sqrt((ball.x - block.x) ** 2 + (ball.y + 40 - block.y) ** 2);
        if (dist < 30) {
            score += 100;
            scoreDisplay.textContent = '점수: ' + score;
            currentBlockIdx++;
            moveBallToBlock(currentBlockIdx);
        }
    }
}

function gameLoop() {
    drawGame();
}

function startGame() {
    score = 0;
    scoreDisplay.textContent = '점수: 0';
    // 랜덤 맵 선택
    currentMap = blockMaps[Math.floor(Math.random() * blockMaps.length)];
    currentBlockIdx = 0;
    ball.x = 40;
    ball.y = 420;
    isPlaying = true;
    music.currentTime = 0;
    music.play();
    gameInterval = setInterval(() => {
        gameLoop();
    }, 16);
}

function stopGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    music.pause();
}

startBtn.addEventListener('click', () => {
    if (!isPlaying) startGame();
});

document.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    if (e.code === 'Space') {
        checkHit();
    }
});

music.addEventListener('ended', stopGame);

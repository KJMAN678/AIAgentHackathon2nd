let canvas = document.getElementById("field");
let ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// パドルのキー操作フラグ
let rightPressed = false;
let leftPressed = false;

// ブロックの行の数
const blockRowCount = 4;
// ブロックの列の数
const blockColumnCount = 6;
// ブロックの幅
const blockWidth = 75;
// ブロックの高さ
const blockHeight = 20;
// ブロックの隙間
const blockPadding = 10;
// キャンバスの端に描画されないようにするための上端
const blockOffsetTop = 30;
// キャンバスの端に描画されないようにするための左端
const blockOffsetLeft = 30;
// ボールの色
let ballColor = "#0095DD";
// スコア
let score = 0;
// プレイヤーのライフ
let lives = 3;

// ブロックを配置
const blocks = [];
for (let c = 0; c < blockColumnCount; c++) {
    blocks[c] = [];
    for (let r = 0; r < blockRowCount; r++) {
        // status はブロック消滅用のフラグ
        blocks[c][r] = { x: 0, y: 0, status: 1}
    }
}

// 衝突検出関数
function collisionDetection() {
    for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {

            const b = blocks[c][r];

            // 衝突判定
            if (b.status === 1) {
                if (x > b.x && x < b.x + blockWidth && y > b.y && y < b.y + blockHeight) {
                    dy = -dy;
                    // 衝突したブロックの status を 0 にする = 描画しない
                    b.status = 0;

                    // ボールの色を変更
                    ballColor = "red";
                    setTimeout(() => {
                        ballColor = "#0095DD";
                    }, 100);
                    // スコアを加算
                    score++;

                    if (score === blockRowCount * blockColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// スコア表示
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

// ライフ表示
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
}
  
function keyUpHandler(e) {
// IE/Edgeでは "Right", その他が "ArrowRight"
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// ブロックの描画
function drawBlocks() {
    for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {

            // status が 1 の場合はブロックを描画
            if (blocks[c][r].status === 1) {

                const blockX = c * (blockWidth + blockPadding) + blockOffsetLeft;
                const blockY = r * (blockHeight + blockPadding) + blockOffsetTop;
    
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ボールの描画
    drawBall();
    // ブロックの描画
    drawBlocks();
    // パドルの描画
    drawPaddle();
    // 衝突検出
    collisionDetection();
    // スコア表示
    drawScore();
    // ライフ表示
    drawLives();

    // ボールの移動
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
        dx = -dx;
    } else {
        x += dx + 0.1;
    }
    if(y + dy < ballRadius){
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy - 0.25;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }

        }

    } else {
        y += dy;
    }

    // パドルの移動
    if (rightPressed) {
        paddleX = Math.min(paddleX + 4, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 4, 0);
    }

    requestAnimationFrame(draw);
}


// キー操作
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// マウス操作
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    // ビューポート内のマウスの水平位置 - キャンバスの左端
    // キャンバスの左端からマウスの位置と等しい
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        // パドルの位置は、マウスの位置 - パドルの幅の半分
        // パドルの中央がマウスの位置と等しくなる
        paddleX = relativeX - paddleWidth / 2;
    }
}

draw();

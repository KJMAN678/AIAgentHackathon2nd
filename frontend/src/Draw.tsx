import { canvasSize, ball, paddle } from "./App";
import {
  keyControls,
  keyDownHandler,
  keyUpHandler,
  mouseMoveHandler,
} from "./keyHandler";
import { block, makeBlocks } from "./Block";
import { isCollisionDetected } from "./GameEngine";
import { player } from "./App";

export const Draw = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  let dx = 2;
  let dy = -2;
  player.score = 0;
  player.lives = 3;
  // NOTE: React でもコレでよいのか?
  // キーボードのキーを押したときの処理
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  // マウスを動かしたときの処理
  document.addEventListener("mousemove", mouseMoveHandler, false);

  makeBlocks();

  let gameOver = false;
  let animationFrameId: number;
  const gameLoop = () => {
    if (gameOver) return;

    // NOTE: もっと引数減らせないか？
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    DrawBall(ctx, x, y);
    drawPaddle(ctx);
    drawBlocks(ctx);
    drawScore(ctx, player.score);
    drawLives(ctx, player.lives);
    if (isCollisionDetected(x, y)) {
      dy = -dy;
      y += 0.25;
    }
    if (x + dx > canvasSize.width - ball.radius || x + dx < ball.radius) {
      dx = -dx;
    } else {
      x += dx;
    }

    if (y + dy < ball.radius) {
      dy = -dy;
    } else if (y + dy > canvasSize.height - ball.radius) {
      if (x > paddle.x && x < paddle.x + paddle.width) {
        dy = -dy - 0.25;
      } else {
        player.lives--;
        if (player.lives === 0) {
          alert("GAME OVER");
          document.location.reload();
          gameOver = true;
          return;
        } else {
          // ボールとパドルの位置と速度を初期化
          x = canvasSize.width / 2;
          y = canvasSize.height / 2;
          dx = 2;
          dy = -2;
          paddle.x = (canvasSize.width - paddle.width) / 2;
        }
      }
    } else {
      y += dy;
    }

    if (keyControls.rightPressed) {
      paddle.x += 7;
      if (paddle.x + paddle.width > canvasSize.width) {
        paddle.x = canvasSize.width - paddle.width;
      }
    } else if (keyControls.leftPressed) {
      paddle.x -= 7;
      if (paddle.x < 0) {
        paddle.x = 0;
      }
    }

    // 全てのブロックを消したらゲームクリア
    if (player.score === block.columnCount * block.rowCount) {
      alert("ゲームクリア！");
      document.location.reload();
      gameOver = true;
      return;
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  };

  // アニメーションのループを開始する
  gameLoop();
  return () => cancelAnimationFrame(animationFrameId);
};

const DrawBall = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.beginPath();
  ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.rect(
    paddle.x,
    canvasSize.height - paddle.height,
    paddle.width,
    paddle.height,
  );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};

export const drawBlocks = (ctx: CanvasRenderingContext2D) => {
  for (let c = 0; c < block.columnCount; c++) {
    for (let r = 0; r < block.rowCount; r++) {
      // ブロックの状態が 0 (消されている) の場合は描画しない
      if (block.blocks[c][r].status === 1) {
        const brickX = c * (block.width + block.padding) + block.offsetLeft;
        const brickY = r * (block.height + block.padding) + block.offsetTop;
        block.blocks[c][r].x = brickX;
        block.blocks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(
          block.blocks[c][r].x,
          block.blocks[c][r].y,
          block.width,
          block.height,
        );
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const drawScore = (ctx: CanvasRenderingContext2D, score: number) => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
};

const drawLives = (ctx: CanvasRenderingContext2D, lives: number) => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvasSize.width - 65, 20);
};

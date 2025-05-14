import { canvasSize, paddle } from "./App";

export const keyControls = {
  rightPressed: false,
  leftPressed: false,
};

export function keyDownHandler(e: KeyboardEvent) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    keyControls.rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    keyControls.leftPressed = true;
  }
}

export function keyUpHandler(e: KeyboardEvent) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    keyControls.rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    keyControls.leftPressed = false;
  }
}

export function mouseMoveHandler(e: MouseEvent) {
  const relativeX = e.clientX - canvasSize.offsetLeft;
  if (relativeX > 0 && relativeX < canvasSize.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
}

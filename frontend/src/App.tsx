import "./style.css";
import { useRef, useEffect } from "react";
import { Draw } from "./Draw";

// NOTE: 変数は別のファイルに纏める
export const canvasSize = {
  width: 0,
  height: 0,
  offsetLeft: 0,
};

export const ball = {
  radius: 10,
};

export const paddle = {
  height: 10,
  width: 75,
  x: 0,
};

export const player = {
  score: 0,
  lives: 3,
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error("canvas要素の取得に失敗しました");
    }
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("canvasのコンテキストの取得に失敗しました");
    }

    // 使い方あってる？
    canvasSize.width = canvas.width;
    canvasSize.height = canvas.height;
    canvasSize.offsetLeft = canvas.offsetLeft;
    // パドルの初期位置を画面の中央に配置
    paddle.x = (canvasSize.width - paddle.width) / 2;

    const x = canvasSize.width / 2;
    const y = canvasSize.height - 30;

    Draw(ctx, x, y);
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="bg-[#d3d3d3] block mx-auto"
        width={480}
        height={480}
      />
    </div>
  );
};

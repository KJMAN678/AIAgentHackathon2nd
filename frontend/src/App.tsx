import "./style.css";
import { useRef, useEffect, useState } from "react";
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
  const API_URL = `${import.meta.env.VITE_API_URL}`;
  const [result, setResult] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/hello`);
        const data = await response.json();
        console.log("Response data:", data.result);
        setResult(data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  console.log(result);
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

    // 安定した処理を行うため、クリーンナップのために 返り値に関数を返す
    return Draw(ctx, x, y);
  }, []);

  return (
    <div>
      <h1 className="text-center">{result}</h1>
      <canvas
        ref={canvasRef}
        className="bg-[#d3d3d3] block mx-auto"
        width={480}
        height={480}
      />
    </div>
  );
}

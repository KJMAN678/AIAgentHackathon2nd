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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const deleteCanvasImage = async () => {
    try {
      await fetch(`${API_URL}/api/delete-canvas`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting canvas:", error);
    }
  };

  useEffect(() => {
    // Delete canvas image when the game starts
    deleteCanvasImage();
  }, []);

  const captureAndSendCanvas = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const imageBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/jpeg");
      });

      const formData = new FormData();
      formData.append("image", imageBlob, "canvas.jpg");

      // Save the canvas image
      const saveResponse = await fetch(`${API_URL}/api/save-canvas`, {
        method: "POST",
        body: formData,
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save canvas image");
      }

      // Fetch new analysis after saving the canvas
      const analysisResponse = await fetch(`${API_URL}/api/hello`);
      const data = await analysisResponse.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      captureAndSendCanvas();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  console.log(result);

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
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm border p-4 w-full h-20 flex items-center justify-center overflow-hidden">
            <p className="text-gray-800 text-sm leading-relaxed text-center">
              {(() => {
                const text = result || "AIコメンタリーを待っています...";
                const maxLength = 100;
                return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
              })()}
            </p>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="bg-[#d3d3d3] block mx-auto rounded-lg shadow-lg"
          width={480}
          height={480}
        />
      </div>
    </div>
  );
}

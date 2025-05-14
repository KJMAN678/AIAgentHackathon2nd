import { block } from "./Block";
import { player } from "./App";

export const isCollisionDetected = (x: number, y: number) => {
  for (let c = 0; c < block.columnCount; c++) {
    for (let r = 0; r < block.rowCount; r++) {
      const b = block.blocks[c][r];
      if (b.status === 1) {
        // もしボールの中央がブロックの 1 つの座標の内部だったらボールの向きを変える。
        // ボールの中央がブロックの内部にあるためには次の 4 つの命題が全て真でなければならない
        if (
          x > b.x && // ボールの x 座標がブロックの x 座標より大きい
          x < b.x + block.width && // ボールの x 座標がブロックの x 座標とその幅の和より小さい
          y > b.y && // ボールの y 座標がブロックの y 座標より大きい
          y < b.y + block.height // ボールの y 座標がブロックの y 座標とその高さの和より小さい
        ) {
          // ブロックの状態を 0 にして消す
          b.status = 0;
          player.score += 1;
          return true;
        }
      }
    }
  }
  return false;
};

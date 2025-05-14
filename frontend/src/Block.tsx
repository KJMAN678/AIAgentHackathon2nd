export const block = {
  rowCount: 3,
  columnCount: 5,
  width: 75,
  height: 20,
  padding: 10,
  offsetTop: 30,
  offsetLeft: 30,
  blocks: [],
};

export const makeBlocks = () => {
  for (let c = 0; c < block.columnCount; c++) {
    block.blocks[c] = [];
    for (let r = 0; r < block.rowCount; r++) {
      block.blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
};

import { block, makeBlocks } from './Block';

describe('Block', () => {
  beforeEach(() => {
    block.blocks = [];
  });

  describe('block configuration', () => {
    it('should have correct default values', () => {
      expect(block.rowCount).toBe(3);
      expect(block.columnCount).toBe(5);
      expect(block.width).toBe(75);
      expect(block.height).toBe(20);
      expect(block.padding).toBe(10);
      expect(block.offsetTop).toBe(30);
      expect(block.offsetLeft).toBe(30);
    });
  });

  describe('makeBlocks', () => {
    it('should create blocks array with correct dimensions', () => {
      makeBlocks();
      expect(block.blocks).toHaveLength(block.columnCount);
      expect(block.blocks[0]).toHaveLength(block.rowCount);
    });

    it('should initialize all blocks with correct properties', () => {
      makeBlocks();
      for (let c = 0; c < block.columnCount; c++) {
        for (let r = 0; r < block.rowCount; r++) {
          expect(block.blocks[c][r]).toEqual({
            x: 0,
            y: 0,
            status: 1
          });
        }
      }
    });

    it('should reset blocks array when called multiple times', () => {
      makeBlocks();
      block.blocks[0][0].status = 0;
      makeBlocks();
      expect(block.blocks[0][0].status).toBe(1);
    });
  });
});

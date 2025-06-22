import { drawBlocks } from './Draw';
import { block, makeBlocks } from './Block';

describe('Draw', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      rect: jest.fn(),
      fillText: jest.fn(),
      fillStyle: '',
      font: '',
    };
    makeBlocks();
  });

  describe('drawBlocks', () => {
    it('should draw all active blocks', () => {
      drawBlocks(mockCtx);
      
      const expectedCalls = block.columnCount * block.rowCount;
      expect(mockCtx.beginPath).toHaveBeenCalledTimes(expectedCalls);
      expect(mockCtx.rect).toHaveBeenCalledTimes(expectedCalls);
      expect(mockCtx.fill).toHaveBeenCalledTimes(expectedCalls);
      expect(mockCtx.closePath).toHaveBeenCalledTimes(expectedCalls);
    });

    it('should not draw destroyed blocks', () => {
      block.blocks[0][0].status = 0;
      block.blocks[1][1].status = 0;
      
      drawBlocks(mockCtx);
      
      const expectedCalls = (block.columnCount * block.rowCount) - 2;
      expect(mockCtx.beginPath).toHaveBeenCalledTimes(expectedCalls);
    });

    it('should set correct block positions', () => {
      drawBlocks(mockCtx);
      
      const firstBlockX = 0 * (block.width + block.padding) + block.offsetLeft;
      const firstBlockY = 0 * (block.height + block.padding) + block.offsetTop;
      
      expect(block.blocks[0][0].x).toBe(firstBlockX);
      expect(block.blocks[0][0].y).toBe(firstBlockY);
    });

    it('should call rect with correct parameters', () => {
      drawBlocks(mockCtx);
      
      const firstBlockX = block.offsetLeft;
      const firstBlockY = block.offsetTop;
      
      expect(mockCtx.rect).toHaveBeenCalledWith(
        firstBlockX,
        firstBlockY,
        block.width,
        block.height
      );
    });

    it('should set correct fill style', () => {
      drawBlocks(mockCtx);
      expect(mockCtx.fillStyle).toBe('#0095DD');
    });
  });
});

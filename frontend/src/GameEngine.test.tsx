import { isCollisionDetected } from './GameEngine';
import { block, makeBlocks } from './Block';

jest.mock('./App', () => ({
  player: {
    score: 0,
    lives: 3,
  },
}));





describe('GameEngine', () => {
  beforeEach(() => {
    makeBlocks();
    for (let c = 0; c < block.columnCount; c++) {
      for (let r = 0; r < block.rowCount; r++) {
        block.blocks[c][r].x = c * (block.width + block.padding) + block.offsetLeft;
        block.blocks[c][r].y = r * (block.height + block.padding) + block.offsetTop;
      }
    }
    const { player } = require('./App');
    player.score = 0;
  });

  describe('isCollisionDetected', () => {
    it('should return false when ball is not colliding with any block', () => {
      const { player } = require('./App');
      const result = isCollisionDetected(10, 10);
      expect(result).toBe(false);
      expect(player.score).toBe(0);
    });

    it('should return true and increment score when ball collides with active block', () => {
      const blockX = 30;
      const blockY = 30;
      block.blocks[0][0].x = blockX;
      block.blocks[0][0].y = blockY;
      block.blocks[0][0].status = 1;
      
      const ballX = blockX + 10;
      const ballY = blockY + 10;
      
      const { player } = require('./App');
      const result = isCollisionDetected(ballX, ballY);
      expect(result).toBe(true);
      expect(player.score).toBe(1);
      expect(block.blocks[0][0].status).toBe(0);
    });

    it('should return false when ball collides with destroyed block', () => {
      const blockX = 30;
      const blockY = 30;
      block.blocks[0][0].x = blockX;
      block.blocks[0][0].y = blockY;
      block.blocks[0][0].status = 0;
      
      const ballX = blockX + 10;
      const ballY = blockY + 10;
      
      const { player } = require('./App');
      const result = isCollisionDetected(ballX, ballY);
      expect(result).toBe(false);
      expect(player.score).toBe(0);
    });

    it('should handle collision at block boundaries', () => {
      const blockX = 30;
      const blockY = 30;
      block.blocks[0][0].x = blockX;
      block.blocks[0][0].y = blockY;
      block.blocks[0][0].status = 1;
      
      const ballX = blockX + block.width - 1;
      const ballY = blockY + block.height - 1;
      
      const result = isCollisionDetected(ballX, ballY);
      expect(result).toBe(true);
    });

    it('should not detect collision when ball is outside block boundaries', () => {
      const blockX = 30;
      const blockY = 30;
      block.blocks[0][0].x = blockX;
      block.blocks[0][0].y = blockY;
      block.blocks[0][0].status = 1;
      
      const ballX = blockX + block.width + 1;
      const ballY = blockY + block.height + 1;
      
      const result = isCollisionDetected(ballX, ballY);
      expect(result).toBe(false);
    });

    it('should handle multiple block collisions correctly', () => {
      block.blocks[0][0].x = 30;
      block.blocks[0][0].y = 30;
      block.blocks[0][0].status = 1;
      
      block.blocks[1][0].x = 115;
      block.blocks[1][0].y = 30;
      block.blocks[1][0].status = 1;
      
      const { player } = require('./App');
      let result = isCollisionDetected(40, 40);
      expect(result).toBe(true);
      expect(player.score).toBe(1);
      
      result = isCollisionDetected(125, 40);
      expect(result).toBe(true);
      expect(player.score).toBe(2);
    });
  });
});

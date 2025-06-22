import { keyControls, keyDownHandler, keyUpHandler, mouseMoveHandler } from './keyHandler';

jest.mock('./App', () => ({
  canvasSize: {
    width: 480,
    height: 480,
    offsetLeft: 0,
  },
  paddle: {
    x: 200,
    y: 460,
    width: 75,
    height: 10,
  },
}));

const mockCanvasSize = {
  width: 480,
  height: 480,
  offsetLeft: 0,
};

const mockPaddle = {
  x: 200,
  y: 460,
  width: 75,
  height: 10,
};



describe('keyHandler', () => {
  beforeEach(() => {
    keyControls.rightPressed = false;
    keyControls.leftPressed = false;
    mockCanvasSize.width = 480;
    mockCanvasSize.offsetLeft = 0;
    mockPaddle.width = 75;
  });

  describe('keyDownHandler', () => {
    it('should set rightPressed to true when Right arrow key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      keyDownHandler(event);
      expect(keyControls.rightPressed).toBe(true);
    });

    it('should set rightPressed to true when Right key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Right' });
      keyDownHandler(event);
      expect(keyControls.rightPressed).toBe(true);
    });

    it('should set leftPressed to true when Left arrow key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      keyDownHandler(event);
      expect(keyControls.leftPressed).toBe(true);
    });

    it('should set leftPressed to true when Left key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Left' });
      keyDownHandler(event);
      expect(keyControls.leftPressed).toBe(true);
    });

    it('should not change state for other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'Space' });
      keyDownHandler(event);
      expect(keyControls.rightPressed).toBe(false);
      expect(keyControls.leftPressed).toBe(false);
    });
  });

  describe('keyUpHandler', () => {
    it('should set rightPressed to false when Right arrow key is released', () => {
      keyControls.rightPressed = true;
      const event = new KeyboardEvent('keyup', { key: 'ArrowRight' });
      keyUpHandler(event);
      expect(keyControls.rightPressed).toBe(false);
    });

    it('should set leftPressed to false when Left arrow key is released', () => {
      keyControls.leftPressed = true;
      const event = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
      keyUpHandler(event);
      expect(keyControls.leftPressed).toBe(false);
    });
  });

  describe('mouseMoveHandler', () => {
    it('should update paddle position based on mouse position', () => {
      const { paddle } = require('./App');
      const event = new MouseEvent('mousemove', { clientX: 200 });
      mouseMoveHandler(event);
      expect(paddle.x).toBe(200 - paddle.width / 2);
    });

    it('should not update paddle position if mouse is outside canvas', () => {
      const initialPaddleX = mockPaddle.x;
      const event = new MouseEvent('mousemove', { clientX: -10 });
      mouseMoveHandler(event);
      expect(mockPaddle.x).toBe(initialPaddleX);
    });

    it('should not update paddle position if mouse is beyond canvas width', () => {
      const initialPaddleX = mockPaddle.x;
      const event = new MouseEvent('mousemove', { clientX: 500 });
      mouseMoveHandler(event);
      expect(mockPaddle.x).toBe(initialPaddleX);
    });
  });
});

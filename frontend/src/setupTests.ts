import '@testing-library/jest-dom';

(global as any).fetch = jest.fn();

Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: 'http://localhost:8000',
      },
    },
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn().mockImplementation((cb: FrameRequestCallback) => cb(0)),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: jest.fn(),
});

HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  closePath: jest.fn(),
  rect: jest.fn(),
  fillText: jest.fn(),
  fillStyle: '',
  font: '',
});

HTMLCanvasElement.prototype.toBlob = jest.fn().mockImplementation((callback: BlobCallback) => {
  const blob = new Blob(['fake-canvas-data'], { type: 'image/jpeg' });
  callback(blob);
});

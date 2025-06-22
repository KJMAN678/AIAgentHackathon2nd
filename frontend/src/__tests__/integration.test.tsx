import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from '../App';

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

jest.mock('../Draw', () => ({
  Draw: jest.fn(() => () => {}),
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    process.env.VITE_API_URL = 'http://localhost:8080';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should complete full canvas capture and API workflow', async () => {
    const mockCanvasBlob = new Blob(['fake-canvas-data'], { type: 'image/jpeg' });
    
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: '初期メッセージ' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: '5秒後のメッセージ' }),
      });

    HTMLCanvasElement.prototype.toBlob = jest.fn().mockImplementation((callback) => {
      callback(mockCanvasBlob);
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('初期メッセージ')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/save-canvas',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('5秒後のメッセージ')).toBeInTheDocument();
    });
  });

  it('should handle canvas capture errors', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: '初期メッセージ' }),
      })
      .mockRejectedValueOnce(new Error('Canvas save failed'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<App />);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should prevent multiple simultaneous canvas captures', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: '初期メッセージ' }),
      })
      .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<App />);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    const saveCanvasCalls = mockFetch.mock.calls.filter(call => 
      call[0].includes('save-canvas')
    );
    expect(saveCanvasCalls).toHaveLength(1);
  });

  it('should cleanup interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    
    const { unmount } = render(<App />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});

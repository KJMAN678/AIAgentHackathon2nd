import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

jest.mock('./Draw', () => ({
  Draw: jest.fn(() => () => {}),
}));

describe('App', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    process.env.VITE_API_URL = 'http://localhost:8080';
  });

  it('renders canvas element', () => {
    render(<App />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders AI commentary section', () => {
    render(<App />);
    const commentary = screen.getByText(/AIコメンタリーを待っています/);
    expect(commentary).toBeInTheDocument();
  });

  it('calls delete-canvas API on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<App />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/delete-canvas',
        { method: 'DELETE' }
      );
    });
  });

  it('calls hello API on mount', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 'テスト応援メッセージ' }),
      });

    render(<App />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/hello');
    });
  });

  it('displays API response in commentary section', async () => {
    const testMessage = 'ゲームが進行中です！頑張って！';
    
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: testMessage }),
      });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(testMessage)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockRejectedValueOnce(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('has correct canvas dimensions', () => {
    render(<App />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveAttribute('width', '480');
    expect(canvas).toHaveAttribute('height', '480');
  });

  it('applies correct CSS classes', () => {
    render(<App />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveClass('bg-[#d3d3d3]', 'block', 'mx-auto', 'rounded-lg', 'shadow-lg');
  });
});

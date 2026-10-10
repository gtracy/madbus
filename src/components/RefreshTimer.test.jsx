import React from 'react';
import { render, screen, act } from '@testing-library/react';
import RefreshTimer from './RefreshTimer';

// Mock react-ga4 to prevent initialization errors
vi.mock('react-ga4', () => ({
  default: {
    initialize: vi.fn(),
    event: vi.fn(),
  },
  initialize: vi.fn(),
  event: vi.fn(),
}));

describe('RefreshTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders with initial progress of 30 seconds', () => {
    render(<RefreshTimer handleRefresh={vi.fn()} />);
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  test('counts down seconds', () => {
    render(<RefreshTimer handleRefresh={vi.fn()} />);

    // Advance 5 seconds, 1 second at a time to handle interval clearing/recreating on render
    for (let i = 0; i < 5; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }

    // 30 - Math.round(5/100 * 30) = 30 - 2 = 28
    expect(screen.getByText('28')).toBeInTheDocument();
  });

  test('triggers handleRefresh and resets when timer reaches threshold', () => {
    const handleRefreshMock = vi.fn();
    render(<RefreshTimer handleRefresh={handleRefreshMock} />);

    // Advance 101 seconds to count progress up to 100 and reset it, triggering the callback
    for (let i = 0; i < 101; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(handleRefreshMock).toHaveBeenCalledWith(true);
  });
});

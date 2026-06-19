import React from 'react';
import { render, screen, act } from '@testing-library/react';
import RefreshTimer from './RefreshTimer';

// Mock react-ga4 to prevent initialization errors
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  event: jest.fn(),
}));

describe('RefreshTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders with initial progress of 30 seconds', () => {
    render(<RefreshTimer handleRefresh={jest.fn()} />);
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  test('counts down seconds', () => {
    render(<RefreshTimer handleRefresh={jest.fn()} />);

    // Advance 5 seconds, 1 second at a time to handle interval clearing/recreating on render
    for (let i = 0; i < 5; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }

    // 30 - Math.round(5/100 * 30) = 30 - 2 = 28
    expect(screen.getByText('28')).toBeInTheDocument();
  });

  test('triggers handleRefresh and resets when timer reaches threshold', () => {
    const handleRefreshMock = jest.fn();
    render(<RefreshTimer handleRefresh={handleRefreshMock} />);

    // Advance 101 seconds to count progress up to 100 and reset it, triggering the callback
    for (let i = 0; i < 101; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }

    expect(handleRefreshMock).toHaveBeenCalledWith(true);
  });
});

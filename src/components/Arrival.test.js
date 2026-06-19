import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Arrival from './Arrival';
import TransitAPI from '../transit-api';

// Mock the TransitAPI module
jest.mock('../transit-api');

describe('Arrival Component', () => {
  let mockGetArrivals;

  beforeEach(() => {
    mockGetArrivals = jest.fn();
    TransitAPI.prototype.getArrivals = mockGetArrivals;
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays loading progress indicator initially', async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockGetArrivals.mockReturnValue(promise);

    render(<Arrival activeStopID="0200" refresh={false} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await act(async () => {
      resolvePromise([]);
    });
  });

  test('renders countdown and upcoming arrivals table successfully', async () => {
    const mockData = [
      { routeID: '02', minutes: 8, destination: 'WEST TRANSFER VIA SHERMAN', arrivalTime: '12:34 PM' },
      { routeID: '08', minutes: 12, destination: 'SPRING HARBOR', arrivalTime: '12:38 PM' }
    ];
    mockGetArrivals.mockResolvedValue(mockData);

    await act(async () => {
      render(<Arrival activeStopID="0200" refresh={false} />);
    });

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    // Check Countdown displays the first route
    expect(screen.getByText(/Route/)).toBeInTheDocument();
    expect(screen.getByText(/02/)).toBeInTheDocument();
    expect(screen.getByText(/West Transfer/)).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('minutes')).toBeInTheDocument();

    // Check Upcoming Arrivals table displays the second route
    expect(screen.getByText(/08/)).toBeInTheDocument();
    expect(screen.getByText(/Spring Harbor/)).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  test('renders "no routes coming" if there are no arrivals', async () => {
    mockGetArrivals.mockResolvedValue([]);

    await act(async () => {
      render(<Arrival activeStopID="0200" refresh={false} />);
    });

    expect(screen.getByText('no routes coming at this stop currently')).toBeInTheDocument();
  });
});

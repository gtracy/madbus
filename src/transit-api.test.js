import TransitAPI from './transit-api';

describe('TransitAPI', () => {
  let api;

  beforeEach(() => {
    api = new TransitAPI();
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getArrivals', () => {
    test('fetches arrivals for a stop ID successfully', async () => {
      const mockRoutes = [
        { routeID: '02', minutes: 8, destination: 'WEST TRANSFER' }
      ];
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          status: '0',
          stop: { route: mockRoutes }
        })
      });

      const result = await api.getArrivals('0200');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/getarrivals?key=undefined&stopID=0200')
      );
      expect(result).toEqual(mockRoutes);
    });

    test('fetches arrivals with route ID when provided', async () => {
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          status: '0',
          stop: { route: [] }
        })
      });

      await api.getArrivals('0200', '02');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('&stopID=0200&routeID=02')
      );
    });

    test('returns empty array and logs error on status !== "0"', async () => {
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          status: '1',
          error: 'Invalid stop'
        })
      });

      const result = await api.getArrivals('invalid');

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    test('returns empty array and logs error when fetch fails', async () => {
      global.fetch.mockRejectedValue(new Error('Network failure'));

      const result = await api.getArrivals('0200');

      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('API call threw an error')
      );
    });
  });

  describe('getStops', () => {
    test('fetches stops and caches them', async () => {
      const mockStops = [
        { stopID: '0100', intersection: 'Univ & Park' }
      ];
      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockStops)
      });

      const firstResult = await api.getStops();
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('stops.json');
      expect(firstResult).toEqual(mockStops);

      // Second call should return cached stop details without calling fetch again
      const secondResult = await api.getStops();
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(secondResult).toEqual(mockStops);
    });

    test('handles failed fetch of stops gracefully', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404
      });

      const result = await api.getStops();
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getStopLocation', () => {
    test('returns empty object', () => {
      expect(api.getStopLocation('0100')).toEqual({});
    });
  });
});

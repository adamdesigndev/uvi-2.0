// uvIndexFetcher.test.js
// npm test -- jest-test/uvIndexFetcher.test.js

import { UVIndexFetcher } from '../scripts/uvIndexFetcher';
import { API } from '../scripts/api';
import { Display } from '../scripts/display';

// Mock the API and Display classes
jest.mock('../scripts/api');
jest.mock('../scripts/display');

describe('UVIndexFetcher Tests', () => {
  let uvIndexFetcher;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Initialize UVIndexFetcher before each test
    uvIndexFetcher = new UVIndexFetcher();
  });

  test('fetches hourly UV index successfully', async () => {
    // Setup the API mock to return a successful response
    API.prototype.fetchData.mockResolvedValue([{ DATE_TIME: '10 AM', UV_VALUE: 5 }]);
    const result = await uvIndexFetcher.fetchUVIndex('12345');
    expect(result).toEqual([{ DATE_TIME: '10 AM', UV_VALUE: 5 }]);
  });

  test('handles no data for hourly UV index', async () => {
    // Return an empty array to simulate no data available
    API.prototype.fetchData.mockResolvedValue([]);
    Display.showError.mockImplementation(() => {});
    const result = await uvIndexFetcher.fetchUVIndex('12345');
    expect(result).toBeNull();
    expect(Display.showError).toHaveBeenCalledWith('No data available.');
  });

  test('handles fetch errors properly', async () => {
    // Simulate a fetch error
    API.prototype.fetchData.mockRejectedValue(new Error('Failed to fetch data'));
    Display.showError.mockImplementation(() => {});
    const result = await uvIndexFetcher.fetchUVIndex('12345');
    expect(result).toBeNull();
    expect(Display.showError).toHaveBeenCalledWith('Failed to retrieve data. Please try again later.');
  });
});


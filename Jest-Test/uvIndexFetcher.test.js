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
    API.prototype.fetchData.mockResolvedValue([{ DATE_TIME: 'May/07/2024 07 AM"', UV_VALUE: 5 }]);
    // Await the result of a call made
    const result = await uvIndexFetcher.fetchUVIndex('12345');
    // Checking that result and expecting a value
    expect(result).toEqual([{ DATE_TIME: 'May/07/2024 07 AM"', UV_VALUE: 5 }]);
  });

  test('handles no data for hourly UV index', async () => {
    // Return an empty array to simulate no data available
    API.prototype.fetchData.mockResolvedValue([]);
    // Mocks showError was called, but without running its operations
    Display.showError.mockImplementation(() => {});
    // Await the result of a call made
    const result = await uvIndexFetcher.fetchUVIndex('12345');
    // This assertion checks that the result of fetchUVIndex is null
    expect(result).toBeNull();
    // Verifies that Display.showError was called with the exact string 'No data available.' 
    expect(Display.showError).toHaveBeenCalledWith('No data available.');
  });

  test('handles fetch errors properly', async () => {
    // Simulate a mock function to return a rejected promise
    // We are creating a new Error object at this moment
    // Prepares the mocked function to handle calls by rejecting the promise
    API.prototype.fetchData.mockRejectedValue(new Error('Failed to fetch data'));
    // Mocks showError was called, but without running its operations
    Display.showError.mockImplementation(() => {});
    // Await the result of a call made
    const result = await uvIndexFetcher.fetchUVIndex('12345');
    // This assertion checks that the result of fetchUVIndex is null
    expect(result).toBeNull();
    // Asserts that the Display.showError method is called with a specific message
    expect(Display.showError).toHaveBeenCalledWith('Failed to retrieve data. Please try again later.');
  });
});


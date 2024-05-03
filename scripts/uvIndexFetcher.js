// uvIndexFetcher.js
import { API } from './api.js';
import { Display } from './display.js';

// This class handles the construction of API endpoints and initiates fetch operations.
export class UVIndexFetcher {
    // Instance of the API class to handle data fetching.
    #api = new API();
    // Base endpoint for fetching hourly UV index data.
    #hourlyUrl = 'getEnvirofactsUVHOURLY/ZIP/';
    // Base endpoint for fetching daily high UV index data.
    #dailyUrl = 'getEnvirofactsUVDAILY/ZIP/';

    // Fetches the hourly UV index for a given ZIP code and returns the data.
    async fetchUVIndex(zipCode) {
        // Constructs the endpoint and calls fetchData to retrieve the data.
        return this.fetchData(`${this.#hourlyUrl}${zipCode}/JSON`);
    }

    // Fetches the daily UV index for a given ZIP code and returns the data.
    async fetchDailyUVIndex(zipCode) {
        // Constructs the endpoint and calls fetchData to retrieve the data.
        return this.fetchData(`${this.#dailyUrl}${zipCode}/JSON`);
    }

    // Fetches data using the constructed endpoint, which is passed from fetchUVIndex or fetchDailyUVIndex.
    async fetchData(endpoint) {
        try {
            // Calls the fetchData method of the API instance with the constructed endpoint.
            const data = await this.#api.fetchData(endpoint);
            // Check if the returned data array is empty.
            if (data.length === 0) {
                // Display an error message if no data is available.
                Display.showError('No data available.');
                // Return null to indicate that no data was fetched.
                return null;
            }
            // Return the fetched data if it is successfully retrieved.
            return data;
        } catch (error) {
            // Display an error message if data retrieval fails.
            Display.showError('Failed to retrieve data. Please try again later.');
            // Return null to prevent further processing in case of an error.
            return null; 
        }
    }
}
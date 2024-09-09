// uvIndexFetcher.js
// This module defines the UVIndexFetcher class, which handles the construction of API endpoints and initiates fetch operations for UV index data.

import { API } from './api.js';
import { Display } from './display.js';

// Class to manage fetching UV Index data for a specific ZIP code using the EPA API.
export class UVIndexFetcher {
    // Instance of the API class to handle data fetching operations.
    #api = new API();
    // Base endpoint for fetching hourly UV index data.
    #hourlyUrl = 'getEnvirofactsUVHOURLY/ZIP/';
    // Base endpoint for fetching daily high UV index data.
    #dailyUrl = 'getEnvirofactsUVDAILY/ZIP/';

    /**
     * Fetches the hourly UV index data for a given ZIP code.
     * Constructs the endpoint and retrieves the data using the fetchData method.
     *
     * @param {string} zipCode - The ZIP code for which to fetch the hourly UV index data.
     * @returns {Promise<Object|null>} - A promise that resolves to the fetched data or null if fetching fails.
     */
    async fetchUVIndex(zipCode) {
        return this.fetchData(`${this.#hourlyUrl}${zipCode}/JSON`);
    }

    /**
     * Fetches the daily UV index data for a given ZIP code.
     * Constructs the endpoint and retrieves the data using the fetchData method.
     *
     * @param {string} zipCode - The ZIP code for which to fetch the daily UV index data.
     * @returns {Promise<Object|null>} - A promise that resolves to the fetched data or null if fetching fails.
     */
    async fetchDailyUVIndex(zipCode) {
        return this.fetchData(`${this.#dailyUrl}${zipCode}/JSON`);
    }

    /**
     * Fetches data from the constructed endpoint.
     * Handles errors and displays appropriate messages if fetching fails or if no data is available.
     *
     * @param {string} endpoint - The API endpoint to fetch data from.
     * @returns {Promise<Object|null>} - A promise that resolves to the fetched data or null if fetching fails or no data is available.
     */
    async fetchData(endpoint) {
        try {
            // Use the fetchData method from the API instance to fetch data from the constructed endpoint.
            const data = await this.#api.fetchData(endpoint);

            // Check if the returned data array is empty and handle accordingly.
            if (data.length === 0) {
                Display.showError('No data available.');  // Display error if no data is found.
                return null;  // Return null to indicate no data was fetched.
            }

            return data;  // Return the fetched data if it is successfully retrieved.
        } catch (error) {
            // Display an error message if data retrieval fails.
            Display.showError('Failed to retrieve data. Please try again later.');
            return null;  // Return null to prevent further processing in case of an error.
        }
    }
}

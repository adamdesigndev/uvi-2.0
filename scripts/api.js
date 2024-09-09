// api.js
// Class responsible for handling API requests by appending the base URL to each endpoint
// This class is used within uvIndexFetcher to abstract and simplify the fetch operation.

export class API {
    // Base URL for all API requests, providing the root for endpoint-specific URLs
    #baseUrl = 'https://data.epa.gov/efservice/';

    /**
     * Fetches data from the specified endpoint and returns the parsed JSON response.
     * Throws an error if the fetch operation fails or if the server returns a non-OK status.
     *
     * @param {string} endpoint - The API endpoint to fetch data from, relative to the base URL.
     * @returns {Promise<Object>} - A promise that resolves to the parsed JSON data.
     * @throws Will throw an error if the fetch fails or if the response is not OK.
     */
    async fetchData(endpoint) {
        // Construct the full URL by appending the endpoint to the base URL
        const url = this.#baseUrl + endpoint; 

        try {
            // Perform the fetch operation and await the response
            const response = await fetch(url);

            // Check if the response status is not OK (not in the range 200-299)
            if (!response.ok) {
                // Log the error with the URL and status code for debugging purposes
                console.error(`Error fetching data from ${url}: HTTP status ${response.status}`);
                // Throw an error to indicate that the fetch was unsuccessful
                throw new Error('Failed to fetch data');
            }

            // Parse the JSON from the response and return the resulting object
            return await response.json();
        } catch (error) {
            // Log any errors that occur during the fetch or JSON parsing
            console.error(`Error fetching data from ${url}: ${error}`);
            // Re-throw the error to allow handling in the caller (e.g., uvIndexFetcher)
            throw error;
        }
    }
}

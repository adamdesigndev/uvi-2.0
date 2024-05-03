// api.js
// Class that handles the fetch by appending base url to each endpoint
// when called in uvIndexFetcher
export class API {
    // Base URL for API requests, used to construct full URLs with endpoints
    #baseUrl = 'https://data.epa.gov/efservice/';

    // Fetches data from a given endpoint and returns the parsed JSON.
    // Throws an error if the fetch operation fails or the server returns a non-OK response.
    async fetchData(endpoint) {
        // Construct the full URL by appending the endpoint to the base URL
        const url = this.#baseUrl + endpoint; 
        try {
            // Perform the fetch operation and wait for the response
            const response = await fetch(url);
            // Check if the response status is not OK (200-299)
            if (!response.ok) {
                 // Log the error to the console with the URL and the response status
                console.error(`Error fetching data from ${url}: HTTP status ${response.status}`);
                // Throw an error to indicate the fetch was unsuccessful
                throw new Error('Failed to fetch data');
            }
            // Parse the JSON from the response and return it
            return await response.json();
        } catch (error) {
            // Log any errors that occur during fetching or parsing
            console.error(`Error fetching data from ${url}: ${error}`);
             // Re-throw the error to be handled by the caller in uvIndexFetcher.js
            throw error;
        }
    }
}
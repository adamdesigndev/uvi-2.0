// app.js
import { UVIndexFetcher } from './uvIndexFetcher.js';
import { Display } from './display.js';
import { idMap } from './idMap.js';
import { UIAnimations } from './animations.js';

// Initialize and manage operations after the DOM has fully loaded.
document.addEventListener('DOMContentLoaded', async () => {
    // Instantiate objects and select DOM elements.
    const uvIndexFetcher = new UVIndexFetcher();
    const zipCodeInput = document.getElementById('js-zip-code-input');
    const searchForm = document.getElementById('search-form');
    const modal = document.querySelector('.modal');
    const openModal = document.querySelector('.logo');
    const closeModal = document.querySelector('.close-button');

    // Begin the loading screen animation.
    UIAnimations.fadeInLogoParts();
    // Set up modal dialog interactions.
    setupModal(openModal, closeModal, modal);
    // Initialize a timeout to manage the removal of the loading screen.
    let loadingScreenTimeout = setTimeout(safeRemoveLoadingScreen, 2500);

     // Attempt to fetch UV index using the last searched ZIP code from local storage.
    const savedZipCode = localStorage.getItem('lastSearchedZipCode');
    // Checks if there is a ZIP in local storage
    if (savedZipCode) {
        // Populate the input field with the saved ZIP code.
        zipCodeInput.value = savedZipCode;
        // Perform a fetch operation and handle the result.
        await handleFetch(savedZipCode, uvIndexFetcher);
        // Clear the input field after the fetch.
        zipCodeInput.value = ''; 
    }

    // Add event listeners to the search form for handling submissions.
    setupFormListeners(searchForm, zipCodeInput, uvIndexFetcher);

    // Define a function to safely remove the loading screen, ensuring the timer is cleared.
    function safeRemoveLoadingScreen() {
        clearTimeout(loadingScreenTimeout);
        UIAnimations.removeLoadingScreen();
    }
});

// Configure modal interactions.
function setupModal(openModal, closeModal, modal) {
    // Add event listeners to open and close the modal.
    openModal.addEventListener('click', () => modal.showModal());
    closeModal.addEventListener('click', () => modal.close());
}

// Set up form event listeners and manage search operations.
// Passes on DOM elements and new UVIndexFetcher.
function setupFormListeners(form, input, uvIndexFetcher) {
    // On form submit, runs event.
    form.addEventListener('submit', async event => {
        // Prevent from auto refreshing page.
        event.preventDefault();
        // Optionally blur the input field to remove focus.
        input.blur(); 
        // Calls and sets searching status with passed in parameters.
        displaySearchStatus(input, 'Searching...');
        try {
            // Waits for handleFetch with inputed value and uvIndexFetcher.
            await handleFetch(input.value.trim(), uvIndexFetcher);
            // Updates search statuts.
            displaySearchStatus(input, 'Search complete');
        } catch (error) {
            // Any errors get handle with handleError.
            handleError(error);
            // Updates search status.
            displaySearchStatus(input, 'Search failed');
        }
        // Sets timeout to clear the search status
        setTimeout(() => clearSearchStatus(input), 2000); // Clear status after delay
    });

    // Ensure that only numeric characters can be entered into the ZIP code input.
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
    });
}

// Update the search status indicator in the UI.
// Takes the input and message as parameters when called in setupFormListeners.
export function displaySearchStatus(input, message) {
    // Finds the closest element with class .search-box.
    const searchBox = input.closest('.search-box');
    
    // Define color mappings using an object.
    const colorMap = {
        'Searching...': 'var(--extreme)',
        'Search complete': 'var(--low)',
        'Search failed': 'var(--high)',
        // Default case
        'default': 'var(--prime)'
    };

    // If DOM element exists.
    if (searchBox) {
        // Assigns attribute based on parameters passed from setupFormListeners.displaySearchStatus.
        searchBox.setAttribute('data-status', message);
        // Modifies style opacity property based on parameters.
        searchBox.style.setProperty('--status-opacity', '1');

        // Dynamic set color based on the status message from
        // parameter when called using CSS custom properties.
        // Also set Fallback to default if message is not found.
        const color = colorMap[message] || colorMap['default'];
        // Finally set color property based on message color.
        searchBox.style.setProperty('--status-color', color);
    }
}

// Clear the search status indicator after a specified delay.
// Takes input.
function clearSearchStatus(input) {
// Finds the closest element with class .search-box.
    const searchBox = input.closest('.search-box');
    // If it exists.
    if (searchBox) {
        // Set style property to hide.
        searchBox.style.setProperty('--status-opacity', '0');
    }
}

// Manage the fetching and handling of UV index data.
async function handleFetch(zipCode, uvIndexFetcher) {
    // Checks ZIP code for format
    if (!validateZipCode(zipCode)) {
        // Error handles can calls Display.showError.
        Display.showError('Please enter a valid 5-digit ZIP Code.');
        // Handle UI response immediately upon validation failure.
        UIAnimations.removeLoadingScreen();
        // Returns as to not continue after error.
        return;
    }

    // Handles making call with valid ZIP Code.
    try {
        // Collects data from fetchUVIndex with passed ZIP.
        const data = await uvIndexFetcher.fetchUVIndex(zipCode);
        // Collects data from fetchDailyUVIndex with passed ZIP.
        const dailyData = await uvIndexFetcher.fetchDailyUVIndex(zipCode);
        // If both valid data exist.
        if (data && dailyData) {
            // Waits for displayResults with passed in parameters from fetch.
            await displayResults(data, dailyData, zipCode);
            // Save to local storage after successful fetch.
            localStorage.setItem('lastSearchedZipCode', zipCode);
            // Runs to check if DOM complets updates.
            requestAnimationFrame(UIAnimations.removeLoadingScreen);
        } else {
            // Handle UI cleanup directly here if data fetch was unsuccessful.
            UIAnimations.removeLoadingScreen();
        }
    } catch (error) {
        // Calls handleError for error handling.
        handleError(error);
    }
}

// Log and display errors encountered during fetch operations.
function handleError(error) {
    // Errors will will be logged in console.
    console.error('Fetch error:', error);
    // Will display error message in DOM.
    Display.showError('Error displaying data. Please try again.');
    // Will Clear DOM due to errors.
    Display.clearAllDisplays();
    // Ensures loading screen does not get stuck due to failed fetch.
    UIAnimations.removeLoadingScreen();
}

// Validate the format of a ZIP code.
// Takes the ZIP code as parameter.
function validateZipCode(zipCode) {
    // Returns the ready to use ZIP code.
    return /^\d{5}$/.test(zipCode);
}

// Manage the display of UV index results across different parts of the UI.
// Passes in data and ZIP code.
async function displayResults(hourlyData, dailyData, zipCode) {
    // Holds array of promises to update DOM.
    const displayPromises = [
        // Calls displayResults and passes data and idMap.
        Display.displayResults(hourlyData, idMap),
        // Calls displayDailyHigh and passes data at the first index.
        Display.displayDailyHigh(dailyData[0]),
        // Calls displayDate and passes data at the first index.
        Display.displayDate(dailyData[0]),
        // Calls displayZIP and passes newly created object with zipCode.
        Display.displayZIP({ ZIP: zipCode })
    ];

    // Waits for all promised to resolve.
    await Promise.all(displayPromises);
    // Runs function to make sure DOM elements complete loading.
    requestAnimationFrame(() => {
        // Removes loading screen.
        requestAnimationFrame(UIAnimations.removeLoadingScreen);
    });
}
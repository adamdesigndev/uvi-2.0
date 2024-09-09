// app.js
// Main entry point for initializing the UV Index Forecast application.
// Handles DOM interactions, API fetch operations, and UI updates.

import { UVIndexFetcher } from './uvIndexFetcher.js';
import { Display } from './display.js';
import { idMap } from './idMap.js';
import { UIAnimations } from './animations.js';

// Initialize and manage operations after the DOM has fully loaded.
document.addEventListener('DOMContentLoaded', async () => {
    // Instantiate objects for data fetching and select necessary DOM elements.
    const uvIndexFetcher = new UVIndexFetcher();
    const zipCodeInput = document.getElementById('js-zip-code-input');
    const searchForm = document.getElementById('search-form');
    const modal = document.querySelector('.modal');
    const openModal = document.querySelector('.logo');
    const closeModal = document.querySelector('.close-button');

    // Begin the loading screen animation sequence.
    UIAnimations.fadeInLogoParts();
    // Set up modal dialog interactions for the 'About UV Index' information.
    setupModal(openModal, closeModal, modal);
    // Initialize a timeout to manage the removal of the loading screen.
    let loadingScreenTimeout = setTimeout(safeRemoveLoadingScreen, 2500);

    // Attempt to fetch UV index data using the last searched ZIP code from local storage.
    const savedZipCode = localStorage.getItem('lastSearchedZipCode');
    if (savedZipCode) {
        zipCodeInput.value = savedZipCode;  // Populate input with saved ZIP code.
        await handleFetch(savedZipCode, uvIndexFetcher);  // Fetch data and update UI.
        zipCodeInput.value = '';  // Clear input field after use.
    }

    // Set up event listeners for the search form submission and input validation.
    setupFormListeners(searchForm, zipCodeInput, uvIndexFetcher);

    // Function to safely remove the loading screen with a cleared timeout.
    function safeRemoveLoadingScreen() {
        clearTimeout(loadingScreenTimeout);
        UIAnimations.removeLoadingScreen();
    }
});

// Configure modal interactions to show/hide modal dialog.
function setupModal(openModal, closeModal, modal) {
    openModal.addEventListener('click', () => modal.showModal());
    closeModal.addEventListener('click', () => modal.close());
}

// Set up form event listeners and manage search operations.
function setupFormListeners(form, input, uvIndexFetcher) {
    form.addEventListener('submit', async event => {
        event.preventDefault();  // Prevent page refresh on form submission.
        input.blur();  // Optionally blur the input field to remove focus.
        displaySearchStatus(input, 'Searching...');  // Indicate search status.

        try {
            await handleFetch(input.value.trim(), uvIndexFetcher);  // Fetch and handle data.
            displaySearchStatus(input, 'Search complete');  // Update status on success.
        } catch (error) {
            handleError(error);  // Handle any errors during fetching.
            displaySearchStatus(input, 'Search failed');  // Update status on failure.
        }

        // Clear the search status after a delay.
        setTimeout(() => clearSearchStatus(input), 2000);
    });

    // Ensure only numeric input is allowed for ZIP code.
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
    });
}

// Update the search status indicator in the UI.
export function displaySearchStatus(input, message) {
    const searchBox = input.closest('.search-box');  // Find the closest .search-box element.

    // Define color mappings for different statuses.
    const colorMap = {
        'Searching...': 'var(--extreme)',
        'Search complete': 'var(--low)',
        'Search failed': 'var(--high)',
        'default': 'var(--prime)'
    };

    if (searchBox) {
        searchBox.setAttribute('data-status', message);
        searchBox.style.setProperty('--status-opacity', '1');

        // Dynamically set color based on status message.
        const color = colorMap[message] || colorMap['default'];
        searchBox.style.setProperty('--status-color', color);
    }
}

// Clear the search status indicator after a specified delay.
function clearSearchStatus(input) {
    const searchBox = input.closest('.search-box');
    if (searchBox) {
        searchBox.style.setProperty('--status-opacity', '0');  // Hide the status indicator.
    }
}

// Manage the fetching and handling of UV index data.
async function handleFetch(zipCode, uvIndexFetcher) {
    if (!validateZipCode(zipCode)) {
        Display.showError('Please enter a valid 5-digit ZIP Code.');  // Error for invalid ZIP code.
        UIAnimations.removeLoadingScreen();
        return;
    }

    // Start the loading animation for all .single-bar elements.
    Display.uviBarImages.forEach(img => {
        img.classList.add('loading');
    });

    try {
        // Fetch UV index data for hourly and daily indices.
        const data = await uvIndexFetcher.fetchUVIndex(zipCode);
        const dailyData = await uvIndexFetcher.fetchDailyUVIndex(zipCode);

        if (data && dailyData) {
            // Display fetched results and save the last searched ZIP code.
            await displayResults(data, dailyData, zipCode);
            localStorage.setItem('lastSearchedZipCode', zipCode);
            requestAnimationFrame(UIAnimations.removeLoadingScreen);  // Smooth removal of the loading screen.
        } else {
            UIAnimations.removeLoadingScreen();  // Handle UI cleanup if fetch failed.
        }
    } catch (error) {
        handleError(error);  // Error handling for fetch failures.
    } finally {
        // Stop the loading animation after fetch completes.
        Display.uviBarImages.forEach(img => {
            img.classList.remove('loading');
        });
    }
}

// Log and display errors encountered during fetch operations.
function handleError(error) {
    console.error('Fetch error:', error);  // Log errors to console.
    Display.showError('Error displaying data. Please try again.');  // Display error in UI.
    Display.clearAllDisplays();  // Clear UI due to errors.
    UIAnimations.removeLoadingScreen();  // Ensure loading screen is not stuck.
}

// Validate the format of a ZIP code.
function validateZipCode(zipCode) {
    return /^\d{5}$/.test(zipCode);  // Return true if ZIP code is a valid 5-digit number.
}

// Manage the display of UV index results across different parts of the UI.
async function displayResults(hourlyData, dailyData, zipCode) {
    const displayPromises = [
        Display.displayResults(hourlyData, idMap),  // Display hourly results.
        Display.displayDailyHigh(dailyData[0]),  // Display daily high.
        Display.displayDate(dailyData[0]),  // Display the date.
        Display.displayZIP({ ZIP: zipCode })  // Display the searched ZIP code.
    ];

    await Promise.all(displayPromises);  // Wait for all display updates to complete.
    requestAnimationFrame(() => {
        requestAnimationFrame(UIAnimations.removeLoadingScreen);  // Remove loading screen smoothly.
    });
}

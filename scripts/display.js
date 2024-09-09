// display.js
// This module defines a class responsible for managing the display of UI components 
// related to UV index information on the webpage.

export class Display {
    // Static properties to store references to specific DOM elements.
    static errorContainer = document.getElementById('error-container');
    static dailyHighElement = document.getElementById('dailyUVHigh');
    static dailyUVLevelElement = document.getElementById('dailyUVLevel');
    static dateElement = document.getElementById('js-date');
    static zipElement = document.getElementById('js-display-zip');
    static uvIndexElements = document.querySelectorAll('[id^="js-uvIndex"]');
    static uviBarImages = document.querySelectorAll('[id^="js-uvi-bar"]');

    // Method to clear the error message from the error container.
    static clearError() {
        if (this.errorContainer) {
            this.errorContainer.textContent = ''; // Clear the content.
            this.errorContainer.style.display = 'none'; // Hide the error container.
        }
    }

    // Method to update the color of certain elements by adding the 'updated' class.
    static updateElementColors() {
        // Add 'updated' class to elements to change their color.
        document.querySelectorAll('.time-number').forEach(element => element.classList.add('updated'));
        document.querySelectorAll('.time-am-pm').forEach(element => element.classList.add('updated'));
        document.querySelectorAll('.header-text').forEach(element => element.classList.add('updated'));
    }

    // Utility method to safely update a property of a DOM element identified by a CSS selector.
    static safeUpdateElement(selector, property, value) {
        const element = document.querySelector(selector); // Select the element.
        if (element) {
            if (property === 'src') {  // Special handling for updating 'src' properties.
                element.classList.add('loading');  // Start the loading animation.
                setTimeout(() => {
                    element[property] = value;  // Update the image source.
                    element.classList.remove('loading');  // Stop loading animation.
                    element.style.opacity = '1';  // Fade-in the new image.
                }, 300);  // Delay matches the transition duration.
            } else {
                element[property] = value;  // Set other properties directly.
            }
        } else {
            console.error(`Element with selector ${selector} not found.`);  // Log error if element is not found.
            this.showError('A display error occurred, please try again.');  // Show a generic error message.
        }
    }

    // Displays UV index results fetched from an API.
    // Takes an array of data and a mapping from time to element IDs.
    static displayResults(data, idMap) {
        this.clearError();  // Ensure previous errors are cleared.
        this.uviBarImages.forEach(img => img.classList.add('loading'));  // Start loading animation for all bars.

        data.forEach(item => {
            const elements = idMap[item.DATE_TIME.slice(-5)];  // Get mapped elements using time key.
            if (elements) {
                this.safeUpdateElement(`#${elements.text}`, 'innerText', item.UV_VALUE.toString());  // Update text.
                this.safeUpdateElement(`#${elements.img}`, 'src', `/image/uvi-bar-${item.UV_VALUE}.svg`);  // Update image.

                // Add the 'updated' class to change the color.
                const textElement = document.getElementById(elements.text);
                if (textElement) {
                    textElement.classList.add('updated');
                }
            }
        });

        // Stop loading animation after updating all elements.
        setTimeout(() => {
            this.uviBarImages.forEach(img => img.classList.remove('loading'));
        }, 300);  // Duration matches the one used in safeUpdateElement.
    }

    // Displays the daily high UV index fetched from an API.
    static displayDailyHigh(data) {
        if (data && this.dailyHighElement && this.dailyUVLevelElement) {
            this.dailyHighElement.innerText = data.UV_INDEX.toString();  // Update daily high text.
            this.updateUVLevel(this.dailyUVLevelElement, data.UV_INDEX);  // Update UV level display.

            // Add the 'updated' class to change the color.
            this.dailyHighElement.classList.add('updated');
            this.dailyUVLevelElement.classList.add('updated');
            this.updateElementColors();  // Update other element colors.
        } else {
            console.log('No data available or element not found for daily UV high.');  // Log missing data or element.
        }
    }

    // Updates the display of UV index severity level.
    static updateUVLevel(element, uvIndex) {
        const parsedUVIndex = parseInt(uvIndex, 10);  // Convert UV index to an integer.

        if (isNaN(parsedUVIndex)) {  // Check if parsing failed.
            element.innerText = 'Invalid data';  // Display error for invalid data.
            return;  // Exit early to prevent further processing.
        }

        // Update text based on UV index thresholds.
        if (parsedUVIndex <= 2) {
            element.innerText = "Low";
        } else if (parsedUVIndex <= 5) {
            element.innerText = "Moderate";
        } else if (parsedUVIndex <= 7) {
            element.innerText = "High";
        } else if (parsedUVIndex <= 10) {
            element.innerText = "Very High";
        } else {
            element.innerText = "Extreme";
        }
    }

    // Updates the display of the current date.
    static displayDate(data) {
        if (this.dateElement) {
            this.dateElement.innerText = `Date: ${data.DATE}`;  // Update date display.
            this.dateElement.closest('.date-zip-container').classList.add('updated');  // Change color.
        }
    }

    // Updates the display of the current ZIP code.
    static displayZIP(data) {
        if (this.zipElement) {
            this.zipElement.innerText = `ZIP: ${data.ZIP}`;  // Update ZIP code display.
            this.zipElement.closest('.date-zip-container').classList.add('updated');  // Change color.
        }
    }

    // Displays an error message in the error container.
    static showError(message) {
        if (this.errorContainer) {
            this.errorContainer.textContent = message;  // Set error message.
            this.errorContainer.style.display = 'block';  // Make error container visible.
        }
    }

    // Resets all displayed data in preparation for new fetches.
    static clearAllDisplays() {
        this.resetResults();  // Reset UV index results.
        this.resetDailyHigh();  // Reset daily UV high display.
        this.resetDate();  // Reset date display.
        this.resetZIP();  // Reset ZIP code display.
    }

    // Resets the UV index display elements.
    static resetResults() {
        this.uvIndexElements.forEach(element => element.innerText = '0');  // Reset UV index text.
        this.uviBarImages.forEach(img => img.src = '/image/uvi-bar-0.svg');  // Reset UV index bar images.
    }

    // Resets the display elements for daily UV high.
    static resetDailyHigh() {
        if (this.dailyHighElement) this.dailyHighElement.innerText = '0';  // Reset daily high element.
        if (this.dailyUVLevelElement) this.dailyUVLevelElement.innerText = '';  // Reset daily UV level element.
    }

    // Resets the displayed date.
    static resetDate() {
        if (this.dateElement) this.dateElement.innerText = 'Date:';  // Reset date element.
    }

    // Resets the displayed ZIP code.
    static resetZIP() {
        if (this.zipElement) this.zipElement.innerText = 'ZIP code:';  // Reset ZIP code element.
    }
}

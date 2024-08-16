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
        // First checks if the container currently exists in DOM.
        if (this.errorContainer) {
            // If so, then clear the content.
            this.errorContainer.textContent = '';
            // then display none to hide the error container.
            this.errorContainer.style.display = 'none';
        }
    }

// Utility method to safely update a property of a DOM element identified by a CSS selector.
static safeUpdateElement(selector, property, value) {
    // Grabs the selector and assigns to element.
    const element = document.querySelector(selector);
    // If else to check if element exist
    if (element) {
        // Then set the element.property to the given value.
        if (property === 'src') {
            // Handle the fade-in effect for image updates
            element.style.opacity = '0'; // Start fade-out
            setTimeout(() => {
                element[property] = value; // Update the image source
                element.style.opacity = '1'; // Fade-in to the new image
            }, 300); // Adjust the timing to match the transition duration
        } else {
        element[property] = value;
    } 
    // If no element is found.
    } else {
        // Log error and pass in the selector.
        console.error(`Element with selector ${selector} not found.`);
        // Calls this instance of showError.
        this.showError('A display error occurred, please try again.');
    }
}

// Displays UV index results fetched from an API. 
// Takes an array of data and a mapping from time to element IDs.
static displayResults(data, idMap) {
    // Makes sure all previous errors are cleared.
    this.clearError();
    // Loops through UV Index data.
    data.forEach(item => {
        // For each item retrieves mapping details from idMap using a key 
        // derived from the item's DATE_TIME property.
        // Set elements to eg "08 AM".
        const elements = idMap[item.DATE_TIME.slice(-5)];
        if (elements) {
            // Calls safeUpdateElement to update the text and image src attributes of the 
            // relevent DOM elements using the IDs provided in idMap.
            // Passes parameters selector, property, value.
            this.safeUpdateElement(`#${elements.text}`, 'innerText', item.UV_VALUE.toString());
            this.safeUpdateElement(`#${elements.img}`, 'src', `/image/uvi-bar-${item.UV_VALUE}.svg`);

            // Add the 'updated' class to change the color
            const textElement = document.getElementById(elements.text);
            if (textElement) {
                textElement.classList.add('updated');
            }
        }
    });
}
    // Displays the daily high UV index fetched from an API.
    // Passes in data.
    static displayDailyHigh(data) {
        // Checks if data, dailyHighElement, dailyUVLevelElement exist.
        if (data && this.dailyHighElement && this.dailyUVLevelElement) {
            // Sets text of dailyHighElement to the data UV_INDEX.
            this.dailyHighElement.innerText = data.UV_INDEX.toString();
            // calls updateUVLevel passes DOM element and data as parameters.
            this.updateUVLevel(this.dailyUVLevelElement, data.UV_INDEX);

            // Add the 'updated' class to change the color
            this.dailyHighElement.classList.add('updated');
            this.dailyUVLevelElement.classList.add('updated');
        } else {
            // logs to notify data or element does not exist.
            console.log('No data available or element not found for daily UV high.');
        }
    }
    // Updates the display of UV index severity level.
    // Takes in DOM element and data.
    static updateUVLevel(element, uvIndex) {
        // Converts uvIndex from a string to an integer to make comparisons.
        const parsedUVIndex = parseInt(uvIndex, 10);
        // Checks if it is not a number NaN.
        if (isNaN(parsedUVIndex)) {
            // Sets inner text to 'Invalid data'.
            element.innerText = 'Invalid data';
            // Then returns as a safeguard to prevent from futher running at this point.
            return;
        }

        // Updates text based on UV index thresholds.
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
    // Takes data as parameter.
    static displayDate(data) {
        // Checks if DOM element exist.
        if (this.dateElement) {
            // Sets inner text to data.DATE.
            this.dateElement.innerText = `Date: ${data.DATE}`;
            // Add the 'updated' class to change the color
            this.dateElement.closest('.date-zip-container').classList.add('updated');
        }
    }

    /// Updates the display of the current ZIP code.
    // Takes data as parameter.
    static displayZIP(data) {
        // Checks if DOM element exist.
        if (this.zipElement) {
            // Sets inner text to data.ZIP.
            this.zipElement.innerText = `ZIP: ${data.ZIP}`;
            // Add the 'updated' class to change the color
            this.zipElement.closest('.date-zip-container').classList.add('updated');
        }
    }

    // Call these methods to show ZIP and Date after a successful fetch
    static handleFetchSuccess(data) {
        // Display date and ZIP after fetch
        this.displayDate(data);
        this.displayZIP(data);
    }
    
    // Displays an error message in the error container.
    static showError(message) {
        // Checks if DOM element exist.
        if (this.errorContainer) {
            // Sets inner text to error message passed.
            this.errorContainer.textContent = message;
            // Then displays block
            this.errorContainer.style.display = 'block';
        }
    }
    // Resets all displayed data in preparation for new fetches.
    static clearAllDisplays() {
        this.resetResults();
        this.resetDailyHigh();
        this.resetDate();
        this.resetZIP();
    }
    // Resets the UV index display elements.
    static resetResults() {
        // Loops through each element 
        this.uvIndexElements.forEach(element => {
            // Sets inner text to 0
            element.innerText = '0';
        });
        // Loops through each image element.
        this.uviBarImages.forEach(img => {
            // Sets to default image.
            img.src = '/image/uvi-bar-0.svg';
        });
    }

    // Resets the display elements for daily UV high.
    static resetDailyHigh() {
        // Sets daily high element to 0.
        if (this.dailyHighElement) this.dailyHighElement.innerText = '0';
        // Sets daily level element to and empty string.
        if (this.dailyUVLevelElement) this.dailyUVLevelElement.innerText = '';
    }

    // Resets the displayed date.
    static resetDate() {
        // Sets inner text to just Date.
        if (this.dateElement) this.dateElement.innerText = 'Date:';
    }
    // Resets the displayed ZIP code.
    static resetZIP() {
        // Sets inner text to just ZIP code.
        if (this.zipElement) this.zipElement.innerText = 'ZIP code:';
    }
}
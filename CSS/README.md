<!-- @format -->

# UV Index Forecast App

The **UV Index Forecast App** is a web application that provides users with daily and hourly UV index data based on their location (ZIP code). The app fetches data from the EPA API and displays it in a user-friendly interface, offering insights into the current UV exposure levels, including categorized risk levels like "Low," "Moderate," "High," "Very High," and "Extreme."

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Primary Files and Their Roles](#primary-files-and-their-roles)
4. [How to Use](#how-to-use)
5. [Installation](#installation)
6. [Credits](#credits)

## Overview

The UV Index Forecast App aims to increase awareness of UV radiation exposure risks by providing accurate and timely UV index information. Users can search for UV index data by entering their ZIP code, and the app will display the current hourly UV index levels, daily high UV index, and other relevant data.

## Key Features

- **Fetch UV Index Data**: Retrieves hourly and daily UV index data for a given ZIP code using the EPA API.
- **Dynamic UI Updates**: The app dynamically updates the UV index data and displays it in an easy-to-understand format.
- **Interactive Modal**: Provides additional information about UV index levels and exposure categories.
- **Loading Screen and Animations**: Includes a visually appealing loading screen with fade-in animations for a smooth user experience.
- **Error Handling**: Proper error messages and handling for invalid ZIP codes or failed data fetches.

## Primary Files and Their Roles

### 1. `index.html`

The main HTML file that contains the structure of the web application, including the loading screen, modal dialog for additional UV index information, input fields for ZIP code entry, and containers for displaying UV index data.

### 2. `app.js`

The main JavaScript entry point that initializes the application once the DOM is fully loaded. It manages:

- Setting up event listeners for form submission and modal interactions.
- Fetching UV index data using `UVIndexFetcher`.
- Handling and displaying search results or errors.
- Managing the loading screen and animations using `UIAnimations`.

### 3. `api.js`

Defines the `API` class, which is responsible for handling API requests. It provides a method (`fetchData`) that constructs full URLs based on a base URL and endpoint and handles the fetch operations to retrieve data from the EPA API.

### 4. `uvIndexFetcher.js`

Defines the `UVIndexFetcher` class that constructs the appropriate endpoints for fetching hourly and daily UV index data. It uses the `API` class to perform the data fetch operations and handles any data-related logic, such as checking for empty results and displaying errors.

### 5. `display.js`

Defines the `Display` class, which manages updating the user interface with the fetched UV index data. Key functionalities include:

- Displaying hourly UV index data and daily high UV index.
- Updating the color and style of elements dynamically based on the data.
- Handling error messages and resetting the display for new searches.

### 6. `idMap.js`

A simple module that provides a mapping (`idMap`) from time strings (e.g., "08 AM") to corresponding DOM element IDs. This is used to dynamically update the UI with UV index data for specific times of the day.

### 7. `animations.js`

Defines the `UIAnimations` class, which is responsible for handling animations in the app, such as:

- Fading in logo parts during the loading screen.
- Removing the loading screen with a fade-out effect after data is loaded.
- Ensuring smooth transitions by managing when the loading screen is removed.

## How to Use

1. **Enter ZIP Code**: Type in a valid 5-digit ZIP code in the search box.
2. **View UV Index Data**: The app fetches and displays hourly and daily UV index data for the entered ZIP code.
3. **Learn More**: Click the logo to open a modal with more information about UV index categories and exposure risks.
4. **Error Handling**: If an invalid ZIP code is entered or the fetch fails, an appropriate error message will be displayed.

## Credits

- **Developed by**: Adam Flores
- **Data Source**: [EPA UV Index API](https://www.epa.gov/enviro/web-services#uvindex)

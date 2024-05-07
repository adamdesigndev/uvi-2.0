// app.test.js
// npm test -- jest-test/app.test.js

import { displaySearchStatus } from '../scripts/app.js';

describe('displaySearchStatus', () => {

    // Helps in reusing these variables across different tests, 
    // reducing redundancy and maintaining clarity.
    let input;
    let searchBox;
  
    // Ensure that all tests start with the same initial conditions.
    beforeEach(() => {
      // Setup a simplified DOM structure.
      document.body.innerHTML = `
        <div class="search-box">
          <input id="js-zip-code-input" />
        </div>
      `;
  
      // Get references to DOM elements
      input = document.getElementById('js-zip-code-input');
      searchBox = document.querySelector('.search-box');
    });
  
    // Used to clean up after each test and avoiding interactions between tests.
    afterEach(() => {
    // Resets all mocks back to their original state.
      jest.restoreAllMocks();
    });
  
    // Tests for different search statuses.
    test('updates search status correctly when searching', () => {
        // Calls function with arguments.
      displaySearchStatus(input, 'Searching...');
      // This assertion checks if the data-status attribute of 
      // the searchBox element is correctly set to 'Searching...'.
      expect(searchBox.getAttribute('data-status')).toBe('Searching...');
      expect(searchBox.style.getPropertyValue('--status-opacity')).toBe('1');
      expect(searchBox.style.getPropertyValue('--status-color')).toBe('var(--extreme)');
    });
  
    test('updates search status correctly on search complete', () => {
      displaySearchStatus(input, 'Search complete');
      expect(searchBox.getAttribute('data-status')).toBe('Search complete');
      expect(searchBox.style.getPropertyValue('--status-opacity')).toBe('1');
      expect(searchBox.style.getPropertyValue('--status-color')).toBe('var(--low)');
    });
  
    test('updates search status correctly on search fail', () => {
      displaySearchStatus(input, 'Search failed');
      expect(searchBox.getAttribute('data-status')).toBe('Search failed');
      expect(searchBox.style.getPropertyValue('--status-opacity')).toBe('1');
      expect(searchBox.style.getPropertyValue('--status-color')).toBe('var(--high)');
    });
  });
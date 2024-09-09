// animations.js
// This module defines the UIAnimations class, which is responsible for handling animations 
// such as the loading screen and logo animations on the webpage.

export class UIAnimations {
    /**
     * Controls the fading-in of logo parts with timed delays to create a staggered animation effect.
     * The opacity of each logo part is gradually changed to make them visible after a set delay.
     */
    static fadeInLogoParts() {
        // Array holding the delay times in milliseconds for each logo part animation.
        const delays = [500, 700, 900];  // Delays for each logo part (2, 3, 4).

        // Loop through the delay array, applying each delay to the corresponding logo part.
        delays.forEach((delay, index) => {
            setTimeout(() => {
                // Adjust the index to start from .logo-part2 (skips .logo-part1).
                // Change the opacity of the logo part to 1 to make it visible.
                document.querySelector(`.logo-part${index + 2}`).style.opacity = '1';
            }, delay);  // The delay parameter controls when the opacity change occurs.
        });
    }

    /**
     * Removes the loading screen with a fade-out effect to smoothly transition to the main content.
     * The method waits for the fade-out transition to complete before removing the element from the DOM.
     */
    static async removeLoadingScreen() {
        // Retrieve the loading screen element by its ID.
        const loadingScreen = document.getElementById('loading-screen');
        // Check if the loading screen element exists.
        if (!loadingScreen) {
            console.log('No loading screen found');  // Log to console and exit if not found.
            return;
        }

        // Add 'fade-out' class to trigger opacity transition for fade-out effect.
        loadingScreen.classList.add('fade-out');
        // Wait 500ms to allow the fade-out transition to complete.
        await new Promise(resolve => setTimeout(resolve, 500));
        // Remove the loading screen element from the DOM after the fade-out.
        loadingScreen.remove();
    }

    /**
     * Ensures the loading screen is removed only after the DOM has fully updated.
     * This prevents any flicker or incomplete rendering before the loading screen is hidden.
     */
    static removeLoadingScreenAfterUpdate() {
        // Use setTimeout to delay the removal, allowing the browser to finish rendering updates.
        setTimeout(() => {
            // Use requestAnimationFrame to ensure the DOM updates are rendered before removing the loading screen.
            requestAnimationFrame(() => {
                this.removeLoadingScreen();  // Call removeLoadingScreen to remove the loading screen.
            });
        }, 500);  // Delay provided to ensure all updates are processed.
    }
}

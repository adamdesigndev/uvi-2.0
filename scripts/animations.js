// animations.js
// Class responsible for handling animations for the loading screen and logo.
export class UIAnimations {
    // Method that controls the fading-in of logo parts with timed delays.
    static fadeInLogoParts() {
        // Array holding the delay times in milliseconds for each logo part animation.
        const delays = [500, 700, 900];
        // Loop through the delay array, applying each delay to the corresponding logo part.
        delays.forEach((delay, index) => {
            // Delay each DOM element's opacity change using setTimeout.
            setTimeout(() => {
                // Skip the first logo part (index starts at 0, adjusted to start from .logo-part2).
                // Change the opacity of the logo part to 1 to make it visible.
                document.querySelector(`.logo-part${index + 2}`).style.opacity = '1';
                // The delay parameter controls when the opacity change occurs (e.g., after 500ms for the first part).
            }, delay);
        });
    }

    // Method to remove the loading screen with a fade-out effect.
    static async removeLoadingScreen() {
        // Retrieve the loading screen element by its ID.
        const loadingScreen = document.getElementById('loading-screen');
        // Check if the loading screen element exists.
        if (!loadingScreen) {
            // Log to console and exit if no loading screen is found.
            console.log('No loading screen found');
            return;
        }

        // Add 'fade-out' class to trigger opacity transition.
        loadingScreen.classList.add('fade-out');
        // Wait 500ms to allow the fade-out transition to complete.
        await new Promise(resolve => setTimeout(resolve, 500));
        // Remove the loading screen element from the DOM.
        loadingScreen.remove();
    }

    // Method to ensure the loading screen is only removed after the DOM has fully updated.
    static removeLoadingScreenAfterUpdate() {
        // Use setTimeout to delay the removal, allowing the browser to finish rendering updates.
        setTimeout(() => {
            // Use requestAnimationFrame to ensure the DOM updates are rendered before removing the loading screen.
            requestAnimationFrame(() => {
                // Call removeLoadingScreen to remove the loading screen.
                this.removeLoadingScreen();
            });
        }, 500);  // Delay provided to ensure all updates are processed.
    }
}
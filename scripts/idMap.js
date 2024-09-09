// idMap.js
// This module defines a mapping object that associates time strings ("08 AM", "09 AM", etc.) 
// from the JSON fetch date_time to their corresponding DOM elements for text and image updates.

// The `idMap` object maps specific times to their respective UV index text and image element IDs.
// This is used to dynamically update the UI with UV index data based on the fetched time slots.
export const idMap = {
    "08 AM": { text: "js-uvIndex2", img: "js-uvi-bar2" },  // 8 AM UV index and bar elements.
    "09 AM": { text: "js-uvIndex3", img: "js-uvi-bar3" },  // 9 AM UV index and bar elements.
    "10 AM": { text: "js-uvIndex4", img: "js-uvi-bar4" },  // 10 AM UV index and bar elements.
    "11 AM": { text: "js-uvIndex5", img: "js-uvi-bar5" },  // 11 AM UV index and bar elements.
    "12 PM": { text: "js-uvIndex6", img: "js-uvi-bar6" },  // 12 PM UV index and bar elements.
    "01 PM": { text: "js-uvIndex7", img: "js-uvi-bar7" },  // 1 PM UV index and bar elements.
    "02 PM": { text: "js-uvIndex8", img: "js-uvi-bar8" },  // 2 PM UV index and bar elements.
    "03 PM": { text: "js-uvIndex9", img: "js-uvi-bar9" },  // 3 PM UV index and bar elements.
    "04 PM": { text: "js-uvIndex10", img: "js-uvi-bar10" },  // 4 PM UV index and bar elements.
    "05 PM": { text: "js-uvIndex11", img: "js-uvi-bar11" },  // 5 PM UV index and bar elements.
    "06 PM": { text: "js-uvIndex12", img: "js-uvi-bar12" },  // 6 PM UV index and bar elements.
};

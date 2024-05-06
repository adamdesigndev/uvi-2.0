// jest.config.js
export default {
    transform: {
      '^.+\\.js$': 'babel-jest'
    },
    moduleDirectories: [
      "node_modules",
      "src" // Adjust this if your source files reside in a different directory
    ]
  };
  
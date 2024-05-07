// jest.config.js
// Using ES module export
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleDirectories: [
    "node_modules",
    "scripts"  // Adjusted from 'src' to 'scripts' if that's where your JS files are
  ]
};

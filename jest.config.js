/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The test environment that will be used for testing
  // testEnvironment: "jsdom",

  // e2e Test related configuration
  preset: "jest-puppeteer",
};

module.exports = config;

// jest.setup.js
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set up Jest global
import { jest } from '@jest/globals';
global.jest = jest;

// Ensure mocking works for ESM
jest.unstable_mockModule = jest.mock;

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection in test:');
  console.error(error);
});
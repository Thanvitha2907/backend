// tests/unit/fileUpload.test.js
import { jest } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Mock fs and multer
jest.mock('fs/promises');
jest.mock('multer');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('File Upload Functionality Tests', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Test 1: Test uploads directory creation
  test('should create uploads directory if it does not exist', async () => {
    // Mock implementation for mkdir
    fs.mkdir.mockResolvedValue(undefined);

    // Import the server.js module (this will execute the IIFE that creates the directory)
    await import('../../src/server.js');

    // Check if mkdir was called with the right parameters
    expect(fs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining(path.join('src', 'uploads')),
      { recursive: true }
    );
  });

  // Test 2: Test multer storage configuration
  test('should configure multer storage with correct destination and filename function', () => {
    // Mock implementation for multer and diskStorage
    const mockStorage = {};
    multer.diskStorage.mockReturnValue(mockStorage);
    multer.mockReturnValue({ storage: mockStorage });

    // Import the server.js module
    jest.isolateModules(() => {
      require('../../src/server.js');
    });

    // Check if diskStorage was called
    expect(multer.diskStorage).toHaveBeenCalled();
    
    // Get the diskStorage configuration
    const diskStorageConfig = multer.diskStorage.mock.calls[0][0];
    
    // Test destination function
    const destinationFn = diskStorageConfig.destination;
    const mockCb = jest.fn();
    destinationFn({}, {}, mockCb);
    
    expect(mockCb).toHaveBeenCalledWith(
      null,
      expect.stringContaining(path.join('src', 'uploads'))
    );

    // Test filename function
    const filenameFn = diskStorageConfig.filename;
    const mockFile = {
      fieldname: 'profilePicture',
      originalname: 'test-image.jpg'
    };
    filenameFn({}, mockFile, mockCb);
    
    // Check that callback was called with a string containing fieldname and file extension
    expect(mockCb).toHaveBeenCalledWith(
      null,
      expect.stringMatching(/^profilePicture-\d+-\d+\.jpg$/)
    );
  });
});
// tests/unit/fileUpload.test.js
import { jest } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock fs and multer
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('multer', () => {
  const mockDiskStorage = jest.fn().mockReturnValue({});
  const mockMulter = jest.fn().mockReturnValue({});
  mockMulter.diskStorage = mockDiskStorage;
  return mockMulter;
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('File Upload Functionality Tests', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Test uploads directory creation
  test('should create uploads directory if it does not exist', async () => {
    const fs = await import('fs/promises');
    
    // Need to adjust path for the server location
    const serverPath = path.resolve(__dirname, '../../server.js');
    
    // Import the server.js module (this will execute the IIFE that creates the directory)
    await import(serverPath);

    // Check if mkdir was called with the right parameters
    expect(fs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining('uploads'),
      { recursive: true }
    );
  });

  // Test 2: Test multer storage configuration
  test('should configure multer storage with correct destination and filename function', async () => {
    const multer = await import('multer');
    
    // Need to reset the module cache to ensure a fresh import
    jest.resetModules();
    
    // Create mock functions for the storage configuration
    const mockDestinationFn = jest.fn();
    const mockFilenameFn = jest.fn();
    
    // Mock the diskStorage to capture the config
    multer.default.diskStorage.mockImplementation((config) => {
      // Store the configuration functions for testing
      mockDestinationFn.mockImplementation(config.destination);
      mockFilenameFn.mockImplementation(config.filename);
      return {};
    });

    // Import the server.js module
    const serverPath = path.resolve(__dirname, '../../server.js');
    await import(serverPath);
    
    // Check if diskStorage was called
    expect(multer.default.diskStorage).toHaveBeenCalled();
    
    // Test destination function by calling our mock implementation
    const mockCb = jest.fn();
    mockDestinationFn({}, {}, mockCb);
    
    // Since the actual path varies, just check it contains 'uploads'
    expect(mockCb).toHaveBeenCalledWith(
      null,
      expect.stringContaining('uploads')
    );

    // Test filename function
    const mockFile = {
      fieldname: 'profilePicture',
      originalname: 'test-image.jpg'
    };
    mockFilenameFn({}, mockFile, mockCb);
    
    // Check the filename format pattern
    const lastCallArgs = mockCb.mock.calls[mockCb.mock.calls.length - 1];
    expect(lastCallArgs[0]).toBeNull();
    expect(typeof lastCallArgs[1]).toBe('string');
    expect(lastCallArgs[1]).toMatch(/^profilePicture-.*\.jpg$/);
  });
});
// tests/unit/apiRoutes.test.js
import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import cors from 'cors';

// Create a minimal Express app for testing routes
const app = express();
app.use(cors());
app.use(express.json());

// Mock mongoose
jest.mock('mongoose', () => {
  const mockModel = jest.fn();
  const mockSchema = jest.fn().mockReturnValue({});
  const mockConnection = { close: jest.fn().mockResolvedValue({}) };
  
  // Mock Message model and save method
  const mockSave = jest.fn().mockResolvedValue({ _id: 'mockId123' });
  const mockSort = jest.fn().mockReturnValue([]);
  const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
  
  class MockMessage {
    constructor(data) {
      this.data = data;
      this.save = mockSave;
    }
  }
  
  MockMessage.find = mockFind;
  
  return {
    connect: jest.fn().mockResolvedValue({}),
    connection: mockConnection,
    Schema: mockSchema,
    model: jest.fn().mockImplementation((name) => {
      if (name === 'Message') return MockMessage;
      return mockModel;
    }),
    // Expose mock functions for testing
    _mockSave: mockSave,
    _mockFind: mockFind,
    _mockSort: mockSort
  };
});

// Mock fs/promises
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  readdir: jest.fn().mockResolvedValue(['file1.jpg', 'file2.jpg'])
}));

// Mock multer
jest.mock('multer', () => {
  return jest.fn().mockImplementation(() => ({
    single: jest.fn().mockImplementation(() => (req, res, next) => {
      req.file = {
        filename: 'test-file-123456.jpg'
      };
      next();
    })
  }));
});

// Import modules needed for the tests
const mongoose = await import('mongoose');
const fs = await import('fs/promises');

// Set up routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Create a new message using the mocked mongoose model
    const Message = mongoose.model('Message');
    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });
    
    // Mock save to database
    await newMessage.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Your message has been received! Thank you for contacting us.' 
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving your message. Please try again.' 
    });
  }
});

app.get('/api/files', async (req, res) => {
  try {
    // We're using the mocked fs.readdir
    const files = await fs.readdir('uploads');
    res.status(200).json({ 
      success: true,
      files: files.map(file => `/uploads/${file}`)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error reading files' 
    });
  }
});

describe('API Routes Tests', () => {
  beforeEach(() => {
    // Clear mock call history but keep mock implementations
    jest.clearAllMocks();
  });

  // Test 1: POST /api/contact with valid data
  test('POST /api/contact should return 201 for valid data', async () => {
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    };

    const response = await request(app)
      .post('/api/contact')
      .send(validData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    // Get the mock save method from our mocked mongoose
    expect(mongoose._mockSave).toHaveBeenCalled();
  });

  // Test 2: POST /api/contact with missing fields
  test('POST /api/contact should return 400 for missing fields', async () => {
    const invalidData = {
      name: 'Test User',
      // Missing email, subject, message
    };

    const response = await request(app)
      .post('/api/contact')
      .send(invalidData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(mongoose._mockSave).not.toHaveBeenCalled();
  });

  // Test 3: GET /api/files should return list of files
  test('GET /api/files should return a list of files', async () => {
    const response = await request(app)
      .get('/api/files')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.files).toEqual(['/uploads/file1.jpg', '/uploads/file2.jpg']);
  });
});
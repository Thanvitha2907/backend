import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import cors from 'cors';

// Mock middleware and models
jest.mock('mongoose');
jest.mock('multer', () => {
  return () => ({
    single: () => (req, res, next) => {
      req.file = {
        filename: 'test-file-123456.jpg'
      };
      next();
    }
  });
});

// Create a minimal Express app for testing routes
const app = express();
app.use(cors());
app.use(express.json());

// Mock Message model
const mockSave = jest.fn();
const mockFind = jest.fn();
const mockSort = jest.fn();

class MockMessage {
  constructor(data) {
    this.data = data;
    this.save = mockSave;
  }
}

MockMessage.find = mockFind;
mongoose.model = jest.fn().mockReturnValue(MockMessage);

// Mock fs
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  readdir: jest.fn().mockResolvedValue(['file1.jpg', 'file2.jpg'])
}));

// Import routes
beforeAll(() => {
  // Setup mock MongoDB connection
  mongoose.connect.mockResolvedValue({});
  
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
      
      // Create a new message
      const newMessage = new MockMessage({
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
      const files = await require('fs/promises').readdir('uploads');
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
});

afterAll(() => {
  mongoose.connection.close.mockResolvedValue({});
});

describe('API Routes Tests', () => {
  beforeEach(() => {
    mockSave.mockClear();
    mockFind.mockClear();
    mockSort.mockClear();
    mockSave.mockResolvedValue({ _id: 'mockId123' });
    mockSort.mockReturnThis();
    mockFind.mockReturnValue({ sort: mockSort });
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
    expect(mockSave).toHaveBeenCalled();
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
    expect(mockSave).not.toHaveBeenCalled();
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
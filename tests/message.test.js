// tests/unit/message.test.js
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Message model mock with the same schema as in server.js
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Mock MongoDB connection
beforeAll(async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Clear the database after each test
afterEach(async () => {
  await Message.deleteMany({});
});

describe('Message Model Tests', () => {
  // Test 1: Create a new message
  test('should create a new message successfully', async () => {
    const messageData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    };

    const newMessage = new Message(messageData);
    const savedMessage = await newMessage.save();

    // Check if message was saved correctly
    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.name).toBe(messageData.name);
    expect(savedMessage.email).toBe(messageData.email);
    expect(savedMessage.subject).toBe(messageData.subject);
    expect(savedMessage.message).toBe(messageData.message);
    expect(savedMessage.createdAt).toBeDefined();
  });

  // Test 2: Should not save message with missing required fields
  test('should not save message with missing required fields', async () => {
    const invalidMessage = new Message({
      name: 'Test User',
      // Missing email, subject, and message
    });

    let error;
    try {
      await invalidMessage.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
  });

  // Test 3: Should retrieve messages in descending order by createdAt
  test('should retrieve messages sorted by createdAt in descending order', async () => {
    // Create three messages with different timestamps
    const message1 = new Message({
      name: 'User 1',
      email: 'user1@example.com',
      subject: 'Subject 1',
      message: 'Message 1',
      createdAt: new Date('2023-01-01')
    });

    const message2 = new Message({
      name: 'User 2',
      email: 'user2@example.com',
      subject: 'Subject 2',
      message: 'Message 2',
      createdAt: new Date('2023-01-02')
    });

    const message3 = new Message({
      name: 'User 3',
      email: 'user3@example.com',
      subject: 'Subject 3',
      message: 'Message 3',
      createdAt: new Date('2023-01-03')
    });

    await Promise.all([
      message1.save(),
      message2.save(),
      message3.save()
    ]);

    // Retrieve messages sorted by createdAt in descending order
    const messages = await Message.find().sort({ createdAt: -1 });

    // Check order
    expect(messages.length).toBe(3);
    expect(messages[0].name).toBe('User 3');
    expect(messages[1].name).toBe('User 2');
    expect(messages[2].name).toBe('User 1');
  });
});
// server.js
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas and Models
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
(async () => {
  try {
    await fs.mkdir(join(__dirname, 'uploads'), { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
})();

// Serve static files from the React app (Feature 1: Serve files to the client)
app.use(express.static(join(__dirname, 'dist')));

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// API Routes

// Feature 2: Manipulate data in a database - Contact messages
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Create a new message
    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });
    
    // Save to database
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

// Get all messages - for admin purposes
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching messages' 
    });
  }
});

// Feature 3: Save and load files on the server file system - Profile picture upload
app.post('/api/upload-profile', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }
    
    res.status(201).json({ 
      success: true,
      filePath: `/uploads/${req.file.filename}`,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading file' 
    });
  }
});

// Get list of uploaded files
app.get('/api/files', async (req, res) => {
  try {
    const files = await fs.readdir(join(__dirname, 'uploads'));
    res.status(200).json({ 
      success: true,
      files: files.map(file => `/uploads/${file}`)
    });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error reading files' 
    });
  }
});

// For any other route, serve the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
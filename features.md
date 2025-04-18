# Backend Features Implemented

This document lists and summarizes the backend features implemented for the personal website.

## 1. Serve files to the client

The server uses Express.js to serve static files from the Vite-built React application. This enables the server to deliver:
- The built React application files (HTML, CSS, JS)
- Assets like images, fonts, etc.
- Dynamically uploaded files (from the file upload feature)

Implementation details:
- Express static middleware is used to serve the files
- Routes are configured to serve the React single-page application
- All routes that don't match API endpoints serve the index.html file (for client-side routing)

## 2. Manipulate data in a database or data store

The server uses MongoDB (via Mongoose) to store and manipulate data:
- Contact form submissions are stored in a MongoDB database
- API endpoints provide access to create and read messages

Implementation details:
- MongoDB Atlas cloud-based database is used for storage
- Connection is established using environment variables for security
- Mongoose schemas define the structure of the stored data
- API endpoints handle CRUD operations for the database

## 3. Save and load files on the server file system

The server implements file upload capabilities:
- Users can upload profile pictures that are saved on the server
- The server manages uploaded files and makes them available to clients
- File listing API endpoint provides access to the stored files

Implementation details:
- Multer middleware handles file uploads
- Files are stored in an 'uploads' directory on the server
- Unique filenames are generated to prevent conflicts
- Files are served back to clients via static file middleware
- API endpoint lists available files

## Database Access

The MongoDB database is cloud-hosted on MongoDB Atlas with appropriate public access configurations to allow grading from any IP address. The connection string uses environment variables for security.

## API Summary

The following API endpoints are implemented:

- `POST /api/contact` - Store a contact form submission in the database
- `GET /api/contact` - Retrieve all contact form submissions
- `POST /api/upload-profile` - Upload a profile picture to the server
- `GET /api/files` - List all uploaded files

## Running the Application

1. Install dependencies: `npm install`
2. Configure environment variables in `.env` file
3. Build the React app: `npm run build`
4. Start the server: `npm run start`

Or for development mode:
- Run `npm run dev:full` to start both frontend and backend in development mode
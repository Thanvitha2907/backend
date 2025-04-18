# Personal Website Testing

This document provides instructions for running tests for the personal website application.

## Overview

The test suite includes:

- **Unit Tests**: For backend features like database operations, file uploads, and API routes.
- **End-to-End Tests**: For frontend features like navigation and form submissions.

## Test Setup

1. Make sure all dependencies are installed:
```
npm install
```

2. Configure environment variables by creating a `.env` file in the root directory with:
```
MONGODB_URI=mongodb://localhost:27017/test
PORT=5000
```

## Running Tests

### All Tests

To run all tests (both unit and end-to-end):
```
npm test
```

This command will:
1. Start the server
2. Run the unit tests
3. Run the end-to-end tests with Cypress

### Unit Tests Only

To run only the backend unit tests:
```
npm run test:unit
```

### End-to-End Tests Only

To run only the end-to-end tests (requires server to be running):
```
npm run test:e2e
```

Or to open Cypress for interactive testing:
```
npm run cypress:open
```

## Test Structure

### Unit Tests

- `tests/unit/message.test.js`: Tests for MongoDB Message model operations
- `tests/unit/fileUpload.test.js`: Tests for file upload functionality
- `tests/unit/apiRoutes.test.js`: Tests for API route validations

### End-to-End Tests

- `tests/e2e/navigation.cy.js`: Tests for website navigation
- `tests/e2e/contactForm.cy.js`: Tests for contact form submission

## Test Coverage

Run the unit tests with coverage report:
```
npm run test:unit
```

Coverage reports will be generated in the `coverage` directory.
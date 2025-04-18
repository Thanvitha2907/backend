// tests/e2e/contactForm.cy.js
describe('Contact Form Submission', () => {
    beforeEach(() => {
      // Visit the contact page before each test
      cy.visit('/contact');
    });
  
    it('should submit the contact form successfully', () => {
      // Intercept the POST request to the contact API
      cy.intercept('POST', '/api/contact', {
        statusCode: 201,
        body: { 
          success: true, 
          message: 'Your message has been received! Thank you for contacting us.' 
        }
      }).as('contactForm');
      
      // Fill out form fields
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#subject').type('E2E Test Subject');
      cy.get('#message').type('This is an automated test message from Cypress.');
      
      // Submit the form
      cy.get('button[type="submit"]').click();
      
      // Wait for the API request to complete
      cy.wait('@contactForm');
      
      // Check for success message
      cy.get('.status-message.success')
        .should('be.visible')
        .and('contain', 'Your message has been received');
      
      // Verify form has been reset
      cy.get('#name').should('have.value', '');
      cy.get('#email').should('have.value', '');
      cy.get('#subject').should('have.value', '');
      cy.get('#message').should('have.value', '');
    });
  
    it('should display error message when form submission fails', () => {
      // Intercept the POST request to the contact API with an error response
      cy.intercept('POST', '/api/contact', {
        statusCode: 500,
        body: { 
          success: false, 
          message: 'Error saving your message. Please try again.' 
        }
      }).as('contactFormError');
      
      // Fill out form fields
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#subject').type('E2E Test Subject');
      cy.get('#message').type('This should trigger an error response.');
      
      // Submit the form
      cy.get('button[type="submit"]').click();
      
      // Wait for the API request to complete
      cy.wait('@contactFormError');
      
      // Check for error message
      cy.get('.status-message.error')
        .should('be.visible')
        .and('contain', 'Error saving your message');
      
      // Form values should persist when there's an error
      cy.get('#name').should('have.value', 'Test User');
      cy.get('#email').should('have.value', 'test@example.com');
      cy.get('#subject').should('have.value', 'E2E Test Subject');
      cy.get('#message').should('have.value', 'This should trigger an error response.');
    });
  });
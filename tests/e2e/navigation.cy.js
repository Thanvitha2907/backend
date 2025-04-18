// tests/e2e/navigation.cy.js
describe('Site Navigation', () => {
    it('should navigate between Home and Contact pages', () => {
      // Visit home page
      cy.visit('/');
      
      // Verify we are on the home page
      cy.contains('h1', 'Welcome to My Personal Story').should('be.visible');
      cy.contains('About Me').should('be.visible');
      cy.contains('My Education').should('be.visible');
      cy.contains('My Hobbies').should('be.visible');
      
      // Click on Contact Me link
      cy.contains('Contact Me').click();
      
      // Verify we are now on the contact page
      cy.contains('h1', 'Contact Me').should('be.visible');
      cy.contains('Get in Touch').should('be.visible');
      
      // Navigate back to Home page
      cy.contains('Home').click();
      
      // Verify we are back on the home page
      cy.contains('h1', 'Welcome to My Personal Story').should('be.visible');
    });
  
    it('should open university link in a new tab', () => {
      // Visit home page
      cy.visit('/');
      
      // Find the university link and verify it has the correct attributes
      cy.contains('My University')
        .should('have.attr', 'href', 'https://www.pfw.edu/')
        .should('have.attr', 'target', '_blank')
        .should('have.attr', 'rel', 'noopener noreferrer');
    });
  });
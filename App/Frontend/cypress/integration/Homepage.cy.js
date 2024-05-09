describe('Homepage Working', () => {
  it('Visit Homepage', () => {
    cy.visit('https://localhost:4200/home');
  });
});

describe('Home Page Links', () => {
  it('Learn More', () => {
    cy.get('#root > main > div > div > div > div.right > div > a:nth-child(1)')
      .should('be.visible')
      .click();
    cy.url()
      .should('contain', 'about');
  });
  it('Get Started', () => {
    //return to homepage after testing the previous link
    cy.visit('https://localhost:4200/home');
    cy.get('#root > main > div > div > div > div.right > div > a:nth-child(2)')
      .should('be.visible')
      .click();
    cy.url()
      .should('contain', 'signup');
  });
});
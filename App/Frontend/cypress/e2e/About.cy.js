describe('About Page', () => {
  it('Page Operational', () => {
    cy.visit('https://localhost:4200/about');
    cy.readFile('../Frontend/src/components/pages/about.txt');
    cy.get('.aboutText').should('contain', 'journal');
  });
});
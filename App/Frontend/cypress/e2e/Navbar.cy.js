//this ensures that if the element is rendered async, that cypress waits for it to load prior to following command chains
describe('Navbar Page', () => {
    describe('Navbar links', () => {
        it('Home', () => {
            cy.visit('https://localhost:4200');
            //home links is the WWN icon
            cy.get('#root > nav > div.logo-container')
                .should('be.visible') 
                .click();
            //check correct routing:
            cy.url()
                .should('contain', 'home');
            cy.get('#root > main > div > div > div > div.left > h1:nth-child(1)')
                .should('be.visible')
                .should('contain', 'Woo');
        });

        it('Find Healers', () => {
            //checks that the navbar link to 'find healers' exists
            cy.get('nav > ul > li:nth-child(1) > a')
                .should('be.visible')
                .click();
            //check correct routing:
            cy.url()
                .should('contain', 'search');
        });

        it('About', () => {
            //checks that the navbar link to 'find healers' exists
            cy.get('nav > ul > li:nth-child(2) > a')
                .should('be.visible')
                .click();
            //check correct routing:
            cy.url()
                .should('contain', 'about');
        });

        it('Schedule', () => {
            //checks that the navbar link to 'find healers' exists
            cy.get('nav > ul > li:nth-child(3) > a')
                .should('be.visible')
                .click();
            //check correct routing:
            cy.url()
                .should('contain', 'schedule');
        });

        it('Sign In', () => {
            //checks that the navbar link to 'find healers' exists
            cy.get('nav > ul > li:nth-child(3) > a')
                .should('be.visible')
                .click();
            //check correct routing:
            cy.url()
                .should('contain', 'signin');
        });

        it('Sign Up', () => {
            //checks that the navbar link to 'find healers' exists
            cy.get('nav > ul > li:nth-child(3) > a')
                .should('be.visible')
                .click();
            //check correct routing:
            cy.url()
                .should('contain', 'signup');
        });
    });

    describe('Navbar Updates on Sign In', () => {
        it('Sign In as Test User', () => {
            //to-do
            cy.setCookie('__session', 'abc');
            cy.visit('https://localhost:4200/signin');
        });
    });
});
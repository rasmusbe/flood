context('Register', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:4200/register');
    cy.url().should('include', 'register');
  });

  it('Client selection menu', () => {
    cy.get('.select').click();
    cy.get('.context-menu').should('be.visible');
    cy.get('.select__item').contains('rTorrent').click();
    cy.get('.context-menu').should('not.be.visible');
    cy.get('.input[name="client"]').should('have.value', 'rTorrent');
  });

  it('Connection type selection', () => {
    cy.get('.toggle-input__label').contains('TCP').click();
    cy.get('.toggle-input__element[value="tcp"]').should('be.checked');
    cy.get('.toggle-input__element[value="socket"]').should('not.be.checked');
    cy.get('.input--text[name="host"]').should('be.visible');
    cy.get('.input--text[name="port"]').should('be.visible');
    cy.get('.input--text[name="socket"]').should('not.be.visible');

    cy.get('.toggle-input__label').contains('Socket').click();
    cy.get('.toggle-input__element[value="tcp"]').should('not.be.checked');
    cy.get('.toggle-input__element[value="socket"]').should('be.checked');
    cy.get('.input--text[name="host"]').should('not.be.visible');
    cy.get('.input--text[name="port"]').should('not.be.visible');
    cy.get('.input--text[name="socket"]').should('be.visible');
  });

  it('Register without username', () => {
    cy.get('.input[name="password"]').type('test');
    cy.get('.select').click();
    cy.get('.select__item').contains('rTorrent').click();
    cy.get('.toggle-input__label').contains('Socket').click();
    cy.get('.input--text[name="socket"]').type('/data/rtorrent.sock');
    cy.get('.button[type="submit"]').click();
    cy.get('.application__view--auth-form').should('be.visible');
    cy.get('.application__content').should('not.be.visible');
    cy.get('.application__loading-overlay').should('not.be.visible');
  });

  it('Register without password', () => {
    cy.get('.input[name="username"]').type('test');
    cy.get('.select').click();
    cy.get('.select__item').contains('rTorrent').click();
    cy.get('.toggle-input__label').contains('TCP').click();
    cy.get('.input--text[name="host"]').type('127.0.0.1');
    cy.get('.input--text[name="port"]').type('5000');
    cy.get('.button[type="submit"]').click();
    cy.get('.application__view--auth-form').should('be.visible');
    cy.get('.application__content').should('not.be.visible');
    cy.get('.application__loading-overlay').should('not.be.visible');
  });

  it('Register without connection settings', () => {
    cy.get('.input[name="username"]').type('test');
    cy.get('.input[name="password"]').type('test');
    cy.get('.button[type="submit"]').click();
    cy.get('.application__view--auth-form').should('be.visible');
    cy.get('.application__content').should('not.be.visible');
    cy.get('.application__loading-overlay').should('not.be.visible');
  });

  it('Register with socket connection settings', () => {
    cy.get('.input[name="username"]').type('test');
    cy.get('.input[name="password"]').type('test');
    cy.get('.select').click();
    cy.get('.select__item').contains('rTorrent').click();
    cy.get('.toggle-input__label').contains('Socket').click();
    cy.get('.input--text[name="socket"]').type('/data/rtorrent.sock');

    cy.server();
    cy.route({method: 'POST', url: 'http://127.0.0.1:4200/api/auth/register', response: {}, status: 403}).as(
      'register-request',
    );

    cy.get('.button[type="submit"]').click();

    cy.get('.application__view--auth-form').should('not.be.visible');
    cy.get('.application__content').should('be.visible');
  });
});
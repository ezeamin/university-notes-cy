// Important!
// It will only detect if any parcial has been loaded. It should be refactored.
describe('PARCIALES', () => {
  it('Detecta notas de examenes parciales', () => {
    cy.visit('https://alumnos.unsta.edu.ar/index.php/login');

    // Input username
    const username = Cypress.env('username');
    cy.get('input[name="signin[username]"]').type(username);

    // Input password
    const password = Cypress.env('password');
    cy.get('input[name="signin[password]"]').type(password);

    // Click submit button
    cy.get('button[type="submit"][name="commit"]').click();

    // THIS SECTION SHOULD ONLY BE ACTIVE IF USER HAS MORE THAN 1 PROFILE
    //
    // Click dropdown
    cy.get('input.select-dropdown.dropdown-trigger').click();
    //
    // Select option
    const studentCode = Cypress.env('studentCode');
    cy.get('li > span').contains(studentCode).click();
    //
    // Expect studentCode to be visible
    cy.get('li')
      .contains('span', studentCode)
      .parent('li')
      .should('have.class', 'selected');
    //
    // ENDS SPECIAL SECTION ----------------------------------------------

    // Click "Parciales" link
    cy.contains('a', 'Parciales').click();

    const request = { novedades: false };
    const MAIL_URL = Cypress.env('mailEndpoint');
    cy.contains('div', 'NO SE REGISTRAN PARCIALES CARGADOS.').then(($element) => {
      if (!$element || $element.length <= 0) {
        request.novedades = true;
      }
      cy.request('POST', `${MAIL_URL}/parciales`, request);
    });
  });
});

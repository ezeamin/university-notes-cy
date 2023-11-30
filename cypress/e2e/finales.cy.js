import { materias } from '../../materias';

describe('FINALES', { retries: 3 , testIsolation: true }, () => {
  it('Detecta notas de examenes finales', () => {
    cy.visit('https://alumnos.unsta.edu.ar/index.php/login');

    const MAIL_URL = Cypress.env('mailEndpoint');
    cy.request("OPTIONS",`${MAIL_URL}/finales`)

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

    // Click "Situación Acad. / Aranc." link
    cy.contains('a', 'Situación Acad. / Aranc.').click();

    // Click "bUsu" button
    cy.get('#bUsu').click();

    // Wait for 1000ms
    cy.wait(1000);

    cy.contains('a', 'Ver Situación Académica')
      .invoke('attr', 'href')
      .then((href) => {
        const MAIL_URL = Cypress.env('mailEndpoint');
        const args = { url: href, materias, MAIL_URL };

        // Open a new test context with the copied URL
        cy.origin('https://drive.google.com', { args }, (args) => {
          cy.visit(args.url);

          const results = [];

          const { materias } = args;

          materias.forEach((materia) => {
            cy.log(`MATERIA: ${materia.id}`);

            cy.contains(materia.id).then(($element) => {
              const text = $element.text();
              const regex = /\b[IRAD]\b/g;

              const matches = text.match(regex);

              cy.log(matches);

              expect(!!matches.length).to.be.true;

              let score = '';

              if (matches && (matches[0] === 'A' || matches[0] === 'D')) {
                const scoreText = text.match(/\b(\d{1,2}\.\d{2})\b/g);
                score = scoreText[0];
              }

              if (matches.length) {
                let match = matches[0];
                if (matches.length > 1) {
                  match = matches.at(-1);
                }
                results.push({ materia, state: match, score });
              }
            });
          });

          cy.request('POST', `${args.MAIL_URL}/finales`, results);
        });
      });
  });
});

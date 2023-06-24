# Pruebas UNSTA

Para correr este servicio de Cypress, configurar:

1. cypress.env.json -> Debe tener el formato de cypress_sample.env.json (el link al backend será el baseUrl. Deberá tener endpoints POST /finales & /parciales)
2. materias.js -> Seguir los ejemplos y cargar las materias
3. cypress/e2e/finales.cy.js -> Revisar sección remarcada si es necesario dejarla. Sino, comentarla.
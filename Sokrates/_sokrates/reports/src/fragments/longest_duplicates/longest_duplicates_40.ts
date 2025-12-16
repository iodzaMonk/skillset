cypress/e2e/complete_test.cy.ts [267:273]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      cy.visit("localhost:3000");
      openMenu();
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



cypress/e2e/complete_test.cy.ts [435:441]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      cy.visit("localhost:3000");
      openMenu();
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




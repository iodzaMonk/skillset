cypress/e2e/complete_test.cy.ts [165:170]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    });
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



cypress/e2e/complete_test.cy.ts [302:307]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    });
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




cypress/e2e/complete_test.cy.ts [243:251]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      cy.intercept("GET", "/api/user/me", {
        statusCode: 200,
        body: {
          user: {
            id: "user-test-id",
            email: email,
            name: "Test User",
            country: "AU",
            birthday: null,
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



cypress/e2e/complete_test.cy.ts [267:275]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      cy.intercept("GET", "/api/user/me", {
        statusCode: 200,
        body: {
          user: {
            id: "user-test-id",
            email: email,
            name: "Test User",
            country: "AU",
            birthday: null,
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




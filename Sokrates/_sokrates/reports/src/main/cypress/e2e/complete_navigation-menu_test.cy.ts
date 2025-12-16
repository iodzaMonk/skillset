import { v4 as uuidv4 } from "uuid";

describe("Navigation Menu Test", () => {
  const appBaseUrl = "http://localhost:3000";
  const uniqueId = uuidv4().substring(0, 8);
  const email = `testuser_${uniqueId}@example.com`;
  const password = "password1234";

  describe("Unauthenticated navigation Menu Links", () => {
    it("visit browse page", { retries: 5 }, function () {
      cy.visit(appBaseUrl);
      cy.get('[data-testid="menu-toggle"] svg.absolute').click();
      cy.get('a[href="/browse"]').click();
    });
    it("visit about page", { retries: 5 }, function () {
      cy.visit(appBaseUrl);
      cy.get('[data-testid="menu-toggle"] svg.absolute').click();
      cy.get('a[href="/about"]').click();
    });

    it("visit login page", { retries: 5 }, function () {
      cy.visit(appBaseUrl);
      cy.get('[data-testid="menu-toggle"] svg.absolute').click();
      cy.get('a[href="/auth/login"]').click();
    });

    it("visit signup page and register", function () {
      cy.visit(appBaseUrl);
      cy.get('[data-testid="menu-toggle"] svg.absolute').click();
      cy.get('a[href="/auth/signup"]').click();

      cy.get('[name="name"]').click();
      cy.get('[name="name"]').type("test name");

      cy.get('[name="email"]').click();
      cy.get('[name="email"]').type(email);

      cy.get('[name="password"]').click();
      cy.get('[name="password"]').type(password);

      cy.get('[name="confirmPassword"]').click();
      cy.get('[name="confirmPassword"]').type(password);
      cy.get('[role="combobox"]').click();
      cy.contains('[role="option"]', "Canada").click();

      cy.contains("button", "Submit").click();
    });
  });

  describe("Authenticated Navigation Menu Links", () => {
    beforeEach(() => {
      const visitorEmail = email;
      const visitorPassword = password;
      cy.visit(appBaseUrl);
      cy.get('[data-testid="menu-toggle"] svg.absolute').click();
      cy.get('a[href="/auth/login"]').click();

      cy.get('[name="email"]').click();
      cy.get('[name="email"]').type(visitorEmail);

      cy.get('[name="password"]').click();
      cy.get('[name="password"]').type(visitorPassword);

      cy.contains("button", "Sign in").click();
    });

    it("visit my product page", { retries: 5 }, function () {
      cy.get('[data-testid="menu-toggle"] svg.absolute').click();
      cy.get('a[href="/myproduct"]').click();
    });
    it("visit my orders list page", { retries: 5 }, function () {
      cy.get('[data-testid="menu-toggle"] svg.absolute').click();
      cy.get('a[href="/myorderslist"]').click();
    });
    it("visit orders page", { retries: 5 }, function () {
      cy.get('[data-testid="menu-toggle"] svg.absolute').click();
      cy.get('a[href="/orders"]').click();
    });
    it("visit settings page", { retries: 5 }, function () {
      cy.get('[data-testid="menu-toggle"] svg.absolute').click();
      cy.get('a[href="/settings"]').click();
    });
  });
});

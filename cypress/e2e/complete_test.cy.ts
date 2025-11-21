import { v4 as uuidv4 } from "uuid";

describe("Complete User Flow", () => {
  const uniqueId = uuidv4().substring(0, 8);
  const email = `testuser_${uniqueId}@example.com`;
  const password = "password123";

  before(() => {
    cy.viewport(1280, 720);
    cy.visit("localhost:3000");
    cy.get('[data-testid="menu-toggle"]').click();
    cy.contains("Sign up").should("be.visible");
    cy.contains("Sign up").click({ force: true });

    cy.url().should("include", "/auth/signup", { timeout: 10000 });
    cy.contains("Create your account").should("be.visible");

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="name"]').type("Test User");
    cy.get('input[name="password"]').first().type(password);
    cy.get('input[name="confirmPassword"]').type(password);

    cy.get('[role="combobox"]').click();
    cy.wait(1000);
    cy.contains('[role="option"]', "Australia").click();
    cy.contains("button", "Submit").click();

    cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    cy.contains("Welcome Test User").should("be.visible");
  });

  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  describe("Home Page", () => {
    it("should display home page content", () => {
      cy.visit("localhost:3000");
      cy.contains("Discover Products");
      cy.contains("Featured Products");
    });
  });

  describe("Logout", () => {
    it("should log out the user", () => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").should("be.visible");
      cy.contains("Login").click({ force: true });

      cy.url().should("include", "/auth/login", { timeout: 10000 });
      cy.contains("Sign in to your account").should("be.visible");

      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();

      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
      cy.contains("Welcome Test User").should("be.visible");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Logout").should("be.visible");
      cy.contains("Logout").click({ force: true });
    });
  });

  describe("Login", () => {
    it("should log in an existing user", () => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").should("be.visible");
      cy.contains("Login").click({ force: true });

      cy.url().should("include", "/auth/login", { timeout: 10000 });
      cy.contains("Sign in to your account").should("be.visible");

      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();

      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
      cy.contains("Welcome Test User").should("be.visible");
    });
  });

  describe("Settings Page", () => {
    beforeEach(() => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").should("be.visible");
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    });

    it("should navigate to settings page", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Settings").should("be.visible");
      cy.contains("Settings").click({ force: true });

      cy.url().should("include", "/settings", { timeout: 10000 });
      cy.wait(1000);
      cy.get('h1, [data-testid="settings-title"]')
        .contains("Settings", { matchCase: false })
        .should("be.visible", { timeout: 10000 });
      cy.get('input[name="name"]').clear().type("Updated User");
      cy.contains("button", "Update").click();

      cy.reload();
      cy.get('input[name="name"]').should("have.value", "Updated User");
    });
  });

  describe("Browse Products", () => {
    beforeEach(() => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").should("be.visible");
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    });

    it("should navigate to browse page", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Browse").should("be.visible");
      cy.contains("Browse").click({ force: true });

      cy.url().should("include", "/browse", { timeout: 10000 });
    });

    it("should view product details and interact with order", () => {
      cy.visit("localhost:3000/browse");

      cy.get('a[href*="/product/"]').first().click();
      cy.url().should("include", "/product/");

      cy.contains("Order Now").should("be.visible");
      cy.contains("Order Now").click({ force: true });
      cy.contains("Cancel").click({ force: true });
    });
  });
});

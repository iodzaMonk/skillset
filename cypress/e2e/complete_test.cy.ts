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

      cy.wait(1000);
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").should("be.visible");
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

  describe("Stripe Vendor Account Setup", () => {
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

    it("should assign test vendor_id to user", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Settings").click({ force: true });
      cy.url().should("include", "/settings", { timeout: 10000 });
      cy.scrollTo("bottom");
      cy.get('[data-testid="connect-stripe-button"]', { timeout: 10000 })
        .should("exist")
        .should("be.visible");
      cy.getCookies().then((cookies) => {
        cy.request({
          method: "POST",
          url: "http://localhost:3000/api/user/test-vendor",
          body: {
            vendor_id: "acct_test_cypress_123456",
          },
          headers: {
            Cookie: cookies
              .map((cookie) => `${cookie.name}=${cookie.value}`)
              .join("; "),
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.success).to.be.true;
        });
      });
      cy.reload();
      cy.url().should("include", "/settings");
      cy.scrollTo("bottom");
      cy.get('[data-testid="connect-stripe-button"]').should("not.exist");
      cy.contains("Your Stripe account is already connected").should(
        "be.visible",
      );
    });
  });

  describe("Product Creation", () => {
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

    it("should create a new product", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("My Products").click({ force: true });
      cy.url().should("include", "/myproduct", { timeout: 10000 });
      cy.contains("Create a vendor account before creating products").should(
        "not.exist",
      );
      cy.contains("button", "Create").should("be.visible").click();
      cy.get('[role="dialog"]', { timeout: 10000 }).should("be.visible");
      cy.get('[role="dialog"]').within(() => {
        cy.get("input#title").type("Test Product from Cypress");
        cy.get("input#description").type(
          "This is a test product created by Cypress E2E tests",
        );
        cy.get("input#price").clear().type("99.99");

        cy.get('button[role="combobox"]').click();
      });
      cy.wait(500);
      cy.get('[role="option"]').contains("Video editing").click();
      cy.get('[role="dialog"]').within(() => {
        cy.contains("button", "Create").click();
      });
      cy.wait(3000);
      cy.contains("Test Product from Cypress").should("be.visible");
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

    it("should navigate to browse page and view products", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Browse").should("be.visible");
      cy.contains("Browse").click({ force: true });

      cy.url().should("include", "/browse", { timeout: 10000 });
      cy.get('a[href*="/product/"]').should("have.length.greaterThan", 0);
    });
  });
});

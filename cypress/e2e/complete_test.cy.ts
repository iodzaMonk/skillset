import { v4 as uuidv4 } from "uuid";

describe("Enter Website", () => {
  it("passes", () => {
    const uniqueId = uuidv4().substring(0, 8);
    const email = `testuser_${uniqueId}@example.com`;
    cy.viewport(1280, 720);
    cy.visit("localhost:3000");
    cy.contains("Discover Products");
    cy.contains("Featured Products");
    cy.get('[data-testid="menu-toggle"]').click();
    // Open Sign up page
    cy.contains("Sign up").should("be.visible");
    cy.contains("Sign up").click({ force: true });

    cy.url().should("include", "/auth/signup", { timeout: 10000 });
    cy.contains("Create your account").should("be.visible");

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="name"]').type("Test User");
    cy.get('input[name="password"]').first().type("password123");
    cy.get('input[name="confirmPassword"]').type("password123");

    cy.get('[role="combobox"]').click();
    cy.wait(1000);
    cy.contains('[role="option"]', "Australia").click();
    cy.contains("button", "Submit").click();

    cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    cy.contains("Welcome Test User").should("be.visible");

    // Log Out
    cy.get('[data-testid="menu-toggle"]').click();
    cy.contains("Logout").should("be.visible");
    cy.contains("Logout").click({ force: true });

    // Login
    cy.get('[data-testid="menu-toggle"]').click();
    cy.contains("Login").should("be.visible");
    cy.contains("Login").click({ force: true });

    // Wait for login page to load
    cy.url().should("include", "/auth/login", { timeout: 10000 });
    cy.contains("Sign in to your account").should("be.visible");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type("password123");
    cy.contains("button", "Sign in").click();
    cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    cy.contains("Welcome Test User").should("be.visible");

    // Open My Products page
    cy.get('[data-testid="menu-toggle"]').click();
    cy.contains("Browse").should("be.visible");
    cy.contains("Browse").click({ force: true });

    cy.url().should("include", "/browse", { timeout: 10000 });

    cy.get('a[href*="/product/"]').first().click();
    cy.url().should("include", "/product/");
    cy.contains("Order Now").should("be.visible");
    cy.contains("Order Now").click({ force: true });
    cy.contains("Cancel").click({ force: true });
  });
});

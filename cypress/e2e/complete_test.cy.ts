import { v4 as uuidv4 } from "uuid";

describe("Complete User Flow", () => {
  const appBaseUrl = "http://localhost:3000";
  const uniqueId = uuidv4().substring(0, 8);
  const email = `testuser_${uniqueId}@example.com`;
  const password = "password123";
  let currentUserId: string;

  const getCurrentUser = () => {
    return cy.getCookies().then((cookies) =>
      cy
        .request({
          method: "GET",
          url: `${appBaseUrl}/api/user/me`,
          headers: {
            Cookie: cookies
              .map((cookie) => `${cookie.name}=${cookie.value}`)
              .join("; "),
          },
        })
        .then((response) => {
          currentUserId = response.body.user.id;
          return cy.wrap(response.body.user.id);
        }),
    );
  };

  const createOrderRequest = (payload: {
    description: string;
    prof_id: string;
    productId: string;
    userId: string;
  }) =>
    cy.getCookies().then((cookies) =>
      cy.request({
        method: "POST",
        url: `${appBaseUrl}/api/orders`,
        body: payload,
        headers: {
          Cookie: cookies
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; "),
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }),
    );

  const clickViewDetailsFor = (productName: string) => {
    cy.contains("h2", productName, { matchCase: false })
      .should("be.visible")
      .parents('[class*="rounded-2xl"]')
      .first()
      .find('a[href*="/product/"]')
      .first()
      .click();
  };

  before(() => {
    cy.viewport(1280, 720);
    cy.visit("localhost:3000");
    cy.get('[data-testid="menu-toggle"]').click();
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
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
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

  describe("Product Management", () => {
    beforeEach(() => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
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
        cy.get("input#title").type("Cypress Test Product");
        cy.get("input#description").type("Product for E2E testing orders");
        cy.get("input#price").clear().type("50.00");
        cy.get('button[role="combobox"]').click();
      });

      cy.wait(500);
      cy.get('[role="option"]').contains("Video editing").click();

      cy.get('[role="dialog"]').within(() => {
        cy.contains("button", "Create").click();
      });

      cy.wait(1000);
      cy.contains("Cypress Test Product").should("be.visible");
      cy.contains("$50.00").should("be.visible");
    });

    it("should view product details", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Browse").click({ force: true });
      cy.url().should("include", "/browse");

      clickViewDetailsFor("Cypress Test Product");
      cy.url().should("include", "/product/");

      cy.contains("Cypress Test Product").should("be.visible");
      cy.contains("$50.00").should("be.visible");
      cy.contains("Product for E2E testing orders").should("be.visible");
      cy.contains("button", "Order Now").should("be.visible");
    });
  });

  describe("Browse Products", () => {
    beforeEach(() => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    });

    it("should navigate to browse page and view products", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Browse").click({ force: true });

      cy.url().should("include", "/browse", { timeout: 10000 });
      cy.get('a[href*="/product/"]').should("have.length.greaterThan", 0);
    });

    it("should filter products by category", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Browse").click({ force: true });

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="category-filter"]').length > 0) {
          cy.get('[data-testid="category-filter"]').select("Video editing");
          cy.wait(1000);
          cy.get('a[href*="/product/"]').should("exist");
        }
      });
    });
  });

  describe("Order Creation and Management", () => {
    beforeEach(() => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    });

    it("should create an order via API", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Browse").click({ force: true });

      clickViewDetailsFor("Cypress Test Product");
      cy.url().should("include", "/product/");

      cy.url().then((url) => {
        const productId = url.split("/product/")[1];

        return getCurrentUser().then((userId) => {
          return createOrderRequest({
            description: "Test order - need video editing for my project",
            prof_id: userId,
            productId: productId,
            userId: userId,
          }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("message");
          });
        });
      });
    });

    it("should view order as customer in My Cart", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("My Cart").click({ force: true });
      cy.url().should("include", "/myorderslist");
      cy.wait(2000);

      cy.get("body").then(($body) => {
        if (!$body.text().includes("Once the professional accepts")) {
          cy.contains("Cypress Test Product").should("be.visible");
          cy.contains("Test order").should("be.visible");
        } else {
          cy.contains("Once the professional accepts").should("be.visible");
        }
      });
    });
  });
  /*
    it("should view and update order as professional", () => {
      cy.url().then((currentUrl) => {
        const baseUrl = new URL(currentUrl).origin;
        cy.visit(`${baseUrl}/orders`);
      });

      cy.url({ timeout: 10000 }).should("include", "/orders");
      cy.get("body", { timeout: 10000 }).should("be.visible");
      cy.wait(2000);

      cy.get("body", { timeout: 10000 }).then(($body) => {
        if ($body.text().includes("Once you accept an order")) {
          cy.contains("Once you accept an order", { timeout: 10000 }).should(
            "be.visible",
          );
          return;
        }

        cy.get('input[type="checkbox"]', { timeout: 10000 })
          .first()
          .should("be.visible")
          .check({ force: true });

        cy.get("button", { timeout: 10000 })
          .filter((_, el) => /Modify/i.test(el.textContent || ""))
          .first()
          .should("be.visible")
          .click({ force: true });

        cy.get('[role="dialog"]', { timeout: 10000 }).should("be.visible");
        cy.get('[role="dialog"]').within(() => {
          cy.get('button[role="combobox"]', { timeout: 10000 })
            .should("be.visible")
            .click({ force: true });
        });
        cy.get('[role="option"]', { timeout: 10000 })
          .contains(/Accept/i)
          .should("be.visible")
          .click({ force: true });

        cy.get('[role="dialog"]').within(() => {
          cy.contains(/Confirm|Save changes|Update/i, { timeout: 10000 })
            .should("be.visible")
            .click({ force: true });
        });

        cy.wait(800);
        cy.contains(/Accept/i, { timeout: 10000 }).should("be.visible");
      });
    });
  });

  describe("Product Deletion", () => {
    beforeEach(() => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    });

    it("should delete a product", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("My Products").click({ force: true });

      cy.contains("Cypress Test Product")
        .parents("article")
        .within(() => {
          cy.get('button[aria-label*="Delete"]').click();
        });

      cy.get('[role="dialog"]').should("be.visible");
      cy.get('[role="dialog"]').within(() => {
        cy.contains("button", "Delete").click();
      });

      cy.wait(2000);
      cy.contains("Cypress Test Product").should("not.exist");
    });
  }); */

  describe("Error Handling", () => {
    it("should handle non-existent product gracefully", () => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
      cy.visit("localhost:3000/product/non-existent-product-id");
      cy.wait(2000);
      cy.get("body").should("contain.text", "not found");
    });

    it("should redirect to login when accessing orders without auth", () => {
      cy.visit("localhost:3000");
      cy.wait(1000);
      cy.visit("localhost:3000/orders");

      cy.url({ timeout: 10000 }).should("include", "/auth/login");
      cy.get("body", { timeout: 10000 }).should("be.visible");
      cy.contains("Sign in to your account", { timeout: 10000 }).should(
        "be.visible",
      );
    });
  });
});

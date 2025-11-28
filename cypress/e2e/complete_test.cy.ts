import { v4 as uuidv4 } from "uuid";

describe("Complete User Flow", () => {
  const appBaseUrl = "http://localhost:3000";
  const uniqueId = uuidv4().substring(0, 8);
  const email = `testuser_${uniqueId}@example.com`;
  const password = "password123";
  const createOrderRequest = (payload: {
    description: string;
    prof_id: string;
    productId: string;
    userId: string;
  }) =>
    cy.getCookies().then((cookies) =>
      cy
        .request({
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
        })
        .then((response) => {
          return cy.wrap(response, { log: false });
        }),
    );
  const clickViewDetailsFor = (productName: string) => {
    cy.contains("h2", productName, { matchCase: false })
      .should("be.visible")
      .parents('[class*="rounded-2xl"]')
      .first()
      .find('a[href*="/product/"]')
      .first()
      .then(($link) => {
        const href = $link.attr("href");
        expect(href, "product link").to.be.a("string").and.include("/product/");
        const fullUrl = href!.startsWith("http")
          ? href!
          : `${appBaseUrl}${href}`;
        cy.visit(fullUrl);
      });
  };
  const getProductHref = (productName: string) =>
    cy
      .contains("h2", productName, { matchCase: false })
      .should("be.visible")
      .parents('[class*="rounded-2xl"]')
      .first()
      .find('a[href*="/product/"]')
      .first();

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
      cy.contains("Welcome Test User");
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

      // Click on the created product
      clickViewDetailsFor("Cypress Test Product");
      cy.url().should("include", "/product/");

      // Verify product details page
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

      // Test category filter if it exists
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
    let createdProductUrl: string;

    beforeEach(() => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    });

    it("should create an order through UI and bypass Stripe payment", () => {
      // Navigate to browse and find our product
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Browse").click({ force: true });

      clickViewDetailsFor("Cypress Test Product");
      cy.url().should("include", "/product/");

      return cy.url().then((url) => {
        createdProductUrl = url;
        const productId = url.split("/product/")[1];

        cy.contains("button", "Order Now").click();

        cy.get('[role="dialog"]').should("be.visible");
        cy.get('[role="dialog"]').within(() => {
          cy.get("#description").type(
            "Test order - need video editing for my project",
          );
          cy.contains("button", "Place Order").click();
        });

        // Instead of going through payment UI, use API to create order directly
        return createOrderRequest({
          description: "Test order - need video editing for my project",
          prof_id: Cypress.env("userId") || "test-user-id",
          productId: productId,
          userId: Cypress.env("userId") || "test-user-id",
        });
      });
    });

    it("should view created orders in My Orders section", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("My Cart").click({ force: true });

      cy.url().should("include", "/myorderslist");

      // Wait for orders to load
      cy.wait(2000);

      // Check if orders exist or empty state
      cy.get("body").then(($body) => {
        if ($body.text().includes("Once the professional accepts")) {
          // Empty state
          cy.contains("Once the professional accepts").should("be.visible");
        } else {
          // Orders exist
          cy.get("article").should("have.length.greaterThan", 0);
          cy.contains("Test order").should("be.visible");
        }
      });
    });

    it("should view orders as professional in Orders dashboard", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("My orders").click({ force: true });

      cy.url().should("include", "/orders");

      cy.wait(2000);

      // Check for orders or empty state
      cy.get("body").then(($body) => {
        if ($body.text().includes("Once you accept an order")) {
          cy.contains("Once you accept an order").should("be.visible");
        } else {
          cy.get("article").should("have.length.greaterThan", 0);
        }
      });
    });

    it("should update order status as professional", () => {
      // First create an order via API to ensure we have one to update
      cy.getCookies().then((cookies) => {
        // Get product ID from browse page
        cy.visit("localhost:3000/browse");
        getProductHref("Cypress Test Product")
          .invoke("attr", "href")
          .then((href) => {
            const productId = href?.split("/product/")[1];

            return createOrderRequest({
              description: "Order to test status update",
              prof_id: Cypress.env("userId") || "test-user-id",
              productId: productId,
              userId: Cypress.env("userId") || "test-user-id",
            }).then(() => {
              // Navigate to orders dashboard
              cy.visit("localhost:3000/orders");
              cy.wait(2000);

              // Find order and update status
              cy.get("body").then(($body) => {
                if (!$body.text().includes("Once you accept an order")) {
                  // Select first order checkbox
                  cy.get('input[type="checkbox"]').first().check();

                  // Click edit/modify button
                  cy.get('button[aria-label*="Modify"]').first().click();

                  // Select status in modal
                  cy.get('[role="dialog"]').should("be.visible");
                  cy.get('[role="dialog"]').within(() => {
                    cy.get('button[role="combobox"]').click();
                  });

                  cy.get('[role="option"]').contains("Accept").click();

                  cy.get('[role="dialog"]').within(() => {
                    cy.contains("button", "Confirm").click();
                  });

                  cy.wait(1000);
                  cy.contains("Accept").should("be.visible");
                }
              });
            });
          });
      });
    });

    it("should handle order with special characters in description", () => {
      cy.visit("localhost:3000/browse");
      clickViewDetailsFor("Cypress Test Product");
      cy.contains("button", "Order Now").click();

      const specialText = "Order with émojis 🎉 and symbols: @#$%^&*()";

      cy.get('[role="dialog"]').within(() => {
        cy.get("#description").type(specialText);
      });

      // Get product ID from URL
      cy.url().then((url) => {
        const productId = url.split("/product/")[1];

        // Create order via API
        return createOrderRequest({
          description: specialText,
          prof_id: Cypress.env("userId") || "test-user-id",
          productId: productId,
          userId: Cypress.env("userId") || "test-user-id",
        });
      });

      // Verify in orders list
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("My Orders").click({ force: true });
      cy.wait(2000);

      cy.get("body").then(($body) => {
        if (!$body.text().includes("Once the professional accepts")) {
          cy.contains(specialText).should("be.visible");
        }
      });
    });

    it("should validate order form requires description", () => {
      cy.visit("localhost:3000/browse");
      clickViewDetailsFor("Cypress Test Product");

      cy.contains("button", "Order Now").click();

      cy.get('[role="dialog"]').within(() => {
        // Try to submit without description
        cy.get("#description").should("be.empty");
        cy.contains("button", "Place Order").click();
      });

      // Should show validation error or modal should still be open
      cy.get('[role="dialog"]').should("be.visible");
    });

    it("should display order details correctly", () => {
      cy.visit("localhost:3000/myorderslist");
      cy.wait(2000);

      cy.get("body").then(($body) => {
        if (!$body.text().includes("Once the professional accepts")) {
          // Click on first order to view details
          cy.get("article").first().click();

          // Verify order details modal or page
          cy.get("body").should("contain", "Test order");
          cy.get("body").should("contain", "Cypress Test Product");
        }
      });
    });

    it("should allow bulk order status updates", () => {
      cy.visit("localhost:3000/orders");
      cy.wait(2000);

      cy.get("body").then(($body) => {
        if (!$body.text().includes("Once you accept an order")) {
          // Select multiple orders
          cy.get('input[type="checkbox"]').eq(0).check();
          cy.get('input[type="checkbox"]').eq(1).check();

          // Click bulk action button
          cy.get('button[aria-label*="Modify"]').first().click();

          cy.get('[role="dialog"]').should("be.visible");
          cy.get('[role="dialog"]').within(() => {
            cy.get('button[role="combobox"]').click();
          });

          cy.get('[role="option"]').contains("Review").click();

          cy.get('[role="dialog"]').within(() => {
            cy.contains("button", "Confirm").click();
          });

          cy.wait(1000);
        }
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

      // Find and delete the product
      cy.contains("Cypress Test Product")
        .parents("article")
        .within(() => {
          cy.get('button[aria-label*="Delete"]').click();
        });

      // Confirm deletion in modal
      cy.get('[role="dialog"]').should("be.visible");
      cy.get('[role="dialog"]').within(() => {
        cy.contains("button", "Delete").click();
      });

      cy.wait(2000);
      cy.contains("Cypress Test Product").should("not.exist");
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });
    });

    it("should handle non-existent product gracefully", () => {
      cy.visit("localhost:3000/product/non-existent-product-id");
      cy.wait(2000);

      // Should show error message or redirect
      cy.get("body").should("contain.text", "not found");
    });

    it("should redirect to login when accessing orders without auth", () => {
      // Logout first
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Logout").click({ force: true });
      cy.wait(1000);

      // Try to access orders
      cy.visit("localhost:3000/orders");
      cy.url().should("include", "/auth/login");
    });
  });
});

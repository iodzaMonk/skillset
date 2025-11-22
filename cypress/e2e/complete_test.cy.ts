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

  describe("Stripe Payment Flow", () => {
    beforeEach(() => {
      cy.visit("localhost:3000");
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Login").should("be.visible");
      cy.contains("Login").click({ force: true });
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.contains("button", "Sign in").click();
      cy.url().should("eq", "http://localhost:3000/", { timeout: 10000 });

      cy.intercept("POST", "/api/user/create-stripe-account", {
        statusCode: 200,
        body: {
          url: "http://localhost:3000/settings?stripe_connected=true",
          accountId: "acct_mock_123456",
        },
      }).as("createStripeAccount");

      cy.intercept("GET", "/api/user/me", (req) => {
        req.reply({
          statusCode: 200,
          body: {
            user: {
              id: "user-test-id",
              email: email,
              name: "Test User",
              country: "AU",
              birthday: null,
              vendor_id: "acct_mock_123456",
            },
          },
        });
      }).as("getUserMe");

      cy.intercept("POST", "/api/orders/create-payment", {
        statusCode: 200,
        body: {
          clientSecret: "pi_mock_secret_123",
          professionalName: "Mock Professional",
        },
      }).as("createPaymentIntent");

      cy.intercept("GET", "**/stripe.com/**", {
        statusCode: 200,
        body: {},
      }).as("stripeAssets");
    });

    it("should connect a Stripe account and verify vendor_id", () => {
      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("Settings").click({ force: true });
      cy.url().should("include", "/settings", { timeout: 10000 });

      cy.wait(2000);
      cy.scrollTo("bottom");

      cy.contains("Connect to Stripe", { timeout: 10000 }).should("exist");
      cy.contains("button", "Connect to Stripe").scrollIntoView();
      cy.contains("button", "Connect to Stripe").should("be.visible");
      cy.contains("button", "Connect to Stripe").click();

      cy.wait("@createStripeAccount").then((interception) => {
        expect(interception.request.body).to.have.property("email");
        expect(interception.request.body.email).to.equal(email);
        expect(interception.request.body).to.have.property("refreshUrl");
        expect(interception.request.body).to.have.property("returnUrl");

        expect(interception.response.body).to.have.property("url");
        expect(interception.response.body.accountId).to.equal(
          "acct_mock_123456",
        );
      });

      cy.url().should("include", "/settings");

      cy.contains("button", "Connect to Stripe").should("not.exist");

      cy.get('[data-testid="menu-toggle"]').click();
      cy.contains("My Products").click({ force: true });
      cy.contains("Create a vendor account before creating products").should(
        "not.exist",
      );
    });

    it("should prevent product creation without vendor_id", () => {
      cy.intercept("GET", "/api/user/me", {
        statusCode: 200,
        body: {
          user: {
            id: "user-test-id",
            email: email,
            name: "Test User",
            country: "AU",
            birthday: null,
            vendor_id: null,
          },
        },
      }).as("getUserNoVendor");

      cy.visit("localhost:3000/myproduct");
      cy.wait("@getUserNoVendor");

      cy.contains("Create a vendor account before creating products").should(
        "be.visible",
      );
      cy.contains("button", "Create a vendor account").should("be.visible");
    });

    it("should allow product creation with vendor_id", () => {
      cy.intercept("GET", "/api/user/me", {
        statusCode: 200,
        body: {
          user: {
            id: "user-test-id",
            email: email,
            name: "Test User",
            country: "AU",
            birthday: null,
            vendor_id: "acct_mock_123456",
          },
        },
      }).as("getUserWithVendor");

      cy.intercept("POST", "/api/product/user", {
        statusCode: 201,
        body: {
          data: {
            id: "product-123",
            title: "Test Product",
            description: "Test Description",
            price: 99.99,
            user_id: "user-test-id",
            category: "Editing",
          },
        },
      }).as("createProduct");

      cy.visit("localhost:3000/myproduct");
      cy.wait("@getUserWithVendor");

      cy.contains("button", "Create Product").should("be.visible");
      cy.contains("Create a vendor account before creating products").should(
        "not.exist",
      );

      cy.contains("button", "Create Product").click();
      cy.get('input[name="title"]').type("Test Product");
      cy.get('textarea[name="description"]').type("Test Description");
      cy.get('input[name="price"]').type("99.99");
      cy.get('select[name="category"]').select("Editing");
      cy.contains("button", "Create").click();

      cy.wait("@createProduct").then((interception) => {
        expect(interception.request.body).to.have.property(
          "title",
          "Test Product",
        );
        expect(interception.request.body).to.have.property("user_id");
      });
    });

    it("should create a payment intent for an order", () => {
      cy.visit("localhost:3000/browse");
      cy.get('a[href*="/product/"]').first().click();
      cy.url().should("include", "/product/");
      cy.contains("Order Now").click({ force: true });

      cy.get('textarea[name="description"]').type("Please edit my video");
      cy.contains("button", "Proceed to Payment").click();

      cy.url().should("include", "/payment", { timeout: 10000 });

      cy.wait("@createPaymentIntent").then((interception) => {
        expect(interception.request.body).to.have.property("amount");
        expect(interception.request.body).to.have.property("orderData");
        expect(interception.request.body.orderData).to.have.property("prof_id");
        expect(interception.request.body.orderData).to.have.property(
          "product_id",
        );

        expect(interception.response.body.clientSecret).to.equal(
          "pi_mock_secret_123",
        );
        expect(interception.response.body.professionalName).to.equal(
          "Mock Professional",
        );
      });

      cy.get("form").within(() => {
        cy.get('button[type="submit"]').should("contain", "Pay $");
      });
    });

    it("should handle payment submission with mocked Stripe", () => {
      cy.visit("localhost:3000/browse");
      cy.get('a[href*="/product/"]').first().click();
      cy.contains("Order Now").click({ force: true });
      cy.get('textarea[name="description"]').type("Test order");
      cy.contains("button", "Proceed to Payment").click();

      cy.wait("@createPaymentIntent");

      cy.window().then((win) => {
        if (win.Stripe) {
          cy.stub(win.Stripe.prototype, "confirmPayment").resolves({
            paymentIntent: {
              id: "pi_mock_123",
              status: "succeeded",
            },
          });
        }
      });

      cy.intercept("POST", "/api/orders/payment-complete", {
        statusCode: 201,
        body: {
          orderId: "order_mock_123",
          message: "Order created successfully",
        },
      }).as("completeOrder");

      cy.get('button[type="submit"]').contains("Pay $").click();

      cy.wait("@completeOrder").then((interception) => {
        expect(interception.request.body).to.have.property("paymentIntentId");
        expect(interception.response.body.orderId).to.equal("order_mock_123");
      });

      cy.url().should("include", "/payment/success", { timeout: 10000 });
    });
  });
});

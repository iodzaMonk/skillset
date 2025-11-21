import assert from "assert";
import {
  After,
  Before,
  DataTable,
  Given,
  Then,
  When,
} from "@cucumber/cucumber";
import { productService, ProductResponse } from "../support/productService.ts";

type ProductWorld = {
  response: ProductResponse | null;
};

Before(function (this: ProductWorld) {
  this.response = null;
});

After(async function () {
  await productService.cleanup();
});

Given("the product catalogue includes:", async function (table: DataTable) {
  await productService.seed(table.hashes());
});

Given(
  "the product has the following reviews:",
  async function (table: DataTable) {
    await productService.seedReviews(table.hashes());
  },
);

When(
  "I request the product details for {string}",
  async function (this: ProductWorld, title: string) {
    this.response = await productService.fetchByTitle(title);
  },
);

When(
  "I request the product details for slug {string}",
  async function (this: ProductWorld, slug: string) {
    this.response = await productService.fetchBySlug(slug);
  },
);

Then(
  "the product response status should be {int}",
  function (this: ProductWorld, status: number) {
    assert.ok(this.response, "No product response captured");
    assert.strictEqual(this.response.status, status);
  },
);

Then(
  "the product payload should include title {string}",
  function (this: ProductWorld, title: string) {
    const payload = getPayload(this);
    assert.strictEqual(payload.title, title);
  },
);

Then(
  "the product payload should include category {string}",
  function (this: ProductWorld, category: string) {
    const payload = getPayload(this);
    assert.strictEqual(payload.category, category);
  },
);

Then(
  "the product payload should include price {int}",
  function (this: ProductWorld, price: number) {
    const payload = getPayload(this);
    assert.strictEqual(payload.price, price);
  },
);

Then(
  "the product payload should include the placeholder image",
  function (this: ProductWorld) {
    const payload = getPayload(this);
    assert.strictEqual(payload.image_url, "/no-image.svg");
  },
);

Then(
  "the product payload should include seller:",
  function (this: ProductWorld, table: DataTable) {
    const payload = getPayload(this);
    const seller = payload.users as
      | { name?: string; country?: string; email?: string }
      | undefined;
    assert.ok(seller, "Expected seller information on payload");
    const rows = table.hashes() as Array<Record<string, string>>;
    if (rows.length === 0) {
      throw new Error("Expected seller expectations table to have one row");
    }
    const row = rows[0];
    const expectedName = (row as Record<string, string>)["name"];
    const expectedCountry = (row as Record<string, string>)["country"];
    const expectedEmail = (row as Record<string, string>)["email"];
    assert.strictEqual(seller?.name, expectedName);
    assert.strictEqual(seller?.country, expectedCountry);
    assert.strictEqual(seller?.email, expectedEmail);
  },
);

Then(
  "the product error should say {string}",
  function (this: ProductWorld, message: string) {
    const payload = getPayload(this);
    assert.strictEqual(payload.message, message);
  },
);

Then(
  "the product payload should include the following reviews:",
  function (this: ProductWorld, table: DataTable) {
    const payload = getPayload(this);
    const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
    const expectations = table.hashes();
    for (const row of expectations) {
      const reviewer = row.reviewer;
      const text = row.text;
      const match = reviews.find(
        (review: any) =>
          review?.users?.name === reviewer &&
          String(review?.text ?? "").trim() === text,
      );
      assert.ok(match, `Expected review from ${reviewer} with text "${text}"`);
    }
  },
);

Then(
  "the product review metadata should include:",
  function (this: ProductWorld, table: DataTable) {
    const payload = getPayload(this);
    const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
    const expectations = table.hashes();
    for (const row of expectations) {
      const reviewer = row.reviewer;
      const country = row.country;
      const email = row.email;
      const match = reviews.find(
        (review: any) =>
          review?.users?.name === reviewer &&
          review?.users?.country === country &&
          review?.users?.email === email,
      );
      assert.ok(
        match,
        `Expected metadata for reviewer ${reviewer} (${country}, ${email})`,
      );
    }
  },
);

Then(
  "the product payload should report rating {float}",
  function (this: ProductWorld, rating: number) {
    const payload = getPayload(this);
    const actual =
      typeof payload.rating === "number" ? (payload.rating as number) : null;
    assert.ok(actual !== null, "Expected rating to be present on payload");
    assert.ok(
      Math.abs(Number(actual) - Number(rating)) < 0.0001,
      `Expected rating ${rating} but received ${actual}`,
    );
  },
);

Then(
  "the product payload should report {int} reviews",
  function (this: ProductWorld, count: number) {
    const payload = getPayload(this);
    assert.strictEqual(payload.ratingCount, count);
  },
);

function getPayload(world: ProductWorld) {
  if (!world.response?.body) {
    throw new Error("No response payload captured");
  }
  return world.response.body;
}

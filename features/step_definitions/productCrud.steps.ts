import assert from "assert";
import {
  After,
  Before,
  DataTable,
  Given,
  Then,
  When,
} from "@cucumber/cucumber";
import { ProductCrudFixture } from "../support/productCrudFixture.ts";

type ProductCrudWorld = {
  fixture: ProductCrudFixture;
};

Before(function (this: ProductCrudWorld) {
  this.fixture = new ProductCrudFixture();
});

After(async function (this: ProductCrudWorld) {
  await this.fixture.cleanup();
});

Given(
  "I am authenticated for product management",
  async function (this: ProductCrudWorld) {
    await this.fixture.authenticate();
  },
);

Given(
  "I am not authenticated for product management",
  function (this: ProductCrudWorld) {
    this.fixture.signOut();
  },
);

Given(
  "the following products already exist for me:",
  async function (this: ProductCrudWorld, table: DataTable) {
    await this.fixture.seedMyProducts(table.hashes());
  },
);

Given(
  "another user owns the following products:",
  async function (this: ProductCrudWorld, table: DataTable) {
    await this.fixture.seedForeignProducts(table.hashes());
  },
);

When(
  "I create a product with:",
  async function (this: ProductCrudWorld, table: DataTable) {
    await this.fixture.createProduct(table.hashes()[0] ?? {});
  },
);

When(
  "I update the product titled {string} with:",
  async function (this: ProductCrudWorld, title: string, table: DataTable) {
    await this.fixture.updateProduct(title, table.hashes()[0] ?? {});
  },
);

When("I list my products", async function (this: ProductCrudWorld) {
  await this.fixture.listMyProducts();
});

When(
  "I delete the product titled {string}",
  async function (this: ProductCrudWorld, title: string) {
    await this.fixture.deleteProduct(title);
  },
);

Then(
  "the product request should have status {int}",
  function (this: ProductCrudWorld, status: number) {
    const response = this.fixture.response;
    assert.ok(response, "No product response captured");
    assert.strictEqual(response.status, status);
  },
);

Then(
  "the product response payload should include:",
  function (this: ProductCrudWorld, table: DataTable) {
    const response = this.fixture.response;
    assert.ok(response?.body?.data, "Expected product data in response");
    const expected = table.hashes()[0] ?? {};
    for (const [key, value] of Object.entries(expected)) {
      assert.strictEqual(
        String((response.body.data as Record<string, unknown>)[key]),
        value,
      );
    }
  },
);

Then(
  "the product error message should contain {string}",
  function (this: ProductCrudWorld, snippet: string) {
    const response = this.fixture.response;
    assert.ok(response?.body?.message, "Expected an error message in response");
    const message = String(response.body.message);
    assert.ok(
      message.includes(snippet),
      `Expected "${message}" to include "${snippet}"`,
    );
  },
);

Then(
  "the product list should include titles:",
  function (this: ProductCrudWorld, table: DataTable) {
    const response = this.fixture.response;
    assert.ok(response?.body?.data, "Expected data in list response");
    const titles = (response.body.data as Array<Record<string, unknown>>).map(
      (p) => String(p.title),
    );
    for (const row of table.hashes()) {
      assert.ok(
        titles.includes(row.title),
        `Expected list to include ${row.title}`,
      );
    }
  },
);

Then("the product list should be empty", function (this: ProductCrudWorld) {
  const response = this.fixture.response;
  assert.ok(response?.body?.data, "Expected data in list response");
  assert.strictEqual(
    (response.body.data as Array<unknown>).length,
    0,
    "Expected no products",
  );
});

Then(
  "the product message should be {string}",
  function (this: ProductCrudWorld, message: string) {
    const response = this.fixture.response;
    assert.ok(response?.body?.message, "Expected a message in response");
    assert.strictEqual(response.body.message, message);
  },
);

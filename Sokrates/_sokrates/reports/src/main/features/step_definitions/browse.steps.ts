import assert from "assert";
import {
  After,
  Before,
  DataTable,
  Given,
  Then,
  When,
} from "@cucumber/cucumber";
import { browseService, ProductRecord } from "../support/browseService.ts";

type BrowseWorld = {
  products: ProductRecord[] | null;
};

Before(function (this: BrowseWorld) {
  this.products = null;
});

After(async function () {
  await browseService.cleanup();
});

Given(
  "the catalogue contains the following products:",
  async function (table: DataTable) {
    await browseService.seedProducts(table.hashes());
  },
);

When("I fetch the browse catalogue", async function (this: BrowseWorld) {
  this.products = await browseService.listProducts();
});

When(
  "I filter the browse catalogue by {string}",
  async function (this: BrowseWorld, category: string) {
    this.products = await browseService.listProducts(category);
  },
);

Then(
  "I should see {int} products",
  function (this: BrowseWorld, expectedCount: number) {
    assert.ok(this.products, "No catalogue data was captured");
    assert.strictEqual(this.products.length, expectedCount);
  },
);

Then(
  "the product titles should include:",
  function (this: BrowseWorld, table: DataTable) {
    assert.ok(this.products, "No catalogue data was captured");
    const expectedTitles = table
      .hashes()
      .map((row) => row.title)
      .filter(Boolean);
    const actualTitles = this.products.map((product) => product.title);
    for (const title of expectedTitles) {
      assert.ok(
        actualTitles.includes(title),
        `Expected "${title}" to be in the catalogue`,
      );
    }
  },
);

Then(
  "every product category should be {string}",
  function (this: BrowseWorld, category: string) {
    assert.ok(this.products, "No catalogue data was captured");
    for (const product of this.products) {
      assert.strictEqual(product.category, category);
    }
  },
);

Then("I should be told there are no products", function (this: BrowseWorld) {
  assert.ok(this.products, "No catalogue data was captured");
  assert.strictEqual(this.products.length, 0);
});

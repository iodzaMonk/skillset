import assert from "assert";
import {
  After,
  Before,
  DataTable,
  Given,
  Then,
  When,
} from "@cucumber/cucumber";
import { authService } from "../support/authService.ts";

type AuthResponse = {
  status: number;
  body?: Record<string, unknown>;
};

type AuthWorld = {
  response: AuthResponse | null;
};

Before(function (this: AuthWorld) {
  this.response = null;
});

After(async function () {
  await authService.cleanup();
});

Given("the following users exist:", async function (table: DataTable) {
  await authService.seed(table.hashes());
});

When(
  "I attempt to sign in with email {string} and password {string}",
  async function (this: AuthWorld, email: string, password: string) {
    this.response = await authService.login({ email, password });
  },
);

Then(
  "the response status should be {int}",
  function (this: AuthWorld, status: number) {
    assert.ok(
      this.response,
      "Expected a response but none was captured during the scenario",
    );
    assert.strictEqual(this.response.status, status);
  },
);

Then("I should receive a session token", function (this: AuthWorld) {
  const token = this.response?.body?.token;
  assert.ok(
    typeof token === "string" && token.length > 0,
    "Expected a session token",
  );
});

Then("I should be told {string}", function (this: AuthWorld, message: string) {
  assert.ok(this.response?.body, "Expected a response body but it was missing");
  assert.strictEqual(this.response.body?.message, message);
});

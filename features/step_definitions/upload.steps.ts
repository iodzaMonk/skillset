import assert from "assert";
import { Buffer } from "buffer";
import {
  After,
  Before,
  DataTable,
  Given,
  Then,
  When,
} from "@cucumber/cucumber";
import { UploadFixture } from "../support/uploadFixture.ts";

type UploadWorld = {
  uploadFixture: UploadFixture;
};

Before(function (this: UploadWorld) {
  this.uploadFixture = new UploadFixture();
});

After(function (this: UploadWorld) {
  this.uploadFixture.resetUploads();
});

Given("I capture upload payloads", function (this: UploadWorld) {
  this.uploadFixture.captureUploads();
});

When(
  "I upload the following file:",
  async function (this: UploadWorld, table: DataTable) {
    await this.uploadFixture.uploadFile(table.hashes()[0] ?? {});
  },
);

When("I upload without a file", async function (this: UploadWorld) {
  await this.uploadFixture.uploadWithoutFile();
});

Given(
  "uploads will fail with the message {string}",
  function (this: UploadWorld, message: string) {
    this.uploadFixture.failUploadsWith(message);
  },
);

Then(
  "the upload response status should be {int}",
  function (this: UploadWorld, status: number) {
    const response = this.uploadFixture.response;
    assert.ok(response, "No upload response captured");
    assert.strictEqual(response.status, status);
  },
);

Then("the upload response should include a key", function (this: UploadWorld) {
  const response = this.uploadFixture.response;
  assert.ok(response?.body?.key, "Expected upload key in response");
  assert.ok(
    typeof response.body.key === "string" &&
      (response.body.key as string).length > 0,
    "Upload key should be a non-empty string",
  );
});

Then(
  "the upload error message should contain {string}",
  function (this: UploadWorld, snippet: string) {
    const response = this.uploadFixture.response;
    assert.ok(response?.body?.error, "Expected error message in response");
    const message = String(response.body.error);
    assert.ok(
      message.includes(snippet),
      `Expected "${message}" to include "${snippet}"`,
    );
  },
);

Then(
  "the upload key should start with {string}",
  function (this: UploadWorld, prefix: string) {
    const response = this.uploadFixture.response;
    assert.ok(response?.body?.key, "Expected upload key in response");
    const key = String(response.body.key);
    assert.ok(
      key.startsWith(prefix),
      `Expected key "${key}" to start with "${prefix}"`,
    );
  },
);

Then(
  "the captured upload payload should include:",
  function (this: UploadWorld, table: DataTable) {
    const payload = this.uploadFixture.getCapturedPayload();
    assert.ok(payload, "No upload payload was captured");
    const expected = table.hashes()[0] ?? {};
    for (const [key, value] of Object.entries(expected)) {
      if (key === "content") {
        const bufferValue = payload.buffer;
        const actualContent: string =
          typeof bufferValue === "string"
            ? bufferValue
            : Buffer.from(bufferValue as Uint8Array).toString();
        assert.strictEqual(actualContent, value);
      } else if (key === "contentType") {
        assert.strictEqual(payload.contentType ?? "", value);
      } else if (key === "originalName") {
        assert.strictEqual(payload.originalName ?? "", value);
      } else {
        assert.strictEqual(
          String((payload as Record<string, unknown>)[key] ?? ""),
          value,
        );
      }
    }
  },
);

Then(
  "the captured upload payload size should be {int} bytes",
  function (this: UploadWorld, size: number) {
    const payload = this.uploadFixture.getCapturedPayload();
    assert.ok(payload, "No upload payload was captured");
    const bufferValue = payload.buffer;
    const actualSize =
      typeof bufferValue === "string"
        ? Buffer.byteLength(bufferValue)
        : Buffer.byteLength(Buffer.from(bufferValue as Uint8Array));
    assert.strictEqual(actualSize, size);
  },
);

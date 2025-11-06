const mockAccountLinksCreate = jest.fn();
const StripeConstructor = jest.fn().mockImplementation(() => ({
  accountLinks: {
    create: mockAccountLinksCreate,
  },
}));

jest.mock("stripe", () => ({
  __esModule: true,
  default: StripeConstructor,
}));

describe("app/api/user/connect-stripe-account/route", () => {
  let POST: typeof import("@/app/api/user/connect-stripe-account/route").POST;
  const originalEnv = process.env.STRIPE_SECRET_KEY;

  beforeAll(async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_key";
    ({ POST } = await import("@/app/api/user/connect-stripe-account/route"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAccountLinksCreate.mockResolvedValue({
      url: "https://stripe-link",
    });
  });

  afterAll(() => {
    process.env.STRIPE_SECRET_KEY = originalEnv;
  });

  const buildRequest = (body: unknown) =>
    new Request("http://localhost/api/user/connect-stripe-account", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });

  it("returns stripe link on success", async () => {
    const response = await POST(
      buildRequest({
        accountId: "acct_123",
        refreshUrl: "https://refresh",
        returnUrl: "https://return",
      }),
    );

    expect(mockAccountLinksCreate).toHaveBeenCalledWith({
      account: "acct_123",
      refresh_url: "https://refresh",
      return_url: "https://return",
      type: "account_onboarding",
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: "https://stripe-link",
    });
  });

  it("returns 500 when stripe fails", async () => {
    mockAccountLinksCreate.mockRejectedValueOnce(new Error("stripe down"));

    const response = await POST(
      buildRequest({
        accountId: "acct_123",
        refreshUrl: "https://refresh",
        returnUrl: "https://return",
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "stripe down",
    });
  });
});

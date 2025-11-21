const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  headers: mockHeaders,
}));

const mockGetCurrentUser = jest.fn();
jest.mock("@/app/lib/user", () => ({
  getCurrentUser: mockGetCurrentUser,
}));

const mockUsersUpdate = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    users: {
      update: mockUsersUpdate,
    },
  },
}));

const mockAccountsCreate = jest.fn();
const mockAccountLinksCreate = jest.fn();
const StripeConstructor = jest.fn().mockImplementation(() => ({
  accounts: {
    create: mockAccountsCreate,
  },
  accountLinks: {
    create: mockAccountLinksCreate,
  },
}));

jest.mock("stripe", () => ({
  __esModule: true,
  default: StripeConstructor,
}));

describe("app/api/user/create-stripe-account/route", () => {
  let POST: typeof import("@/app/api/user/create-stripe-account/route").POST;
  let consoleErrorSpy: jest.SpyInstance;
  const originalEnv = process.env.STRIPE_SECRET_KEY;

  beforeAll(async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_key";
    ({ POST } = await import("@/app/api/user/create-stripe-account/route"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockHeaders.mockReturnValue(
      new Headers({ referer: "https://example.com" }),
    );
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" });
    mockAccountsCreate.mockResolvedValue({ id: "acct_123" });
    mockAccountLinksCreate.mockResolvedValue({ url: "https://stripe-link" });
    mockUsersUpdate.mockResolvedValue(undefined);
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    process.env.STRIPE_SECRET_KEY = originalEnv;
  });

  const buildRequest = (body: unknown) =>
    new Request("http://localhost/api/user/create-stripe-account", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });

  it("returns 401 when user not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValueOnce(null);

    const response = await POST(
      buildRequest({
        email: "user@test.com",
        refreshUrl: "https://refresh",
        returnUrl: "https://return",
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: "Not authenticated",
    });
    expect(mockAccountsCreate).not.toHaveBeenCalled();
  });

  it("creates stripe account, link, updates user, and returns url", async () => {
    const response = await POST(
      buildRequest({
        email: "user@test.com",
        refreshUrl: "https://refresh",
        returnUrl: "https://return",
      }),
    );

    expect(mockAccountsCreate).toHaveBeenCalledWith({
      type: "express",
      country: "CA",
      email: "user@test.com",
      business_profile: {
        url: "https://skillset-orcin.vercel.app",
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    expect(mockAccountLinksCreate).toHaveBeenCalledWith({
      account: "acct_123",
      refresh_url: "https://refresh",
      return_url: "https://return",
      type: "account_onboarding",
    });
    expect(mockUsersUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { vendor_id: "acct_123" },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("x-referer")).toBe("https://example.com");
    await expect(response.json()).resolves.toEqual({
      url: "https://stripe-link",
      accountId: "acct_123",
    });
  });

  it("returns 500 when Stripe call fails", async () => {
    mockAccountsCreate.mockRejectedValueOnce(new Error("stripe down"));

    const response = await POST(
      buildRequest({
        email: "user@test.com",
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

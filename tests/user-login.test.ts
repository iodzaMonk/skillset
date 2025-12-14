/// <reference types="jest" />

const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  headers: mockHeaders,
}));

const mockCompare = jest.fn();
jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: { compare: mockCompare },
  compare: mockCompare,
}));

const mockCreateSession = jest.fn();
jest.mock("@/app/lib/session", () => ({
  createSession: mockCreateSession,
}));

// Mock the auth login logic to avoid DB calls from the implementation
const mockLoginUser = jest.fn();
jest.mock("@/app/lib/auth/login", () => ({
  loginUser: mockLoginUser,
}));

const mockFindUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    users: {
      findUnique: mockFindUnique,
    },
  },
}));

describe("app/api/user/login/route", () => {
  let POST: typeof import("@/app/api/user/login/route").POST;
  let consoleLogSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ POST } = await import("@/app/api/user/login/route"));
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockHeaders.mockReturnValue(
      new Headers({ referer: "https://example.com" }),
    );
    mockCreateSession.mockResolvedValue("session-token");
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  const buildRequest = (body: unknown) =>
    new Request("http://localhost/api/user/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });

  it("returns 400 when required fields missing", async () => {
    mockLoginUser.mockResolvedValue({
      status: 400,
      body: { message: "Missing required fields: password" },
    });

    const response = await POST(buildRequest({ email: "user@test.com" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Missing required fields: password",
    });
  });

  it("returns 401 when user not found", async () => {
    mockLoginUser.mockResolvedValue({
      status: 401,
      body: { message: "Invalid credentials" },
    });

    const response = await POST(
      buildRequest({ email: "user@test.com", password: "secret" }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: "Invalid credentials",
    });
  });

  it("returns 401 when password does not match", async () => {
    mockLoginUser.mockResolvedValue({
      status: 401,
      body: { message: "Invalid credentials" },
    });

    const response = await POST(
      buildRequest({ email: "user@test.com", password: "wrong" }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: "Invalid credentials",
    });
    expect(mockCreateSession).not.toHaveBeenCalled();
  });

  it("returns session token on success", async () => {
    mockLoginUser.mockResolvedValue({
      status: 200,
      body: { userId: "user-1" },
    });

    const response = await POST(
      buildRequest({ email: "user@test.com", password: "secret" }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-referer")).toBe("https://example.com");
    await expect(response.json()).resolves.toEqual({ token: "session-token" });
    expect(mockCreateSession).toHaveBeenCalledWith("user-1");
  });

  it("returns 500 on unexpected error", async () => {
    mockLoginUser.mockRejectedValue(new Error("db down"));

    const response = await POST(
      buildRequest({ email: "user@test.com", password: "secret" }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: "Internal server error",
    });
  });

  it("handles null referer header on success", async () => {
    mockHeaders.mockReturnValue(new Headers({})); // No referer
    mockLoginUser.mockResolvedValue({
      status: 200,
      body: { userId: "user-1" },
    });

    const response = await POST(
      buildRequest({ email: "user@test.com", password: "secret" }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-referer")).toBe("");
  });

  it("handles null referer header on error", async () => {
    mockHeaders.mockReturnValue(new Headers({})); // No referer
    mockLoginUser.mockRejectedValue(new Error("db down"));

    const response = await POST(
      buildRequest({ email: "user@test.com", password: "secret" }),
    );

    expect(response.status).toBe(500);
    expect(response.headers.get("x-referer")).toBe("");
  });
});

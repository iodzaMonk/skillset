export {};
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
    const response = await POST(buildRequest({ email: "user@test.com" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Missing required fields: password",
    });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("returns 401 when user not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await POST(
      buildRequest({ email: "user@test.com", password: "secret" }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: "Invalid credentials",
    });
  });

  it("returns 401 when password does not match", async () => {
    mockFindUnique.mockResolvedValue({
      id: "user-1",
      password: "hashed",
    });
    mockCompare.mockResolvedValue(false);

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
    mockFindUnique.mockResolvedValue({
      id: "user-1",
      password: "hashed",
    });
    mockCompare.mockResolvedValue(true);

    const response = await POST(
      buildRequest({ email: "user@test.com", password: "secret" }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-referer")).toBe("https://example.com");
    await expect(response.json()).resolves.toEqual({ token: "session-token" });
    expect(mockCreateSession).toHaveBeenCalledWith("user-1");
  });

  it("returns 500 on unexpected error", async () => {
    mockFindUnique.mockRejectedValue(new Error("db down"));

    const response = await POST(
      buildRequest({ email: "user@test.com", password: "secret" }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: "Internal server error",
    });
  });
});

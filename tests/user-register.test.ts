export {};
const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  headers: mockHeaders,
}));

const mockHash = jest.fn();
jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: { hash: mockHash },
  hash: mockHash,
}));

const mockCreateSession = jest.fn();
jest.mock("@/app/lib/session", () => ({
  createSession: mockCreateSession,
}));

const mockUsersCreate = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    users: {
      create: mockUsersCreate,
    },
  },
}));

describe("app/api/user/register/route", () => {
  let POST: typeof import("@/app/api/user/register/route").POST;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ POST } = await import("@/app/api/user/register/route"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockHeaders.mockReturnValue(
      new Headers({ referer: "https://example.com" }),
    );
    mockHash.mockResolvedValue("hashed-password");
    mockUsersCreate.mockResolvedValue({ id: "user-1", email: "user@test.com" });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  const buildRequest = (body: unknown) =>
    new Request("http://localhost/api/user/register", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });

  it("returns 400 when required fields are missing", async () => {
    const response = await POST(
      buildRequest({ email: "user@test.com", password: "" }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: expect.stringContaining("Missing required fields"),
    });
    expect(mockUsersCreate).not.toHaveBeenCalled();
  });

  it("returns 400 when birthday is invalid", async () => {
    const response = await POST(
      buildRequest({
        email: "user@test.com",
        password: "secret",
        name: "User",
        country: "US",
        birthday: "not-a-date",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Invalid birthday format",
    });
  });

  it("creates user, session, and returns 200 on success", async () => {
    const response = await POST(
      buildRequest({
        email: "user@test.com",
        password: "secret",
        name: "User",
        country: "US",
        birthday: "2000-01-01T00:00:00.000Z",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-referer")).toBe("https://example.com");
    await expect(response.json()).resolves.toEqual({
      id: "user-1",
      email: "user@test.com",
    });
    expect(mockHash).toHaveBeenCalledWith("secret", 10);
    expect(mockUsersCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "user@test.com",
        password: "hashed-password",
        country: "US",
        name: "User",
      }),
      select: { id: true, email: true },
    });
    expect(mockCreateSession).toHaveBeenCalledWith("user-1");
  });

  it("returns 409 when email already exists", async () => {
    const error = new Error("unique violation");
    Object.assign(error, { code: "P2002" });
    Object.setPrototypeOf(
      error,
      (await import("@prisma/client")).Prisma.PrismaClientKnownRequestError
        .prototype,
    );
    mockUsersCreate.mockRejectedValue(error);

    const response = await POST(
      buildRequest({
        email: "user@test.com",
        password: "secret",
        name: "User",
        country: "US",
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      message: "Email already registered",
    });
  });

  it("returns 500 on unexpected errors", async () => {
    mockUsersCreate.mockRejectedValueOnce(new Error("db down"));

    const response = await POST(
      buildRequest({
        email: "user@test.com",
        password: "secret",
        name: "User",
        country: "US",
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: "Internal server error",
    });
  });
});

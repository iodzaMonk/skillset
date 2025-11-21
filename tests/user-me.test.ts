const mockGetCurrentUser = jest.fn();
jest.mock("@/app/lib/user", () => ({
  getCurrentUser: mockGetCurrentUser,
}));

describe("app/api/user/me/route", () => {
  let GET: typeof import("@/app/api/user/me/route").GET;

  beforeAll(async () => {
    ({ GET } = await import("@/app/api/user/me/route"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null user when not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValueOnce(null);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ user: null });
  });

  it("returns user object when authenticated", async () => {
    const user = {
      id: "user-1",
      email: "user@example.com",
      name: "User",
      country: "US",
      birthday: "2000-01-01T00:00:00.000Z",
      vendor_id: null,
    };
    mockGetCurrentUser.mockResolvedValueOnce(user);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ user });
  });
});

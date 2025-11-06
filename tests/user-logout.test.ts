const mockDeleteSession = jest.fn();
jest.mock("@/app/lib/session", () => ({
  deleteSession: mockDeleteSession,
}));

describe("app/api/user/logout/route", () => {
  let POST: typeof import("@/app/api/user/logout/route").POST;
  let consoleLogSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ POST } = await import("@/app/api/user/logout/route"));
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteSession.mockResolvedValue(undefined);
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it("deletes session and returns success", async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Success");
    expect(mockDeleteSession).toHaveBeenCalled();
  });

  it("returns 500 when session deletion fails", async () => {
    mockDeleteSession.mockRejectedValueOnce(new Error("fail"));

    const response = await POST();

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Error");
  });
});

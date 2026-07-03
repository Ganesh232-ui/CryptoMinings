const { checkDeposit } = require("../src/balance");

describe("checkDeposit", () => {
  it("fetches the balance for the given wallet", async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ balance: 1.5 }),
    });

    await checkDeposit("0xABC123", fetchFn, "http://localhost:3000");

    expect(fetchFn).toHaveBeenCalledWith(
      "http://localhost:3000/balance/0xABC123"
    );
  });

  it("returns the balance value from the API response", async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ balance: 0.042 }),
    });

    const balance = await checkDeposit(
      "0xABC123",
      fetchFn,
      "http://localhost:3000"
    );

    expect(balance).toBe(0.042);
  });

  it("handles zero balance", async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ balance: 0 }),
    });

    const balance = await checkDeposit(
      "0xABC123",
      fetchFn,
      "http://localhost:3000"
    );

    expect(balance).toBe(0);
  });

  it("throws when wallet address is empty", async () => {
    const fetchFn = jest.fn();

    await expect(
      checkDeposit("", fetchFn, "http://localhost:3000")
    ).rejects.toThrow("Wallet address is required");

    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("throws when wallet address is undefined", async () => {
    const fetchFn = jest.fn();

    await expect(
      checkDeposit(undefined, fetchFn, "http://localhost:3000")
    ).rejects.toThrow("Wallet address is required");
  });

  it("propagates fetch errors", async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error("Connection refused"));

    await expect(
      checkDeposit("0xABC123", fetchFn, "http://localhost:3000")
    ).rejects.toThrow("Connection refused");
  });

  it("propagates JSON parsing errors", async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      json: jest.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
    });

    await expect(
      checkDeposit("0xABC123", fetchFn, "http://localhost:3000")
    ).rejects.toThrow("Unexpected token");
  });

  it("uses the provided API base URL", async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ balance: 1.0 }),
    });

    await checkDeposit("0xWALLET", fetchFn, "https://api.example.com");

    expect(fetchFn).toHaveBeenCalledWith(
      "https://api.example.com/balance/0xWALLET"
    );
  });
});

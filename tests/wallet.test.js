const { connectWallet } = require("../src/wallet");

describe("connectWallet", () => {
  it("requests accounts from the ethereum provider", async () => {
    const ethereum = {
      request: jest.fn().mockResolvedValue(["0xABC123"]),
    };
    const fetchFn = jest.fn().mockResolvedValue({ ok: true });

    await connectWallet(ethereum, fetchFn, "http://localhost:3000");

    expect(ethereum.request).toHaveBeenCalledWith({
      method: "eth_requestAccounts",
    });
  });

  it("returns the first account address", async () => {
    const ethereum = {
      request: jest.fn().mockResolvedValue(["0xABC123", "0xDEF456"]),
    };
    const fetchFn = jest.fn().mockResolvedValue({ ok: true });

    const wallet = await connectWallet(
      ethereum,
      fetchFn,
      "http://localhost:3000"
    );

    expect(wallet).toBe("0xABC123");
  });

  it("registers the wallet via the API", async () => {
    const ethereum = {
      request: jest.fn().mockResolvedValue(["0xABC123"]),
    };
    const fetchFn = jest.fn().mockResolvedValue({ ok: true });

    await connectWallet(ethereum, fetchFn, "http://localhost:3000");

    expect(fetchFn).toHaveBeenCalledWith("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: "0xABC123" }),
    });
  });

  it("throws when no wallet account is returned", async () => {
    const ethereum = {
      request: jest.fn().mockResolvedValue([]),
    };
    const fetchFn = jest.fn();

    await expect(
      connectWallet(ethereum, fetchFn, "http://localhost:3000")
    ).rejects.toThrow("No wallet account returned");

    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("propagates ethereum provider errors", async () => {
    const ethereum = {
      request: jest.fn().mockRejectedValue(new Error("User rejected")),
    };
    const fetchFn = jest.fn();

    await expect(
      connectWallet(ethereum, fetchFn, "http://localhost:3000")
    ).rejects.toThrow("User rejected");
  });

  it("propagates fetch errors during registration", async () => {
    const ethereum = {
      request: jest.fn().mockResolvedValue(["0xABC123"]),
    };
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error("Network error"));

    await expect(
      connectWallet(ethereum, fetchFn, "http://localhost:3000")
    ).rejects.toThrow("Network error");
  });

  it("uses the provided API base URL", async () => {
    const ethereum = {
      request: jest.fn().mockResolvedValue(["0xWALLET"]),
    };
    const fetchFn = jest.fn().mockResolvedValue({ ok: true });

    await connectWallet(ethereum, fetchFn, "https://api.example.com");

    expect(fetchFn).toHaveBeenCalledWith(
      "https://api.example.com/register",
      expect.any(Object)
    );
  });
});

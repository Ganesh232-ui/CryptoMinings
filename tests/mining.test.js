const { createMiningSession, formatBTC } = require("../src/mining");

describe("createMiningSession", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with zero earnings", () => {
    const session = createMiningSession();
    expect(session.getEarnings()).toBe(0);
  });

  it("is not running initially", () => {
    const session = createMiningSession();
    expect(session.isRunning()).toBe(false);
  });

  it("starts mining and reports running", () => {
    const session = createMiningSession();
    session.start(null, 1000);
    expect(session.isRunning()).toBe(true);
    session.stop();
  });

  it("accumulates earnings over intervals", () => {
    const session = createMiningSession();
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    session.start(null, 1000);

    jest.advanceTimersByTime(1000);
    expect(session.getEarnings()).toBeCloseTo(0.000005, 10);

    jest.advanceTimersByTime(1000);
    expect(session.getEarnings()).toBeCloseTo(0.00001, 10);

    session.stop();
    Math.random.mockRestore();
  });

  it("calls onUpdate callback with cumulative earnings", () => {
    const session = createMiningSession();
    const onUpdate = jest.fn();
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    session.start(onUpdate, 1000);

    jest.advanceTimersByTime(1000);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(expect.closeTo(0.000005, 10));

    jest.advanceTimersByTime(1000);
    expect(onUpdate).toHaveBeenCalledTimes(2);
    expect(onUpdate).toHaveBeenCalledWith(expect.closeTo(0.00001, 10));

    session.stop();
    Math.random.mockRestore();
  });

  it("stops mining and clears interval", () => {
    const session = createMiningSession();
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    session.start(null, 1000);
    jest.advanceTimersByTime(1000);
    const earningsAtStop = session.getEarnings();

    session.stop();
    expect(session.isRunning()).toBe(false);

    jest.advanceTimersByTime(5000);
    expect(session.getEarnings()).toBe(earningsAtStop);

    Math.random.mockRestore();
  });

  it("throws if mining is started while already running", () => {
    const session = createMiningSession();
    session.start(null, 1000);

    expect(() => session.start(null, 1000)).toThrow(
      "Mining session already running"
    );

    session.stop();
  });

  it("can be restarted after stopping", () => {
    const session = createMiningSession();
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    session.start(null, 1000);
    jest.advanceTimersByTime(1000);
    session.stop();

    const earningsBeforeRestart = session.getEarnings();

    session.start(null, 1000);
    jest.advanceTimersByTime(1000);

    expect(session.getEarnings()).toBeGreaterThan(earningsBeforeRestart);

    session.stop();
    Math.random.mockRestore();
  });

  it("stop is safe to call when not running", () => {
    const session = createMiningSession();
    expect(() => session.stop()).not.toThrow();
  });

  it("uses default interval of 2000ms when not specified", () => {
    const session = createMiningSession();
    const onUpdate = jest.fn();
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    session.start(onUpdate);

    jest.advanceTimersByTime(1999);
    expect(onUpdate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(onUpdate).toHaveBeenCalledTimes(1);

    session.stop();
    Math.random.mockRestore();
  });

  it("generates earnings between 0 and 0.00001 per tick", () => {
    const session = createMiningSession();

    jest.spyOn(Math, "random").mockReturnValue(0);
    session.start(null, 1000);
    jest.advanceTimersByTime(1000);
    expect(session.getEarnings()).toBe(0);
    session.stop();

    const session2 = createMiningSession();
    Math.random.mockReturnValue(0.999999);
    session2.start(null, 1000);
    jest.advanceTimersByTime(1000);
    expect(session2.getEarnings()).toBeLessThan(0.00001);
    session2.stop();

    Math.random.mockRestore();
  });
});

describe("formatBTC", () => {
  it("formats zero", () => {
    expect(formatBTC(0)).toBe("0.000000 BTC");
  });

  it("formats a small amount with 6 decimal places", () => {
    expect(formatBTC(0.000005)).toBe("0.000005 BTC");
  });

  it("formats a larger amount", () => {
    expect(formatBTC(1.23456789)).toBe("1.234568 BTC");
  });

  it("pads short decimals to 6 places", () => {
    expect(formatBTC(1)).toBe("1.000000 BTC");
  });

  it("rounds correctly at the 6th decimal", () => {
    expect(formatBTC(0.0000015)).toBe("0.000002 BTC");
    expect(formatBTC(0.0000004)).toBe("0.000000 BTC");
  });
});

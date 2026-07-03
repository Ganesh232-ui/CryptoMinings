/**
 * Mining simulation module.
 */

function createMiningSession() {
  let totalEarnings = 0;
  let intervalId = null;

  function start(onUpdate, intervalMs) {
    if (intervalId !== null) {
      throw new Error("Mining session already running");
    }

    const ms = intervalMs || 2000;

    intervalId = setInterval(() => {
      const earned = Math.random() * 0.00001;
      totalEarnings += earned;
      if (onUpdate) {
        onUpdate(totalEarnings);
      }
    }, ms);

    return intervalId;
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function getEarnings() {
    return totalEarnings;
  }

  function isRunning() {
    return intervalId !== null;
  }

  return { start, stop, getEarnings, isRunning };
}

function formatBTC(amount) {
  return amount.toFixed(6) + " BTC";
}

module.exports = { createMiningSession, formatBTC };

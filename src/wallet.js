/**
 * Wallet connection and registration module.
 */

async function connectWallet(ethereum, fetchFn, apiBase) {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const wallet = accounts[0];
  if (!wallet) {
    throw new Error("No wallet account returned");
  }

  await fetchFn(apiBase + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet }),
  });

  return wallet;
}

module.exports = { connectWallet };

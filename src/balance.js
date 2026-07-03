/**
 * Balance checking module.
 */

async function checkDeposit(wallet, fetchFn, apiBase) {
  if (!wallet) {
    throw new Error("Wallet address is required");
  }

  const res = await fetchFn(apiBase + "/balance/" + wallet);
  const data = await res.json();

  return data.balance;
}

module.exports = { checkDeposit };

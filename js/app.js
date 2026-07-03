/**
 * Application logic for the Crypto Mining Platform.
 * Depends on: js/utils.js (apiRequest, updateElementText, formatBTC)
 */

let userWallet = "";

async function connectWallet() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  userWallet = accounts[0];
  updateElementText("wallet", userWallet);

  await apiRequest("/register", {
    method: "POST",
    body: { wallet: userWallet },
  });
}

async function checkDeposit() {
  const data = await apiRequest("/balance/" + userWallet);
  updateElementText("balance", formatBTC(data.balance));
}

function startMining() {
  let earned = 0;
  setInterval(() => {
    earned += Math.random() * 0.00001;
    updateElementText("mining", formatBTC(earned));
  }, 2000);
}

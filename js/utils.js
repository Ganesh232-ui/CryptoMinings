/**
 * Shared utility functions for the Crypto Mining Platform.
 */

const API_BASE_URL = "http://localhost:3000";

/**
 * Make an API request with consistent error handling.
 * @param {string} endpoint - API endpoint path (e.g. "/register")
 * @param {object} [options] - Fetch options (method, body, etc.)
 * @returns {Promise<object|null>} Parsed JSON response or null for non-JSON responses
 */
async function apiRequest(endpoint, options = {}) {
  const url = API_BASE_URL + endpoint;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
}

/**
 * Update the text content of a DOM element by its ID.
 * @param {string} elementId - The element's ID attribute
 * @param {string} text - The text to display
 */
function updateElementText(elementId, text) {
  document.getElementById(elementId).innerText = text;
}

/**
 * Format a BTC value for display.
 * @param {number} value - The numeric BTC amount
 * @param {number} [decimals=6] - Decimal places to show
 * @returns {string} Formatted string like "0.000123 BTC"
 */
function formatBTC(value, decimals = 6) {
  return value.toFixed(decimals) + " BTC";
}

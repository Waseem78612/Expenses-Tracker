// Map of currency codes to their visual symbols ($, €, £, etc.)
const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  PKR: "Rs",
  INR: "₹",
};

// Map of currency codes to their full readable names
const CURRENCY_NAMES = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  PKR: "Pakistani Rupee",
  INR: "Indian Rupee",
};

// Converts a number into formatted currency string with symbol and commas (e.g., "$ 1,250.50")
export const formatCurrency = (amount, currency = "PKR") => {
  if (!amount && amount !== 0) return "0.00";  // Return "0.00" for null/undefined but allow zero
  const symbol = CURRENCY_SYMBOLS[currency] || "Rs";  // Get symbol or default to "Rs"
  const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");  // Add 2 decimals and thousands commas
  return `${symbol} ${formattedAmount}`;  // Combine symbol and formatted amount
};

// Returns only the currency symbol for a given currency code (e.g., "$" for USD)
export const getCurrencySymbol = (currency = "PKR") => {
  return CURRENCY_SYMBOLS[currency] || "Rs";
};

// Returns the full currency name for a given currency code (e.g., "US Dollar" for USD)
export const getCurrencyName = (currency = "PKR") => {
  return CURRENCY_NAMES[currency] || "Pakistani Rupee";
};
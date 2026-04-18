// Icon components for edit and delete actions
import { Pencil, Trash2 } from "lucide-react";
// Date formatting utility
import { format } from "date-fns";
// Currency formatter (e.g., PKR 1,000)
import { formatCurrency } from "../utils/currency";

/**
 * TransactionList Component
 * Displays a list of financial transactions with edit/delete controls
 * @param {Array} transactions - List of transaction objects
 * @param {Function} onEdit - Called with transaction object when edit clicked
 * @param {Function} onDelete - Called with transaction ID when delete clicked
 * @param {string} currency - Currency code (defaults to "PKR")
 */
const TransactionList = ({
  transactions, // Array of transaction objects to display
  onEdit, // Function to call when user clicks Edit button
  onDelete, // Function to call when user clicks Delete button
  currency = "PKR", // Currency symbol with default value "PKR"
}) => {
  // Show empty state message when no transactions exist
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No transactions found
        </p>
      </div>
    );
  }

  // Render the list of transactions
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start">
            {/* Left side: transaction details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {/* Type badge (income/expense) with color coding */}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    transaction.type === "income"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {transaction.type}
                </span>
                {/* Formatted transaction date */}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(transaction.date), "MMM dd, yyyy")}
                </span>
              </div>
              {/* Transaction category */}
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {transaction.category}
              </h3>
              {/* Optional description - only shown if provided */}
              {transaction.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {transaction.description}
                </p>
              )}
            </div>

            {/* Right side: amount and action buttons */}
            <div className="text-right">
              {/* Amount with +/- sign and color based on type */}
              <div
                className={`text-lg font-bold ${
                  transaction.type === "income"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}{" "}
                {formatCurrency(transaction.amount, currency)}
              </div>
              {/* Edit and Delete buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onEdit(transaction)}
                  className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(transaction._id)}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;

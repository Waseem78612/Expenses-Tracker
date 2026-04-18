// Import useState hook for managing component state
import { useState } from "react";

// Import X icon for close button from lucide-react
import { X } from "lucide-react";

// Import toast for showing notification messages
import toast from "react-hot-toast";

// Import configured axios instance for API calls
import api from "../utils/api";

// Import authentication hook to get current user data
import { useAuth } from "../Context/AuthContext.jsx";

// Import helper functions to get currency symbol and name based on user's currency setting
import { getCurrencySymbol, getCurrencyName } from "../utils/currency.js";

// Define available categories for income and expense transactions
const categories = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other Income"],
  expense: [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Education",
    "Other Expense",
  ],
};

// Reusable CSS classes for input fields (light and dark mode support)
const inputClasses =
  "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500";

// Reusable CSS classes for form labels
const labelClasses =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

// TransactionForm component - modal form for adding/editing transactions
const TransactionForm = ({ onClose, onSuccess, editingTransaction }) => {
  // Get current user from authentication context
  const { user } = useAuth();

  // State for loading indicator during API calls
  const [loading, setLoading] = useState(false);

  // State for form data - populated with editingTransaction data if editing, otherwise defaults
  const [formData, setFormData] = useState({
    type: editingTransaction?.type || "expense", // Default to expense
    category: editingTransaction?.category || "", // Empty if new transaction
    amount: editingTransaction?.amount || "", // Empty if new transaction
    description: editingTransaction?.description || "", // Empty if new transaction
    date:
      editingTransaction?.date?.split("T")[0] ||
      new Date().toISOString().split("T")[0], // Format date as YYYY-MM-DD
  });

  // Get currency symbol (e.g., $, €, £) based on user's currency setting
  const currencySymbol = getCurrencySymbol(user?.currency);

  // Get currency name (e.g., USD, EUR, GBP) based on user's currency setting
  const currencyName = getCurrencyName(user?.currency);

  // Handle form submission - create or update transaction
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent browser default form submission

    // Validate required fields
    if (!formData.category || !formData.amount) {
      toast.error("Please fill all required fields"); // Show error toast
      return;
    }

    setLoading(true); // Show loading state on button

    try {
      // Determine URL and HTTP method based on edit or create mode
      const url = editingTransaction
        ? `/transactions/${editingTransaction._id}` // Edit: PUT to specific transaction
        : "/transactions"; // Create: POST to transactions collection
      const method = editingTransaction ? "put" : "post";

      // Make API request to save transaction
      await api[method](url, formData);

      // Show success message
      toast.success(
        editingTransaction ? "Transaction updated!" : "Transaction added!",
      );

      onSuccess(); // Call success callback to refresh transaction list
      onClose(); // Close the modal form
    } catch (error) {
      toast.error("Failed to save transaction"); // Show error toast
    } finally {
      setLoading(false); // Hide loading state regardless of success/failure
    }
  };

  // Helper function to update specific field in formData state
  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // Component for type selection buttons (Income/Expense)
  const TypeButton = ({ type, label, colorClass }) => (
    <button
      type="button"
      onClick={() => updateField("type", type, updateField("category", ""))} // Reset category when type changes
      className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
        formData.type === type
          ? `${colorClass} text-white` // Active button: colored background
          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" // Inactive: gray background
      }`}
    >
      {label}
    </button>
  );

  return (
    // Modal overlay - fixed position covering entire screen with semi-transparent background
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal container - white card with rounded corners */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="text-gray-500 dark:text-gray-400" size={20} />
          </button>
        </div>

        {/* Form - handles submission */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selection Section */}
          <div>
            <label className={labelClasses}>Type</label>
            <div className="flex gap-3">
              <TypeButton
                type="expense"
                label="Expense"
                colorClass="bg-red-500"
              />
              <TypeButton
                type="income"
                label="Income"
                colorClass="bg-green-500"
              />
            </div>
          </div>

          {/* Category Dropdown Section */}
          <div>
            <label className={labelClasses}>Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => updateField("category", e.target.value)}
              className={inputClasses}
            >
              <option value="">Select category</option>
              {/* Show categories based on selected type (income or expense) */}
              {categories[formData.type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input Section */}
          <div>
            <label className={labelClasses}>
              Amount * ({currencyName} - {currencySymbol})
            </label>
            <div className="relative">
              {/* Currency symbol displayed inside input field */}
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                required
                step="0.01" // Allow decimal values for cents/pence
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                className={`${inputClasses} pl-8`} // Extra left padding for currency symbol
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter amount in {currencyName} ({currencySymbol})
            </p>
          </div>

          {/* Description Input Section */}
          <div>
            <label className={labelClasses}>Description</label>
            <input
              type="text"
              placeholder="Optional description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Date Picker Section */}
          <div>
            <label className={labelClasses}>Date</label>
            <input
              type="date" // HTML5 date picker
              value={formData.date}
              onChange={(e) => updateField("date", e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Form Actions - Cancel and Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium rounded-lg disabled:opacity-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-primary-400"
            >
              {loading ? "Saving..." : editingTransaction ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export component for use in other files
export default TransactionForm;

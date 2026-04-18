// Import useState for state management and useEffect for side effects
import { useState, useEffect } from "react";

// Import Plus icon for add button and Search icon for search input
import { Plus, Search } from "lucide-react";

// Import configured axios instance for making API calls
import api from "../utils/api";

// Import authentication hook to get current user data
import { useAuth } from "../Context/AuthContext";

// Import TransactionForm component (modal for adding/editing transactions)
import TransactionForm from "../Components/TransactionForm";

// Import TransactionList component to display transactions in a list
import TransactionList from "../Components/TransactionList";

// Import toast for showing notification messages (success/error)
import toast from "react-hot-toast";

// Import reusable Skeleton component for loading placeholders
import Skeleton from "../Components/Skeleton";

// Transactions Component - Main page for managing all transactions
const Transactions = () => {
  // Get current logged-in user from authentication context
  const { user } = useAuth();

  // State for storing all transactions fetched from database
  const [transactions, setTransactions] = useState([]);

  // State for loading indicator - shows skeleton while fetching data
  const [loading, setLoading] = useState(true);

  // State to control modal form visibility (show/hide add/edit form)
  const [showForm, setShowForm] = useState(false);

  // State to store transaction being edited (null when adding new)
  const [editingTransaction, setEditingTransaction] = useState(null);

  // State for filters - type (income/expense/all) and search term
  const [filters, setFilters] = useState({ type: "", search: "" });

  // useEffect runs whenever filters change (type or search)
  // This automatically refetches transactions when user filters data
  useEffect(() => {
    fetchTransactions(); // Fetch transactions when component mounts or filters change
  }, [filters]); // Dependency array - re-run when 'filters' changes

  // Function to fetch transactions from backend with filters applied
  const fetchTransactions = async () => {
    try {
      setLoading(true); // Show skeleton loader while fetching

      // Build URL query parameters for filtering
      const params = new URLSearchParams(); // Creates object for query params
      if (filters.type) params.append("type", filters.type); // Add type filter if selected

      // Make API call to get transactions (with optional type filter)
      const { data } = await api.get(`/transactions?${params}`);

      // Variable to store filtered data (initially all data from API)
      let filtered = data;

      // Apply search filter locally if search term exists
      if (filters.search) {
        const searchLower = filters.search.toLowerCase(); // Convert search term to lowercase
        filtered = data.filter(
          (t) =>
            // Check if description contains search term (case-insensitive)
            t.description?.toLowerCase().includes(searchLower) ||
            // Check if category contains search term (case-insensitive)
            t.category.toLowerCase().includes(searchLower),
        );
      }

      // Update transactions state with filtered results
      setTransactions(filtered);
    } catch (error) {
      // Show error toast if API call fails
      toast.error("Failed to load transactions");
    } finally {
      // Always hide loading state regardless of success or failure
      setLoading(false);
    }
  };

  // Function to handle transaction deletion
  const handleDelete = async (id) => {
    // Show confirmation dialog to prevent accidental deletion
    if (confirm("Are you sure?")) {
      try {
        // Make DELETE request to backend with transaction ID
        await api.delete(`/transactions/${id}`);

        // Show success notification
        toast.success("Transaction deleted");

        // Refresh the transaction list after deletion
        fetchTransactions();
      } catch (error) {
        // Show error toast if deletion fails
        toast.error("Failed to delete");
      }
    }
  };

  // Function to handle editing a transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction); // Store transaction to edit
    setShowForm(true); // Open the modal form
  };

  // SKELETON LOADING UI - Shows gray placeholders while data is fetching
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton - Title and Add Button placeholders */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton type="text" className="h-8 w-48" />{" "}
            {/* "Transactions" title */}
            <Skeleton type="text" className="h-4 w-64" />{" "}
            {/* Description text */}
          </div>
          <Skeleton type="button" className="w-36" />{" "}
          {/* Add Transaction button */}
        </div>

        {/* Filters Section Skeleton - Search and Type filter placeholders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Skeleton type="text" className="h-10 w-full" />{" "}
              {/* Search input */}
            </div>
            <Skeleton type="text" className="h-10 w-32" /> {/* Type dropdown */}
          </div>
        </div>

        {/* Transactions List Skeleton - Table/List placeholders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Skeleton type="text" className="h-6 w-32" />{" "}
              {/* Column header */}
              <Skeleton type="text" className="h-4 w-24" />{" "}
              {/* Another header */}
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <Skeleton type="transaction" count={8} /> {/* 8 transaction rows */}
          </div>
        </div>
      </div>
    );
  }

  // MAIN TRANSACTIONS UI - Rendered when data is loaded
  return (
    <div className="space-y-6">
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Page title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          {/* Page description */}
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all your transactions
          </p>
        </div>
        {/* Add Transaction button - opens modal form */}
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      {/* ===== FILTERS SECTION ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input - Filters by category or description */}
          <div className="flex-1 relative">
            {/* Search icon inside input */}
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={
                (e) => setFilters({ ...filters, search: e.target.value }) // Update search term
              }
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter Dropdown - Filters by income or expense */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })} // Update type filter
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-32"
          >
            <option value="">All Types</option> {/* Show all transactions */}
            <option value="income">Income</option> {/* Show only income */}
            <option value="expense">Expense</option> {/* Show only expenses */}
          </select>
        </div>
      </div>

      {/* ===== TRANSACTIONS LIST ===== */}
      {/* TransactionList component handles displaying all transactions with edit/delete options */}
      <TransactionList
        transactions={transactions} // Array of transaction objects
        onEdit={handleEdit} // Function to handle edit
        onDelete={handleDelete} // Function to handle delete
        currency={user?.currency} // User's preferred currency
      />

      {/* ===== TRANSACTION FORM MODAL ===== */}
      {/* Conditionally render modal only when showForm is true */}
      {showForm && (
        <TransactionForm
          onClose={() => {
            setShowForm(false); // Close modal
            setEditingTransaction(null); // Clear editing transaction
          }}
          onSuccess={fetchTransactions} // Refresh list after successful save
          editingTransaction={editingTransaction} // Pass transaction for edit mode
        />
      )}
    </div>
  );
};

// Export Transactions component for use in routing
export default Transactions;

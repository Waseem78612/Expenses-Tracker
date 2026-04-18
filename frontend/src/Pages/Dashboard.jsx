// Import React hooks for state management and side effects
import { useState, useEffect } from "react";

// Import icons from lucide-react for UI elements
import {
  Plus, // Icon for "Add Transaction" button
  TrendingUp, // Icon for Income card (upward trend)
  TrendingDown, // Icon for Expenses card (downward trend)
  Wallet, // Icon for Balance card and empty state
  RefreshCw, // Icon for Refresh button (rotating arrows)
  Search, // Icon for search input field
} from "lucide-react";

// Import configured axios instance for making API calls
import api from "../utils/api";

// Import authentication hook to get current user data
import { useAuth } from "../Context/AuthContext.jsx";

// Import TransactionForm component (modal for adding/editing transactions)
import TransactionForm from "../Components/TransactionForm.jsx";

// Import Charts component for data visualization (bar chart + pie chart)
import Charts from "../Components/Charts.jsx";

// Import toast for showing notification messages (success/error)
import toast from "react-hot-toast";

// Import currency formatting helper function
import { formatCurrency } from "../utils/currency.js";

// Import reusable Skeleton component for loading placeholders
import Skeleton from "../Components/Skeleton.jsx";

// Dashboard component - Main page showing financial overview
const Dashboard = () => {
  // Get current logged-in user from authentication context
  const { user } = useAuth();

  // State for storing statistics data (balance, income, expense totals)
  const [stats, setStats] = useState(null);

  // State for displaying limited transactions (shows only first 5 initially)
  const [recentTransactions, setRecentTransactions] = useState([]);

  // State for storing ALL transactions fetched from database
  const [allTransactions, setAllTransactions] = useState([]);

  // State for loading indicator - shows skeleton while fetching data
  const [loading, setLoading] = useState(true);

  // State to control modal form visibility (show/hide add transaction form)
  const [showForm, setShowForm] = useState(false);

  // State for refresh button - shows spinner while refreshing
  const [refreshing, setRefreshing] = useState(false);

  // State for search/filter functionality
  const [searchTerm, setSearchTerm] = useState("");

  // State for controlling how many transactions to show (default: 5)
  const [transactionLimit, setTransactionLimit] = useState(5);

  // State to toggle between showing 5 transactions vs all transactions
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // useEffect runs once when component mounts (empty dependency array)
  useEffect(() => {
    fetchData(); // Fetch dashboard data when page loads
  }, []);

  // Function to fetch dashboard data from backend APIs
  const fetchData = async () => {
    try {
      setLoading(true); // Show skeleton loader

      // Execute both API calls simultaneously for better performance
      const [statsResponse, transactionsResponse] = await Promise.all([
        api.get("/transactions/stats"), // Get income/expense statistics
        api.get("/transactions"), // Get all transactions
      ]);

      // Update stats state with response data
      setStats(statsResponse.data);

      // Store all transactions (or empty array if none)
      const allTrans = transactionsResponse.data || [];
      setAllTransactions(allTrans);

      // Show only first 'transactionLimit' (5) transactions initially
      setRecentTransactions(allTrans.slice(0, transactionLimit));
    } catch (error) {
      // Handle different types of errors with appropriate messages

      if (error.response) {
        // Server responded with error status (4xx or 5xx)
        const errorMessage =
          error.response.data?.message || "Failed to load dashboard data";
        toast.error(errorMessage);

        // Specific error handling based on HTTP status code
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
        } else if (error.response.status === 500) {
          toast.error("Server error. Please try again later.");
        }
      } else if (error.request) {
        // Request was made but no response received (network issue)
        toast.error("Network error. Please check your connection.");
      } else {
        // Something else went wrong (setup error, etc.)
        toast.error("An unexpected error occurred");
      }
    } finally {
      // ALWAYS run - hide loading states regardless of success or failure
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to manually refresh dashboard data
  const handleRefresh = async () => {
    setRefreshing(true); // Show spinner on refresh button
    await fetchData(); // Fetch fresh data from server
    toast.success("Dashboard refreshed!"); // Notify user of success
  };

  // Function to toggle between showing 5 transactions or all transactions
  const toggleTransactionsView = () => {
    if (showAllTransactions) {
      // Currently showing ALL - switch back to showing only 5
      setTransactionLimit(5);
      setRecentTransactions(allTransactions.slice(0, 5));
      setShowAllTransactions(false);
    } else {
      // Currently showing 5 - switch to showing ALL transactions
      setShowAllTransactions(true);
      setRecentTransactions(allTransactions);
    }
  };

  // Filter transactions based on search term
  // Checks category, description, and transaction type (case-insensitive)
  const filteredTransactions = recentTransactions.filter(
    (transaction) =>
      // Check if category contains search term
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Check if description contains search term
      transaction.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      // Check if type (income/expense) contains search term
      transaction.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Reusable Stat Card Component - displays financial metrics
  // Props: label (title), value (amount), icon (component), color (text color), bgColor (background)
  const StatCard = ({ label, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        {/* Left side - text content */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className={`text-2xl font-bold ${color}`}>
            {value >= 0 ? "+ " : "- "}
            {formatCurrency(Math.abs(value), user?.currency)}
          </p>
        </div>
        {/* Right side - icon with colored background */}
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={color} size={28} />
        </div>
      </div>
    </div>
  );

  // SKELETON LOADING UI - Shows gray placeholders while data is fetching
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton - Title and buttons placeholders */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <Skeleton type="text" className="h-8 w-48" />{" "}
              {/* Dashboard title */}
              <Skeleton type="text" className="h-4 w-64" />{" "}
              {/* Welcome message */}
            </div>
            <div className="flex gap-3">
              <Skeleton type="button" className="w-24" /> {/* Refresh button */}
              <Skeleton type="button" className="w-36" />{" "}
              {/* Add Transaction button */}
            </div>
          </div>

          {/* Stats Cards Skeleton - 3 card placeholders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton type="card" /> {/* Balance card */}
            <Skeleton type="card" /> {/* Income card */}
            <Skeleton type="card" /> {/* Expenses card */}
          </div>

          {/* Chart Skeleton - Bar chart and pie chart placeholders */}
          <Skeleton type="chart" />

          {/* Transactions Section Skeleton - Transaction list placeholders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <Skeleton type="text" className="h-6 w-48" />{" "}
                {/* "Transaction History" title */}
                <Skeleton type="text" className="h-10 w-64" />{" "}
                {/* Search input placeholder */}
              </div>
            </div>
            <div className="p-5 space-y-2">
              <Skeleton type="transaction" count={5} />{" "}
              {/* 5 transaction item placeholders */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD UI - Rendered when data is loaded
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ===== HEADER SECTION ===== */}
        {/* Title, welcome message, and action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user?.name}! {/* Personalized welcome message */}
            </p>
          </div>
          <div className="flex gap-3">
            {/* Refresh button - reloads all dashboard data */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""} // Spins when refreshing
              />
              Refresh
            </button>
            {/* Add Transaction button - opens modal form */}
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} /> Add Transaction
            </button>
          </div>
        </div>

        {/* ===== STATS CARDS SECTION ===== */}
        {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Balance Card - Shows net total (Income - Expense) */}
          <StatCard
            label="Total Balance"
            value={stats?.balance || 0}
            icon={Wallet}
            color={stats?.balance >= 0 ? "text-green-600" : "text-red-600"} // Green if positive, red if negative
            bgColor={stats?.balance >= 0 ? "bg-green-100" : "bg-red-100"}
          />

          {/* Total Income Card - Shows all income transactions */}
          <StatCard
            label="Total Income"
            value={stats?.totalIncome || 0}
            icon={TrendingUp}
            color="text-green-600"
            bgColor="bg-green-100"
          />

          {/* Total Expenses Card - Shows all expense transactions (negative made positive for display) */}
          <StatCard
            label="Total Expenses"
            value={-(stats?.totalExpense || 0)} // Convert negative to positive for display
            icon={TrendingDown}
            color="text-red-600"
            bgColor="bg-red-100"
          />
        </div>

        {/* ===== CHARTS SECTION ===== */}
        {/* Only render charts if stats data is available */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
            {/* Charts component displays pie chart and bar chart */}
            <Charts stats={stats} currency={user?.currency} />
          </div>
        )}

        {/* ===== RECENT TRANSACTIONS SECTION ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Transactions Header with Search Input */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              {/* Title with total transaction count */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Transaction History
                {allTransactions.length > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({allTransactions.length} total)
                  </span>
                )}
              </h3>

              {/* Search input field with search icon */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Transactions List Content */}
          <div className="p-5">
            {/* Case 1: No transactions exist */}
            {allTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No transactions yet. Click "Add Transaction" to get started!
                </p>
              </div>
            ) : (
              <>
                {/* Scrollable transactions container (max height 384px) */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {/* Case 2: Search returns no results */}
                  {filteredTransactions.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No matching transactions found
                    </p>
                  ) : (
                    // Display filtered transactions
                    filteredTransactions.map((transaction, index) => (
                      <div
                        key={transaction._id || index}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {/* Left side: Category and Description */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.category || "Uncategorized"}
                            {transaction.description && (
                              <span className="text-sm text-gray-500 ml-2">
                                • {transaction.description}
                              </span>
                            )}
                          </p>
                          {/* Formatted transaction date */}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Right side: Amount with +/- sign and color */}
                        <div
                          className={`text-lg font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}{" "}
                          {formatCurrency(transaction.amount, user?.currency)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Show More/Less Button - only appears if more than 5 transactions exist */}
                {allTransactions.length > 5 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={toggleTransactionsView}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
                    >
                      {showAllTransactions
                        ? "Show Less"
                        : `Show All (${allTransactions.length})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ===== TRANSACTION FORM MODAL ===== */}
        {/* Conditionally render modal only when showForm is true */}
        {showForm && (
          <TransactionForm
            onClose={() => setShowForm(false)} // Close modal without saving
            onSuccess={() => {
              fetchData(); // Refresh dashboard data after successful save
              setShowForm(false); // Close the modal
            }}
          />
        )}
      </div>
    </div>
  );
};

// Export Dashboard component for use in routing
export default Dashboard;

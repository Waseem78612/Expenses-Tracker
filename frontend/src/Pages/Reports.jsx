// React hooks for state management and side effects
import { useState, useEffect } from "react";
// Custom API utility for making backend requests
import api from "../utils/api";
// Toast notifications for user feedback (success/error messages)
import toast from "react-hot-toast";
// Authentication context to get current logged-in user data
import { useAuth } from "../Context/AuthContext";
// Currency formatting utilities
import { formatCurrency, getCurrencySymbol } from "../utils/currency";
// Reusable charts component (Bar chart + Pie chart)
import Charts from "../Components/Charts";
// Reusable skeleton component for loading states
import Skeleton from "../Components/Skeleton";

const Reports = () => {
  // Get current user data (name, currency preference, etc.)
  const { user } = useAuth();

  // Track selected time period (week, month, or year)
  const [period, setPeriod] = useState("month");

  // Store financial statistics from API (income, expense, balance, category breakdown)
  const [stats, setStats] = useState(null);

  // Track loading state to show spinner while fetching data
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts OR when period changes
  useEffect(() => {
    fetchStats(); // Re-fetch when user clicks Week/Month/Year
  }, [period]); // Dependency array - effect runs when 'period' changes

  // Async function to fetch financial statistics from backend
  const fetchStats = async () => {
    try {
      setLoading(true); // Show loading spinner
      // Make API call with selected period (e.g., /transactions/stats?period=month)
      const { data } = await api.get(`/transactions/stats?period=${period}`);
      setStats(data); // Store response in state for rendering
    } catch (error) {
      // Show error toast if API call fails
      toast.error("Failed to load reports");
    } finally {
      setLoading(false); // Hide loading spinner regardless of success/failure
    }
  };

  // Skeleton Loading UI
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Header Skeleton */}
        <div className="space-y-2">
          <Skeleton type="text" className="h-8 w-64" />
          <Skeleton type="text" className="h-4 w-80" />
        </div>

        {/* Time Period Buttons Skeleton */}
        <div className="flex gap-3 flex-wrap">
          <Skeleton type="button" className="w-20" />
          <Skeleton type="button" className="w-20" />
          <Skeleton type="button" className="w-20" />
        </div>

        {/* Summary Cards Skeleton (3 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton type="card" />
          <Skeleton type="card" />
          <Skeleton type="card" />
        </div>

        {/* Chart Skeleton */}
        <Skeleton type="chart" />

        {/* Insights Card Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
          <Skeleton type="text" className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
              <div className="space-y-2">
                <Skeleton type="text" className="h-4 w-full" />
                <Skeleton type="text" className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Reusable Card Component
   * Wraps content in a styled container with optional title
   * @param {string} title - Optional card title
   * @param {ReactNode} children - Card content
   */
  const Card = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
      {title && (
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );

  /**
   * Summary Card Component
   * Displays a single financial metric (Income, Expense, or Savings)
   * @param {string} label - Label text (e.g., "Total Income")
   * @param {number} value - Amount to display
   * @param {string} color - Tailwind color class for the amount
   * @param {string} prefix - Optional +/- sign prefix
   */
  const SummaryCard = ({ label, value, color, prefix = "" }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${color} break-words`}>
        {prefix} {formatCurrency(value, user?.currency)}
      </p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Financial Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Analyze your spending patterns
        </p>
      </div>

      {/* Time Period Selector Buttons */}
      {/* Allows user to filter data by week, month, or year */}
      <div className="flex gap-3 flex-wrap">
        {["week", "month", "year"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)} // Update period state, triggers data refetch
            className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
              period === p
                ? "bg-blue-600 text-white shadow-md" // Active period styling
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" // Inactive styling
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Summary Statistics Cards Grid */}
      {/* Shows 3 cards side by side: Income, Expense, Net Savings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Income Card - Always green, shows positive amount */}
        <SummaryCard
          label="Total Income"
          value={stats?.totalIncome || 0}
          color="text-green-600 dark:text-green-400"
          prefix="+"
        />

        {/* Expense Card - Always red, shows negative amount */}
        <SummaryCard
          label="Total Expense"
          value={stats?.totalExpense || 0}
          color="text-red-600 dark:text-red-400"
          prefix="-"
        />

        {/* Net Savings Card - Green if positive, Red if negative */}
        <SummaryCard
          label="Net Savings"
          value={stats?.balance || 0}
          color={
            stats?.balance >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        />
      </div>

      {/* Charts Section - Only render when stats data is available */}
      {/* Renders the reusable Charts component which contains:
          - Bar Chart: Income vs Expense comparison
          - Pie Chart: Expense breakdown by category */}
      {stats && (
        <Card>
          <Charts stats={stats} currency={user?.currency} />
        </Card>
      )}

      {/* Financial Insights Section - Smart analysis of user's finances */}
      <Card title="Financial Insights">
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <span className="font-semibold">Insight:</span>{" "}
              {/* Conditional message based on whether expenses exceed income */}
              {stats?.totalExpense > stats?.totalIncome ? (
                // Spending more than earning - Warning message in red
                <>
                  Your expenses exceed income by{" "}
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(
                      stats.totalExpense - stats.totalIncome,
                      user?.currency,
                    )}
                  </span>
                </>
              ) : (
                // Saving money - Positive message in green
                <>
                  You're saving{" "}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(
                      stats.totalIncome - stats.totalExpense,
                      user?.currency,
                    )}
                  </span>
                  this {period}
                </>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;

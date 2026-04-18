// Import Recharts components for creating charts and graphs
import {
  PieChart, // Container component for pie chart
  Pie, // The actual pie slices
  Cell, // Individual pie slice for custom coloring
  BarChart, // Container component for bar chart
  Bar, // The actual bars in bar chart
  XAxis, // Bottom axis (categories)
  YAxis, // Left axis (values)
  CartesianGrid, // Background grid lines
  ResponsiveContainer, // Makes charts responsive to container size
  Tooltip, // Hover tooltip showing values
} from "recharts";

// Import currency utility to get symbol ($, €, £, etc.)
import { getCurrencySymbol } from "../utils/currency";

// Color palette for pie chart slices - cycles through these colors
const COLORS = [
  "#3b82f6", // Blue - for first category
  "#ef4444", // Red - for second category
  "#10b981", // Green - for third category
  "#f59e0b", // Orange - for fourth category
  "#8b5cf6", // Purple - for fifth category
  "#ec4899", // Pink - for sixth category
];

// Charts Component - Displays bar chart and pie chart for financial data
// Receives stats (financial data) and currency (user's preferred currency)
const Charts = ({ stats, currency = "PKR" }) => {
  // Get currency symbol from user's currency preference (e.g., $ for USD, Rs for PKR)
  const currencySymbol = getCurrencySymbol(currency);

  // Format expense data for pie chart
  // Converts categoryStats object into array format that Recharts understands
  const expenseData = stats?.categoryStats
    ? Object.entries(stats.categoryStats) // Convert object to [key, value] pairs
        .filter(([_, data]) => data.expense > 0) // Keep only categories with expenses
        .map(([name, data]) => ({ name, value: data.expense })) // Format for pie chart
    : []; // Empty array if no data

  // Data for bar chart with separate colors for Income and Expense
  const monthlyData = [
    { name: "Income", amount: stats?.totalIncome || 0, fill: "#3b82f6" }, // Blue for Income
    { name: "Expense", amount: stats?.totalExpense || 0, fill: "#ef4444" }, // Red for Expense
  ];

  // Format Y-axis values with proper currency abbreviations
  // Converts large numbers to K (thousands) or M (millions)
  const formatYAxis = (v) => {
    if (v >= 1000000) return `${currencySymbol}${(v / 1000000).toFixed(1)}M`; // 1,500,000 → $1.5M
    if (v >= 1000) return `${currencySymbol}${(v / 1000).toFixed(0)}K`; // 125,000 → $125K
    return `${currencySymbol}${v}`; // 500 → $500
  };

  // Custom tooltip component for bar chart - appears when hovering over bars
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Tooltip title (Income or Expense) */}
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            {label}
          </p>
          {/* Tooltip value with color based on type (blue for income, red for expense) */}
          <p
            className={`text-lg font-bold ${label === "Income" ? "text-blue-600" : "text-red-600"}`}
          >
            {currencySymbol}
            {payload[0].value.toLocaleString()} // Format number with commas
          </p>
        </div>
      );
    }
    return null; // Return nothing if tooltip not active
  };

  // Reusable chart container component - provides consistent styling for all charts
  const ChartContainer = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Chart title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      {/* Responsive container makes chart fill available space */}
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ===== BAR CHART: Income vs Expense ===== */}
      <ChartContainer title="Income vs Expense">
        <BarChart data={monthlyData}>
          {/* Background grid lines with dashed style */}
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          {/* X-Axis (Bottom) - Shows "Income" and "Expense" labels */}
          <XAxis
            dataKey="name" // Uses the "name" field from monthlyData
            stroke="#9ca3af"
            tick={{ fill: "currentColor" }}
            className="text-gray-700 dark:text-gray-300"
          />

          {/* Y-Axis (Left) - Shows currency values with formatting */}
          <YAxis
            stroke="#9ca3af"
            tickFormatter={formatYAxis} // Formats large numbers (e.g., 5000 → $5K)
            tick={{ fill: "currentColor", fontSize: 12 }}
            width={70} // Fixed width for axis labels
            className="text-gray-700 dark:text-gray-300"
          />

          {/* Tooltip - Shows detailed values on hover */}
          <Tooltip content={<CustomTooltip />} />

          {/* Bar component - draws the actual bars */}
          <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={300}>
            {/* Apply different colors to each bar (Income: blue, Expense: red) */}
            {monthlyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      {/* ===== PIE CHART: Expense Breakdown by Category ===== */}
      {/* Only render if there is expense data to display */}
      {expenseData.length > 0 && (
        <ChartContainer title="Expense Breakdown by Category">
          <PieChart>
            <Pie
              data={expenseData} // Array of {name, value} objects
              cx="50%" // Center X position (middle)
              cy="50%" // Center Y position (middle)
              labelLine={false} // Don't draw lines to labels
              label={
                ({ name, percent, value }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)` // Show "Food (25%)"
              }
              outerRadius={80} // Size of the pie chart
              dataKey="value" // Use "value" field for slice sizes
              label={{
                fill: "currentColor",
                className: "text-gray-900 dark:text-white text-sm",
              }}
            >
              {/* Apply different colors to each slice from COLORS array */}
              {expenseData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]} // Cycle through colors
                />
              ))}
            </Pie>
            {/* Tooltip for pie chart - shows amount on hover */}
            <Tooltip
              formatter={(value) => [
                `${currencySymbol}${value.toLocaleString()}`,
                "Amount",
              ]}
            />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default Charts;

// Import BrowserRouter for routing, Routes to define routes, Route for individual paths, Navigate for redirects
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Toaster component for showing toast notifications (success/error messages)
import { Toaster } from "react-hot-toast";

// Import PrivateRoute component to protect routes from unauthenticated users
import PrivateRoute from "./Components/PrivateRoute";

// Import Layout component that provides consistent UI (sidebar, header) around page content
import Layout from "./Components/Layout";

// Import Login page component for user authentication
import Login from "./Pages/Login";

// Import Register page component for new user signup
import Register from "./Pages/Register";

// Import Dashboard page component - main overview page with stats and charts
import Dashboard from "./Pages/Dashboard";

// Import Transactions page component - view and manage all transactions
import Transactions from "./Pages/Transactions";

// Import Reports page component - financial reports and analytics
import Reports from "./Pages/Reports";

// Import Settings page component - user preferences and profile management
import Settings from "./Pages/Settings";

// Main App component - root component of the entire application
function App() {
  console.log("App rendering"); // Debug log to confirm component is rendering

  return (
    // BrowserRouter - enables client-side routing using HTML5 history API
    <BrowserRouter>
      {/* Toaster - global toast notification container that appears at top-right */}
      <Toaster
        position="top-right" // Show notifications in top-right corner
        toastOptions={{
          duration: 3000, // Auto-hide after 3 seconds
          style: {
            background: "#363636", // Dark gray background for toasts
            color: "#fff", // White text color
          },
        }}
      />

      {/* Routes - container for all route definitions */}
      <Routes>
        {/* Public Routes - accessible without authentication */}
        <Route path="/login" element={<Login />} /> // Login page
        <Route path="/register" element={<Register />} /> // Registration page
        {/* Protected Routes - wrapped in PrivateRoute (requires authentication) */}
        <Route element={<PrivateRoute />}>
          {/* Layout - wraps all pages with sidebar and header */}
          <Route element={<Layout />}>
            {/* Redirect root path "/" to "/dashboard" */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            {/* Main application pages - all require authentication */}
            <Route path="/dashboard" element={<Dashboard />} /> // Dashboard
            page
            <Route path="/transactions" element={<Transactions />} /> //
            Transactions page
            <Route path="/reports" element={<Reports />} /> // Reports page
            <Route path="/settings" element={<Settings />} /> // Settings page
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Export App component as default for use in main.jsx
export default App;

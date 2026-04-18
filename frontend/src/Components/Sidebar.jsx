// Import navigation components from React Router for routing and URL detection
import { NavLink, useLocation } from "react-router-dom";
// Import authentication hook to access user data and logout function
import { useAuth } from "../Context/AuthContext";
// Import icons for visual elements in the navigation menu
import {
  LayoutDashboard, // Dashboard/home page icon
  TrendingUp, // Transactions page icon
  BarChart3, // Reports/analytics page icon
  Settings, // Settings/preferences page icon
  LogOut, // Logout button icon
  Wallet, // App logo/wallet icon
} from "lucide-react";

// Sidebar component - main navigation for both desktop and mobile
const Sidebar = () => {
  // Get user data and logout function from authentication context
  const { logout, user } = useAuth();
  // Get current URL path to determine active navigation item
  const location = useLocation();

  // Navigation items configuration - easy to add/remove menu items
  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/transactions", icon: TrendingUp, label: "Transactions" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  // Desktop navigation link styles - horizontal layout with icon + text
  const NavLinkStyles = (path) => {
    // Check if current URL starts with this path (supports sub-pages)
    const isActive = location.pathname.startsWith(path);

    // Return Tailwind CSS classes based on active state
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400" // Active link styles
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" // Inactive link styles
    }`;
  };

  // Mobile navigation link styles - vertical layout (icon above text)
  const MobileNavLinkStyles = (path) => {
    // Check if current URL starts with this path
    const isActive = location.pathname.startsWith(path);

    // Return mobile-specific Tailwind classes
    return `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400" // Active: highlighted background
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" // Inactive: gray with hover effect
    }`;
  };

  return (
    <>
      {/* ===== MOBILE BOTTOM NAVIGATION BAR ===== */}
      {/* Visible only on screens below 1024px, fixed at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex justify-around py-2">
          {/* Loop through all navigation items and render mobile links */}
          {navItems.map((item) => (
            <NavLink
              key={item.path} // Unique key for React rendering
              to={item.path} // Target URL path
              className={MobileNavLinkStyles(item.path)} // Apply mobile styles with active detection
            >
              <item.icon size={20} /> // Render the icon (20px size)
              <span className="text-xs">{item.label}</span> // Small text label
              below icon
            </NavLink>
          ))}

          {/* Mobile logout button - red theme for visual distinction */}
          <button
            onClick={logout}
            className="flex flex-col items-center gap-1 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>

      {/* ===== DESKTOP SIDEBAR ===== */}
      {/* Visible only on screens 1024px and above, fixed to left side */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Logo and User Info Section */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          {/* Wallet icon as app logo */}
          <Wallet className="text-primary-600" size={32} />
          <div>
            {/* Application title */}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              ExpenseTracker
            </h1>
            {/* Personalized welcome message with user's name */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Welcome, {user?.name}
            </p>
          </div>
        </div>

        {/* Main Navigation Menu - flex-1 pushes logout button to bottom */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Loop through navigation items and render desktop links */}
          {navItems.map((item) => (
            <NavLink
              key={item.path} // Unique key for React
              to={item.path} // Target URL path
              className={NavLinkStyles(item.path)} // Apply desktop styles with active detection
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button - Fixed at bottom of sidebar */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Export component for use throughout the application
export default Sidebar;

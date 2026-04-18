// Import Outlet component from React Router - renders the matched child route component
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

// Layout Component - Main layout wrapper for authenticated pages

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <main className="p-4 md:p-6 lg:p-8">
          {/* Outlet renders the currently active child route component (Dashboard, Transactions, Reports, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

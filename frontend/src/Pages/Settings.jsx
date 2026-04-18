// Import useState for managing component state
import { useState } from "react";

// Import authentication hook to get user data and updateUser function
import { useAuth } from "../Context/AuthContext";

// Import configured axios instance for making API calls
import api from "../utils/api";

// Import toast for showing notification messages (success/error)
import toast from "react-hot-toast";

// Import icons from lucide-react for UI elements
import {
  User, // Icon for name field
  Mail, // Icon for email field
  DollarSign, // Icon for currency field
  Save, // Icon for save button
  Shield, // Icon for account information section
} from "lucide-react";

// Import reusable Skeleton component for loading placeholders
import Skeleton from "../Components/Skeleton";

// Settings Component - Allows users to manage their profile preferences
const Settings = () => {
  // Get user data and updateUser function from authentication context
  // updateUser updates the user state in context and localStorage
  const { user, updateUser } = useAuth();

  // State to track loading status during form submission
  const [loading, setLoading] = useState(false);

  // State to manage form data (name and currency)
  // Initialize with user data if available, otherwise empty/default values
  const [formData, setFormData] = useState({
    name: user?.name || "", // User's full name
    currency: user?.currency || "USD", // Preferred currency (default: USD)
  });

  // Handle form submission when user clicks "Save Changes" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent browser default form submission (page refresh)

    setLoading(true); // Show loading spinner on button, disable button

    try {
      // Send PUT request to update user settings on backend
      const { data } = await api.put("/auth/settings", formData);

      // Update user data in context and localStorage with response from server
      updateUser(data);

      // Show success toast with green styling
      toast.success("Settings updated successfully!", {
        style: {
          background: "#10B981", // Green background
          color: "#fff", // White text
        },
        iconTheme: {
          primary: "#fff", // White checkmark
          secondary: "#10B981", // Green background for icon
        },
      });
    } catch (error) {
      // Show error toast with red styling
      toast.error("Failed to update settings", {
        style: {
          background: "#EF4444", // Red background
          color: "#fff", // White text
        },
      });
    } finally {
      setLoading(false); // Hide loading spinner, re-enable button
    }
  };

  // SKELETON LOADING UI - Shows gray placeholders while user data is loading
  // This displays when user is null (authentication not yet loaded)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-2">
              <Skeleton type="avatar" className="h-10 w-10" />{" "}
              {/* Shield icon placeholder */}
              <Skeleton type="text" className="h-8 w-32" />{" "}
              {/* "Settings" title */}
            </div>
            <Skeleton type="text" className="h-4 w-64 mx-auto sm:mx-0" />{" "}
            {/* Description text */}
          </div>

          {/* Profile Form Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Form Header Skeleton */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <Skeleton type="avatar" className="h-5 w-5" /> {/* User icon */}
                <Skeleton type="text" className="h-5 w-32" />{" "}
                {/* "Profile Information" text */}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Name Field Skeleton */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton type="avatar" className="h-4 w-4" />{" "}
                  {/* User icon */}
                  <Skeleton type="text" className="h-4 w-20" />{" "}
                  {/* "Full Name" label */}
                </div>
                <Skeleton type="text" className="h-12 w-full rounded-xl" />{" "}
                {/* Input placeholder */}
              </div>

              {/* Email Field Skeleton */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton type="avatar" className="h-4 w-4" />{" "}
                  {/* Mail icon */}
                  <Skeleton type="text" className="h-4 w-24" />{" "}
                  {/* "Email Address" label */}
                </div>
                <Skeleton type="text" className="h-12 w-full rounded-xl" />{" "}
                {/* Email input placeholder */}
                <div className="flex items-center gap-1 mt-1">
                  <Skeleton type="text" className="h-3 w-64" />{" "}
                  {/* Helper text */}
                </div>
              </div>

              {/* Currency Field Skeleton */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton type="avatar" className="h-4 w-4" />{" "}
                  {/* Dollar icon */}
                  <Skeleton type="text" className="h-4 w-32" />{" "}
                  {/* "Preferred Currency" label */}
                </div>
                <Skeleton type="text" className="h-12 w-full rounded-xl" />{" "}
                {/* Select dropdown placeholder */}
              </div>

              {/* Submit Button Skeleton */}
              <Skeleton type="button" className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Account Stats Card Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <Skeleton type="avatar" className="h-5 w-5" />{" "}
                {/* Shield icon */}
                <Skeleton type="text" className="h-5 w-36" />{" "}
                {/* "Account Information" text */}
              </div>
            </div>
            <div className="p-6 space-y-3">
              {/* Account Type Row */}
              <div className="flex justify-between items-center py-2">
                <Skeleton type="text" className="h-4 w-24" />{" "}
                {/* "Account Type" label */}
                <Skeleton type="text" className="h-6 w-20 rounded-full" />{" "}
                {/* "Free Plan" badge */}
              </div>
              {/* Account Status Row */}
              <div className="flex justify-between items-center py-2">
                <Skeleton type="text" className="h-4 w-28" />{" "}
                {/* "Account Status" label */}
                <div className="flex items-center gap-1">
                  <Skeleton type="avatar" className="h-2 w-2 rounded-full" />{" "}
                  {/* Status dot */}
                  <Skeleton type="text" className="h-4 w-12" />{" "}
                  {/* "Active" text */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN SETTINGS UI - Rendered when user data is loaded
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ===== HEADER SECTION ===== */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-3 mb-2">
            {/* Shield icon with gradient background */}
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {/* Gradient text title */}
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage your account preferences and personal information
          </p>
        </div>

        {/* ===== PROFILE SETTINGS FORM ===== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl"
        >
          {/* Form Header - Gradient background */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Full Name Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                required
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field (Disabled - Cannot be changed for security) */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Email Address
              </label>
              <input
                type="email"
                value={user?.email}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500 dark:text-gray-400"
                disabled
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                Email address cannot be changed for security reasons
              </p>
            </div>

            {/* Currency Select Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-500" />
                Preferred Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all duration-300 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
              >
                <option value="USD">🇺🇸 USD - US Dollar</option>
                <option value="EUR">🇪🇺 EUR - Euro</option>
                <option value="GBP">🇬🇧 GBP - British Pound</option>
                <option value="PKR">🇵🇰 PKR - Pakistani Rupee</option>
                <option value="INR">🇮🇳 INR - Indian Rupee</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                // Show loading spinner when processing
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving Changes...
                </>
              ) : (
                // Show save icon and text normally
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* ===== ACCOUNT STATS CARD ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Information
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {/* Account Type Row */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Account Type
                </span>
                <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm">
                  Free Plan
                </span>
              </div>

              {/* Account Status Row */}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Account Status
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export Settings component for use in routing
export default Settings;

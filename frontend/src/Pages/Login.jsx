// Import useState hook for managing component state
import { useState } from "react";

// Import Link for navigation to register page and useNavigate for programmatic navigation
import { Link, useNavigate } from "react-router-dom";

// Import authentication hook to get login function from AuthContext
import { useAuth } from "../Context/AuthContext";

// Import Wallet icon for logo display
import { Wallet } from "lucide-react";

// Import toast for showing notification messages (success/error)
import toast from "react-hot-toast";

// Login Component - Allows users to authenticate into the application
const Login = () => {
  // State to store user's email input value
  const [email, setEmail] = useState("");

  // State to store user's password input value
  const [password, setPassword] = useState("");

  // State to track loading status - disables button and shows "Signing in..." text
  const [loading, setLoading] = useState(false);

  // Destructure login function from authentication context
  // This function handles the actual authentication logic
  const { login } = useAuth();

  // Hook to programmatically navigate to different routes after successful login
  const navigate = useNavigate();

  // Handle form submission when user clicks "Sign In" button or presses Enter
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent browser default form submission (page refresh)

    setLoading(true); // Show loading state on button, disable button

    try {
      // Call login function from AuthContext with email and password
      // This sends credentials to backend, receives token, and stores it
      await login(email, password);

      // Show success toast notification
      toast.success("Welcome back!");

      // Navigate user to dashboard page after successful login
      navigate("/dashboard");
    } catch (error) {
      // Show error toast with message from server or default message
      // error.response?.data?.message gets the error message from backend API
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      // Always run - hide loading state regardless of success or failure
      setLoading(false);
    }
  };

  return (
    // Main container - full viewport height, centered content, dark background
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      {/* Content container - maximum width 448px (md) */}
      <div className="w-full max-w-md">
        {/* Header Section - Logo, title, and subtitle */}
        <div className="text-center mb-8">
          {/* Logo container - blue background, rounded corners */}
          <div className="inline-flex p-3 bg-blue-600 rounded-2xl mb-4">
            <Wallet className="text-white" size={32} />
          </div>
          {/* Main title */}
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          {/* Subtitle description */}
          <p className="text-gray-400 mt-2">Sign in to manage your finances</p>
        </div>

        {/* Login Form Card - Dark card with shadow and rounded corners */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Form - handles user input submission */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email" // Input type for email validation
                required // Browser will validate this field
                value={email} // Controlled component - value from state
                onChange={(e) => setEmail(e.target.value)} // Update state on change
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password" // Hides characters as user types
                required // Browser will validate this field
                value={password} // Controlled component - value from state
                onChange={(e) => setPassword(e.target.value)} // Update state on change
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit" // Triggers form submission
              disabled={loading} // Disable button while loading to prevent double submission
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {/* Show different text based on loading state */}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer - Link to Registration page for new users */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Export Login component for use in routing (App.jsx or main router file)
export default Login;

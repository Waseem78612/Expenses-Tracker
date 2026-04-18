// Import useState for managing component state and useEffect for side effects
import { useState, useEffect } from "react";

// Import Link for navigation to login page and useNavigate for programmatic navigation
import { Link, useNavigate } from "react-router-dom";

// Import authentication hook to get register function and user data from AuthContext
import { useAuth } from "../Context/AuthContext";

// Import Wallet icon for logo display
import { Wallet } from "lucide-react";

// Import toast for showing notification messages (success/error)
import toast from "react-hot-toast";

// Register Component - Allows new users to create an account
const Register = () => {
  // State to store user's full name input value
  const [name, setName] = useState("");

  // State to store user's email input value
  const [email, setEmail] = useState("");

  // State to store user's password input value
  const [password, setPassword] = useState("");

  // State to store password confirmation input value (for validation)
  const [confirmPassword, setConfirmPassword] = useState("");

  // State to track loading status - disables button and shows "Creating account..." text
  const [loading, setLoading] = useState(false);

  // Destructure register function and user data from authentication context
  // register function handles the actual account creation logic
  // user contains current logged-in user (null if not logged in)
  const { register, user } = useAuth();

  // Hook to programmatically navigate to different routes after successful registration
  const navigate = useNavigate();

  // useEffect runs when component mounts or when 'user' changes
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    // Check if user is authenticated
    if (user) {
      // Redirect to dashboard page (already logged in users shouldn't see register page)
      navigate("/dashboard");
    }
  }, [user, navigate]); // Re-run when 'user' or 'navigate' changes

  // Handle form submission when user clicks "Create Account" button or presses Enter
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent browser default form submission (page refresh)

    // VALIDATION 1: Check if password and confirm password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match"); // Show error toast
      return; // Stop form submission
    }

    // VALIDATION 2: Check if password meets minimum length requirement
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters"); // Show error toast
      return; // Stop form submission
    }

    setLoading(true); // Show loading state on button, disable button

    try {
      // Call register function from AuthContext with name, email, and password
      // This sends user data to backend, creates account, receives token, and stores it
      await register(name, email, password);

      // Show success toast notification
      toast.success("Account created successfully!");

      // Note: User is automatically redirected to dashboard by the useEffect above
      // because 'user' state becomes populated after successful registration
    } catch (error) {
      // Show error toast with message from server or default message
      // error.response?.data?.message gets the error message from backend API
      // Common errors: email already exists, validation errors, etc.
      toast.error(error.response?.data?.message || "Registration failed");
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
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          {/* Subtitle description */}
          <p className="text-gray-400 mt-2">
            Start tracking your expenses today
          </p>
        </div>

        {/* Registration Form Card - Dark card with shadow and rounded corners */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Form - handles user input submission */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text" // Text input for name
                required // Browser will validate this field
                value={name} // Controlled component - value from state
                onChange={(e) => setName(e.target.value)} // Update state on change
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                placeholder="John Doe"
              />
            </div>

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
              {/* Hint for password requirements */}
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password" // Hides characters as user types
                required // Browser will validate this field
                value={confirmPassword} // Controlled component - value from state
                onChange={(e) => setConfirmPassword(e.target.value)} // Update state on change
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer - Link to Login page for existing users */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Export Register component for use in routing (App.jsx or main router file)
export default Register;

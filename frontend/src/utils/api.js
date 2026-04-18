// Import axios library for making HTTP requests to backend
import axios from 'axios';

// Import toast for showing notification messages to users
import toast from 'react-hot-toast';

// Create a custom axios instance with default configuration
// This instance will be used for all API calls in the app
const api = axios.create({
  baseURL: '/api',     // All requests will be prefixed with '/api'
  // Example: 'transactions' becomes '/api/transactions'
  headers: {
    'Content-Type': 'application/json'  // Send and receive data as JSON
  }
});

// ============================================
// REQUEST INTERCEPTOR - Runs BEFORE every API request
// ============================================
// Purpose: Automatically add authentication token to every request
api.interceptors.request.use(
  // Success function - called when request is ready to be sent
  (config) => {
    // Get the authentication token from browser's localStorage
    // Token is saved there after user successfully logs in
    const token = localStorage.getItem('token');

    // If token exists (user is logged in), add it to request headers
    if (token) {
      // 'Bearer' is the standard format for JWT tokens
      // Example: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the modified config so request can continue
    return config;
  },
  // Error function - called if request configuration fails
  (error) => {
    // Pass the error to the calling code (don't hide it)
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR - Runs AFTER every API response
// ============================================
// Purpose: Handle authentication errors globally (401 Unauthorized)
api.interceptors.response.use(
  // Success function - called when server responds with 2xx status codes
  (response) => {
    // Just return the response as-is for successful requests
    return response;
  },
  // Error function - called when server responds with error status (4xx, 5xx)
  (error) => {
    // Check if error is "Unauthorized" (401 status code)
    // error.response?.status uses optional chaining to safely access status
    if (error.response?.status === 401) {
      // 401 means: Token is missing, invalid, or expired

      // Clear stored authentication data from localStorage
      localStorage.removeItem('token');   // Remove the expired token
      localStorage.removeItem('user');    // Remove stored user data

      // Redirect user to login page
      // window.location.href causes full page reload (not React navigation)
      window.location.href = '/login';

      // Show error notification to user
      toast.error('Session expired. Please login again.');
    }

    // Always reject the promise so calling code knows there was an error
    return Promise.reject(error);
  }
);

// Export the configured axios instance for use in other files
// Other files will import and use this instead of plain axios
export default api;
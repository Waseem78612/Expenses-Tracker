import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PrivateRoute = () => {
  // Debug: Check what useAuth returns
  const auth = useAuth();
  console.log("useAuth returned:", auth);

  // Safety check - if auth is undefined, show error
  if (!auth) {
    console.error(
      "Auth context is not available! Make sure AuthProvider is wrapping this component.",
    );
    return (
      <div>Error: Authentication not initialized. Please refresh the page.</div>
    );
  }

  const { user, loading } = auth;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

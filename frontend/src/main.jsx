// Import StrictMode - a tool for highlighting potential problems in the application (runs extra checks in development)
import { StrictMode } from "react";

// Import createRoot - the modern way to render React apps (replaces ReactDOM.render)
import { createRoot } from "react-dom/client";

// Import global CSS styles (Tailwind + custom styles)
import "./App.css";

// Import the main App component - root of the application
import App from "./App.jsx";

// Import AuthProvider - provides authentication state (user, login, logout) to entire app
import { AuthProvider } from "./Context/AuthContext.jsx";

// Import ThemeProvider - provides theme state (dark/light mode) to entire app
import { ThemeProvider } from "./Context/ThemeContext.jsx";

// Find the root DOM element (div with id="root" in index.html) and create a React root
createRoot(document.getElementById("root")).render(
  // StrictMode - wraps app to detect issues (runs only in development, not production)
  <StrictMode>
    {/* ThemeProvider - must be outermost to provide theme to all components including AuthProvider */}
    <ThemeProvider>
      {/* AuthProvider - provides authentication to App and all child components */}
      <AuthProvider>
        {/* App - main application component containing all routes and pages */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);

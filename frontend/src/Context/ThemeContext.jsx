// Import React hooks for creating context, consuming context, state management, and side effects
import { createContext, useContext, useState, useEffect } from "react";

// Create a Context object that will hold the theme data
// This creates a container that can be used to share theme across components
const ThemeContext = createContext();

// Custom hook for consuming the theme context
// This makes it easy for any component to access the theme value
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component - wraps around parts of the app that need theme access
// It receives 'children' prop (the components inside this provider)
export const ThemeProvider = ({ children }) => {
  // Force dark mode - useState with "dark" as the only value (no toggle functionality)
  // theme is set to "dark" and will never change
  const [theme] = useState("dark");

  // useEffect runs once when component mounts (empty dependency array [])
  useEffect(() => {
    // Get references to the html and body elements
    const html = document.documentElement; // <html> tag
    const body = document.body; // <body> tag

    // Add CSS class 'dark' to html element (used by Tailwind CSS)
    html.classList.add("dark");

    // Set background color of html element
    html.style.backgroundColor = "#111827"; // Dark gray color

    // Set body background color
    body.style.backgroundColor = "#111827"; // Same dark gray

    // Set body text color
    body.style.color = "#f9fafb"; // Off-white/light gray

    // Ensure body takes full viewport height
    body.style.minHeight = "100vh";

    // Set CSS custom properties (variables) for use throughout the app
    html.style.setProperty("--bg-primary", "#111827"); // Primary background
    html.style.setProperty("--bg-secondary", "#1f2937"); // Secondary background
    html.style.setProperty("--text-primary", "#f9fafb"); // Primary text color
    html.style.setProperty("--text-secondary", "#9ca3af"); // Secondary text (gray)
    html.style.setProperty("--border-color", "#374151"); // Border color

    // Cleanup function - runs when component unmounts
    // Currently empty, but could be used to remove styles if needed
    return () => {
      // Cleanup would go here (e.g., remove classes, reset styles)
    };
  }, []); // Empty array = run only once when component mounts

  // Provide the theme value to all child components
  // The value object contains the theme (currently only "dark")
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children} {/* Render all child components */}
    </ThemeContext.Provider>
  );
};

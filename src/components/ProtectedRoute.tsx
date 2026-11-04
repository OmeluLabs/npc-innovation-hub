/**
 * Protected Route Component
 *
 * Wrapper component that protects routes requiring authentication.
 * Redirects unauthenticated users to login page.
 * Can also restrict access based on user roles.
 * Place in: src/components/ProtectedRoute.tsx (NEW FILE)
 *
 * @example
 * ```tsx
 * // In your routes file
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * // With role restriction
 * <Route
 *   path="/admin"
 *   element={
 *     <ProtectedRoute requiredRole="Admin">
 *       <AdminPanel />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <TriangleAlert
            className="mx-auto mb-4 h-12 w-12 text-red-500"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Required role: <span className="font-semibold">{requiredRole}</span>
            <br />
            Your role: <span className="font-semibold">{user?.role}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has correct role (if required)
  return <>{children}</>;
};

/**
 * Public Route Component
 *
 * Redirects authenticated users away from public-only pages (like login/signup).
 * Useful for preventing logged-in users from accessing login page.
 *
 * @example
 * ```tsx
 * <Route
 *   path="/login"
 *   element={
 *     <PublicRoute>
 *       <LoginPage />
 *     </PublicRoute>
 *   }
 * />
 * ```
 */
export const PublicRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = "/dashboard" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

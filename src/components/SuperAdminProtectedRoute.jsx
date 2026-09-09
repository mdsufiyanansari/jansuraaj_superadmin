import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const SuperAdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSuperAdminAuth = async () => {
      try {
        const sessionLogin = sessionStorage.getItem(
          "super_admin_logged_in"
        );

        // Current browser tab/session me login nahi hai
        if (sessionLogin !== "true") {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
          console.error("VITE_BACKEND_URL is missing");
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${backendUrl}/api/super-admin/auth/me`,
          {
            withCredentials: true,
          }
        );

        if (response.data?.success) {
          setAuthenticated(true);
        } else {
          sessionStorage.removeItem(
            "super_admin_logged_in"
          );
          setAuthenticated(false);
        }
      } catch (error) {
        console.error(
          "Super Admin authentication failed:",
          error.response?.data || error.message
        );

        sessionStorage.removeItem(
          "super_admin_logged_in"
        );

        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSuperAdminAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-3 text-sm text-slate-500">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/super-admin/login"
        replace
      />
    );
  }

  return children;
};

export default SuperAdminProtectedRoute;
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SuperAdminLogout = ({ onLogout }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      // Backend logout
      if (backendUrl) {
        await axios.post(
          `${backendUrl}/api/super-admin/auth/logout`,
          {},
          {
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error(
        "Super Admin logout error:",
        error.response?.data || error.message
      );
    } finally {
      // Browser session clear
      sessionStorage.removeItem("super_admin_logged_in");

      // Parent component ko inform karo
      if (onLogout) {
        onLogout();
      }

      // Login page par bhejo
      navigate("/super-admin/login", {
        replace: true,
      });

      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full 
      items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="grid w-5 place-items-center text-base">↪</span>

      {loading ? "Locking..." : "Lock"}
    </button>
  );
};

export default SuperAdminLogout;

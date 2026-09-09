import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SuperAdminLogin = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // SUPER ADMIN LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // ======================================
    // PASSWORD VALIDATION
    // ======================================

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        setError("Backend URL is not configured.");
        setLoading(false);
        return;
      }

      // ======================================
      // LOGIN API
      // ======================================

      const response = await axios.post(
        `${backendUrl}/api/super-admin/auth/login`,
        {
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      // ======================================
      // LOGIN SUCCESS
      // ======================================

      if (response.data?.success) {
        /*
          Important:
          Ye current browser tab/session ke login ko
          remember karega.

          Refresh -> login rahega
          Tab close -> sessionStorage clear ho jayega
        */
        sessionStorage.setItem(
          "super_admin_logged_in",
          "true"
        );

        // Dashboard par redirect
        navigate("/super-admin", {
          replace: true,
        });

        return;
      }

      // ======================================
      // LOGIN FAILED
      // ======================================

      setError(
        response.data?.message ||
          "Login failed. Please try again."
      );
    } catch (error) {
      console.error(
        "Super Admin login error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Invalid password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* ==================================
            LOGIN CARD
        ================================== */}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-7 sm:p-8">

          {/* ==================================
              HEADER
          ================================== */}

          <div className="text-center mb-8">

            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center">

              <svg
                className="w-8 h-8 text-sky-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.5 12l1.7 1.7 3.8-4"
                />
              </svg>

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Super Admin
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Enter your password to continue
            </p>

          </div>

          {/* ==================================
              ERROR MESSAGE
          ================================== */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

              <svg
                className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />

                <path
                  strokeLinecap="round"
                  d="M12 8v4"
                />

                <path
                  strokeLinecap="round"
                  d="M12 16h.01"
                />
              </svg>

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>
          )}

          {/* ==================================
              FORM
          ================================== */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>

              <div className="relative">

                {/* LOCK ICON */}

                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">

                  <svg
                    className="w-5 h-5 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                    />

                    <path
                      strokeLinecap="round"
                      d="M8 10V7a4 4 0 018 0v3"
                    />
                  </svg>

                </div>

                {/* PASSWORD INPUT */}

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-12 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

                {/* SHOW / HIDE PASSWORD */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.6 10.6a2 2 0 002.8 2.8"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.9 4.3A10.8 10.8 0 0112 4c5 0 8.5 4 9.5 8-.4 1.6-1.3 3.1-2.5 4.3"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.2 6.2C4.5 7.5 3.4 9.3 2.5 12c1 4 4.5 8 9.5 8 1.8 0 3.4-.5 4.8-1.3"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  )}

                </button>

              </div>

            </div>

            {/* ==================================
                LOGIN BUTTON
            ================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.3"
                    />

                    <path
                      d="M21 12a9 9 0 00-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>

                  Unlocking...

                </span>
              ) : (
                "Un_Lock 🔓"
              )}

            </button>

          </form>

          {/* ==================================
              SECURITY NOTE
          ================================== */}

          <div className="mt-6 pt-5 border-t border-slate-100">

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">

              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                />

                <path
                  strokeLinecap="round"
                  d="M8 10V7a4 4 0 018 0v3"
                />
              </svg>

              Secure Admin Access

            </div>

          </div>

        </div>

        {/* ==================================
            FOOTER
        ================================== */}

        <p className="text-center text-xs text-slate-400 mt-5">
          Authorized personnel only
        </p>

      </div>
    </div>
  );
};

export default SuperAdminLogin;
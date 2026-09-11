import { useEffect, useMemo, useState } from "react";
import axios from "axios";

// ==========================================
// STATUS BADGE
// ==========================================
function StatusBadge({ status }) {
  const styles = {
    Active: "border-success-200 bg-success-50 text-success-700",

    Review: "border-warning-200 bg-warning-50 text-warning-700",

    Inactive: "border-slate-200 bg-slate-50 text-slate-500",
  };

  const dot =
    status === "Active"
      ? "active bg-success-500"
      : status === "Review"
      ? "review bg-warning-500"
      : "bg-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] || styles.Inactive
      }`}
    >
      <span className={`status-dot relative h-2 w-2 rounded-full ${dot}`} />

      {status}
    </span>
  );
}

// ==========================================
// METRIC CARD
// ==========================================
function MetricCard({ metric, index }) {
  const border =
    metric.tone === "saffron"
      ? "border-saffron-500"
      : metric.tone === "success"
      ? "border-success-500"
      : metric.tone === "slate"
      ? "border-slate-500"
      : "border-brand-600";

  const icon =
    metric.tone === "saffron"
      ? "bg-saffron-50 text-saffron-600"
      : metric.tone === "success"
      ? "bg-success-50 text-success-600"
      : metric.tone === "slate"
      ? "bg-slate-100 text-slate-600"
      : "bg-brand-50 text-brand-700";

  return (
    <div
      className={`animate-fade-in-up stagger-${
        index + 1
      } relative overflow-hidden rounded-2xl border border-slate-200 border-t-4 ${border} bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {metric.label}
          </p>

          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {metric.value}
          </p>

          <p className="mt-1 text-xs text-slate-400">{metric.description}</p>
        </div>

        <span
          className={`grid h-12 w-12 place-items-center rounded-xl text-xl ${icon}`}
        >
          {metric.icon}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            metric.tone === "slate"
              ? "bg-success-50 text-success-700"
              : metric.tone === "saffron"
              ? "bg-saffron-50 text-saffron-700"
              : "bg-success-50 text-success-700"
          }`}
        >
          {metric.change.startsWith("−") ? "↓" : "↑"} {metric.change}
        </span>

        <span className="text-xs text-slate-400">vs last month</span>
      </div>
    </div>
  );
}

// ==========================================
// USER ROW
// ==========================================
function UserRow({ user, index }) {
  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const location = [user.ward, user.localBody, user.district]
    .filter(Boolean)
    .join(", ");

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "-";
  return (
    <tr
      className="animate-fade-in border-b border-slate-50 opacity-0 transition hover:bg-brand-50/50"
      style={{
        animationDelay: `${index * 0.05}s`,
        animationFillMode: "forwards",
      }}
    >
      {/* =========================
          CITIZEN
      ========================= */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-brand-600 to-analytics-600 p-0.5">
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white text-xs font-bold text-brand-700">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </span>
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              {user.name || "Unknown User"}
            </p>

            <p className="text-xs text-slate-400">ID: {user._id}</p>
          </div>
        </div>
      </td>

      {/* =========================
          CONTACT
      ========================= */}
      <td className="px-6 py-4 text-slate-600">{user.phone || "—"}</td>

      {/* =========================
          LOCATION
      ========================= */}
      <td className="px-6 py-4 text-slate-600">{location || "—"}</td>

      {/* =========================
          ISSUES
      ========================= */}
      <td className="px-6 py-4">
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-sm font-bold text-slate-700">
          {user.issueCount || 0}
        </span>

        <span className="ml-2 text-xs text-slate-400">reported</span>
      </td>

      {/* =========================
          JOINED
      ========================= */}
      <td className="px-6 py-4 text-sm text-slate-500">{joined}</td>

      {/* =========================
          STATUS
      ========================= */}
      <td className="px-6 py-4">
        <StatusBadge status="Active" />
      </td>

      {/* =========================
          MENU
      ========================= */}
      <td className="px-6 py-4 text-right text-slate-400">•••</td>
    </tr>
  );
}

// ==========================================
// USERS PAGE
// ==========================================
export default function Users() {
  const [users, setUsers] = useState([]);

  const [query, setQuery] = useState("");

  const [status, setStatus] = useState("All users");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // FETCH USERS + PROBLEMS
  // ==========================================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
          throw new Error("VITE_BACKEND_URL is not configured");
        }

        // ======================================
        // USERS API + PROBLEMS API
        // ======================================
        const [usersResponse, problemsResponse] = await Promise.all([
          axios.get(`${backendUrl}/api/admin/users`, {
            withCredentials: true,
          }),
          axios.get(`${backendUrl}/api/admin/problems`, {
            withCredentials: true,
          }),
        ]);

        // ======================================
        // CHECK USERS RESPONSE
        // ======================================
        if (!usersResponse.data?.success) {
          setError(usersResponse.data?.message || "Failed to load users");
          return;
        }

        // ======================================
        // USERS DATA
        // ======================================
        const usersData = Array.isArray(usersResponse.data?.users)
          ? usersResponse.data.users
          : [];

        // ======================================
        // PROBLEMS DATA
        // ======================================
        const problemsData =
          problemsResponse.data?.success &&
          Array.isArray(problemsResponse.data?.problems)
            ? problemsResponse.data.problems
            : [];

        // ======================================
        // ADD ISSUE COUNT TO EVERY USER
        // ======================================
        const usersWithIssueCount = usersData.map((user) => {
          const userId = user._id?.toString();

          const issueCount = problemsData.filter((problem) => {
            const createdBy = problem.createdBy;

            // createdBy populated object ho
            // ya direct ObjectId/string ho
            const createdById =
              typeof createdBy === "object" && createdBy !== null
                ? (createdBy._id || createdBy.id)?.toString()
                : createdBy?.toString();

            return createdById === userId;
          }).length;

          return {
            ...user,
            issueCount,
          };
        });

        // ======================================
        // SET USERS
        // ======================================
        setUsers(usersWithIssueCount);
      } catch (error) {
        console.error(
          "Fetch users error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ==========================================
  // FILTER USERS
  // ==========================================
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchableText = [
        user.name,
        user.phone,
        user.district,
        user.localBody,
        user.ward,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = searchableText.includes(query.toLowerCase());

      const userStatus = "Active";

      const matchesStatus = status === "All users" || userStatus === status;

      return matchesQuery && matchesStatus;
    });
  }, [users, query, status]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================
  const clearFilters = () => {
    setQuery("");
    setStatus("All users");
    setCurrentPage(1);
  };

  // ==========================================
  // METRICS
  // ==========================================
  const metrics = [
    {
      label: "Total Users",
      value: users.length.toLocaleString("en-IN"),
      change: "—",
      description: "Registered citizens",
      tone: "brand",
      icon: "♙",
    },
    {
      label: "Active This Month",
      value: "—",
      change: "—",
      description: "Not available yet",
      tone: "saffron",
      icon: "⚡",
    },
    {
      label: "New Registrations",
      value: "—",
      change: "—",
      description: "Not available yet",
      tone: "success",
      icon: "↗️",
    },
    {
      label: "Incomplete Profiles",
      value: "—",
      change: "—",
      description: "Not available yet",
      tone: "slate",
      icon: "▤",
    },
  ];

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-700">
            Loading users...
          </div>

          <p className="mt-2 text-sm text-slate-400">Please wait</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Failed to load users
          </h2>

          <p className="mt-2 text-sm text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-50 via-brand-50/40 to-analytics-50 px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="animate-fade-in-up flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-brand-700 to-analytics-600" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
                Bihar / Directory
              </p>
            </div>

            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
              Users
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Manage citizens, track participation, and monitor profile quality
              across all wards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
            >
              ↓ Export
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-brand-500/30"
            >
              ＋ Add User
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </section>

        <section className="animate-fade-in-up stagger-5 mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50 p-6 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Citizen Directory
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Search, filter and review all registered users.
                </p>
              </div>

              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
                {filteredUsers.length} results
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>

                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name, mobile number or ward..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                />

                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {["All users", "Active", "Review", "Inactive"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setStatus(item);
                      setCurrentPage(1);
                    }}
                    className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                      status === item
                        ? "border-brand-200 bg-brand-50 text-brand-700 shadow-sm"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {[
                    "Citizen",
                    "Contact",
                    "Location",
                    "Issues",
                    "Joined",
                    "Status",
                    "",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => (
                  <UserRow key={user._id} user={user} index={index} />
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-3xl text-slate-400">
                  ⌕
                </span>

                <p className="mt-4 text-sm font-medium text-slate-600">
                  No users found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try adjusting your search or filter criteria
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-100"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {filteredUsers.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <span className="text-xs text-slate-500">
                Showing <b className="text-slate-700">{filteredUsers.length}</b>{" "}
                of <b className="text-slate-700">{users.length}</b> users
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"
                >
                  ‹
                </button>

                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold ${
                      currentPage === page
                        ? "bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-lg"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

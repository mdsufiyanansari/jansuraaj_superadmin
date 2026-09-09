import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import PageFrame, { Panel, Stat } from "../components/PageFrame";

export default function Issues() {
  // ==========================================
  // STATE
  // ==========================================

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // ==========================================
  // FETCH ISSUES FROM BACKEND
  // GET /api/admin/problems
  // ==========================================

  useEffect(() => {
    const fetchIssues = async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        setError("");

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
          setError("Backend URL is not configured.");
          return;
        }

        const response = await axios.get(`${backendUrl}/api/admin/problems`, {
          withCredentials: true,
        });

        if (response.data?.success) {
          setIssues(response.data.problems || []);
        } else {
          setError(response.data?.message || "Failed to load issues.");
        }
      } catch (error) {
        console.error(
          "Admin issues fetch error:",
          error.response?.data || error.message
        );

        setError(error.response?.data?.message || "Failed to load issues.");
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    };

    // ==========================================
    // FIRST LOAD
    // ==========================================

    fetchIssues(true);

    // ==========================================
    // AUTO REFRESH STATUS
    // Every 5 seconds
    // ==========================================

    const interval = setInterval(() => {
      fetchIssues(false);
    }, 5000);

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // REAL ISSUE COUNTS
  // ==========================================

  const totalIssues = issues.length;

  const pendingIssues = issues.filter(
    (issue) => String(issue.status || "").toLowerCase() === "pending"
  ).length;

  const resolvedIssues = issues.filter(
    (issue) => String(issue.status || "").toLowerCase() === "resolved"
  ).length;

  // ==========================================
  // FORMAT ISSUE DATE & TIME
  // ==========================================

  const formatIssueDateTime = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <PageFrame
      title="Issues"
      description="Track every public issue from registration to resolution."
      action="＋ Register issue"
    >
      {/* ======================================
          ISSUE STATS
      ====================================== */}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total issues" value={totalIssues} change="" />

        <Stat label="Pending" value={pendingIssues} change="" />

        <Stat label="Resolved" value={resolvedIssues} />
      </div>

      {/* ======================================
          ISSUE QUEUE
      ====================================== */}

      <Panel title="Issue queue" subtitle="Prioritise and assign work">
        {/* ====================================
            FILTER BUTTONS
        ==================================== */}

        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg bg-[#e5f4f0] px-3 py-2 text-xs font-bold text-[#08776d]">
            All issues
          </button>

          <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">
            Critical
          </button>

          <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">
            Pending &gt; 7 days
          </button>

          <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">
            Missing data
          </button>
        </div>

        {/* ====================================
            LOADING
        ==================================== */}

        {loading && (
          <div className="mt-5 text-sm text-slate-500">Loading issues...</div>
        )}

        {/* ====================================
            ERROR
        ==================================== */}

        {error && <div className="mt-5 text-sm text-red-600">{error}</div>}

        {/* ====================================
            NO ISSUES
        ==================================== */}

        {!loading && !error && issues.length === 0 && (
          <div className="mt-5 text-sm text-slate-500">No issues found.</div>
        )}

        {/* ====================================
            ISSUES FROM BACKEND
        ==================================== */}

        {!loading && !error && issues.length > 0 && (
          <div className="mt-5 space-y-3">
            {issues.map((issue, index) => (
              <div
                key={issue._id || issue.id || index}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-4"
              >
                {/* =========================
                    ISSUE ID
                ========================= */}

                <span className="text-xs font-bold text-slate-400">
                  #{issue._id ? issue._id.slice(-6) : index + 1}
                </span>

                {/* =========================
                    TITLE + LOCATION +
                    DESCRIPTION
                ========================= */}

                <div className="min-w-32 flex-1">
                  {/* TITLE */}

                  <div className="font-semibold">
                    {issue.category || issue.title || "Unknown issue"}

                    {/* LOCATION */}

                    <small className="ml-2 font-normal text-slate-400">
                      {issue.ward ? `Ward ${issue.ward}` : ""}

                      {issue.district ? ` · ${issue.district}` : ""}
                    </small>
                  </div>

                  {/* DESCRIPTION */}

                  <p className="mt-1 text-xs font-normal leading-5 text-slate-500">
                    {issue.description ||
                      issue.problemDescription ||
                      issue.details ||
                      issue.problemDetails ||
                      "No description provided"}
                  </p>

                  {/* ISSUE DATE & TIME */}

                  <p className="mt-2 text-xs text-slate-400">
                    Reported on {formatIssueDateTime(issue.createdAt)}
                  </p>
                </div>

                {/* =========================
                    PRIORITY
                ========================= */}

                <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">
                  {issue.priority || "Normal"}
                </span>

                {/* =========================
                    STATUS
                ========================= */}

                <span className="text-xs text-slate-500">
                  {issue.status || "Pending"}
                </span>

                {/* =========================
                    VIEW DETAILS BUTTON
                ========================= */}

                <Link
                  to={`/issues/${issue._id || issue.id}`}
                  className="rounded-lg bg-[#0b766d] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#095f58]"
                >
                  View Details
                </Link>

                {/* =========================
                    ARROW
                ========================= */}

                <span className="text-slate-300">›</span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </PageFrame>
  );
}

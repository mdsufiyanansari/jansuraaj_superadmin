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
// DELETE ISSUE STATE
// ==========================================

const [deleteIssue, setDeleteIssue] = useState(null);
const [deletionReason, setDeletionReason] = useState("");
const [deleteLoading, setDeleteLoading] = useState(false);
const [deleteError, setDeleteError] = useState("");
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
// DELETE ISSUE
// DELETE /api/admin/problems/:id
// ==========================================

const handleDeleteIssue = async () => {
  if (!deleteIssue?._id) {
    return;
  }

  if (!deletionReason.trim()) {
    setDeleteError("Please enter a deletion reason.");
    return;
  }

  try {
    setDeleteLoading(true);
    setDeleteError("");

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
      setDeleteError(
        "Backend URL is not configured."
      );
      return;
    }

    const response = await axios.delete(
      `${backendUrl}/api/admin/problems/${deleteIssue._id}`,
      {
        data: {
          deletionReason: deletionReason.trim(),
        },
        withCredentials: true,
      }
    );

    if (response.data?.success) {
      // ======================================
      // REMOVE FROM CURRENT LIST
      // ======================================

      setIssues((currentIssues) =>
        currentIssues.filter(
          (issue) =>
            issue._id !== deleteIssue._id
        )
      );

      // ======================================
      // CLOSE MODAL
      // ======================================

      setDeleteIssue(null);
      setDeletionReason("");
      setDeleteError("");
    } else {
      setDeleteError(
        response.data?.message ||
          "Failed to delete issue."
      );
    }
  } catch (error) {
    console.error(
      "Delete issue error:",
      error.response?.data ||
        error.message
    );

    setDeleteError(
      error.response?.data?.message ||
        "Failed to delete issue."
    );
  } finally {
    setDeleteLoading(false);
  }
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

                <button
  type="button"
  onClick={() => {
    setDeleteIssue(issue);
    setDeletionReason("");
    setDeleteError("");
  }}
  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
>
  🗑 Delete
</button>

                {/* =========================
                    ARROW
                ========================= */}

                <span className="text-slate-300">›</span>
              </div>
            ))}
          </div>
        )}
      </Panel>
  {/* ==========================================
    DELETE CONFIRMATION MODAL
========================================== */}

{deleteIssue && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">

    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">

      {/* HEADER */}

      <div className="flex items-start gap-4">

        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-red-50 text-xl">
          🗑️
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Delete Issue
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Are you sure you want to remove this issue?
          </p>
        </div>

      </div>

      {/* ISSUE INFO */}

      <div className="mt-5 rounded-xl bg-slate-50 p-4">

        <p className="text-xs font-bold text-slate-400">
          ISSUE
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {deleteIssue.category ||
            deleteIssue.title ||
            "Unknown issue"}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {deleteIssue.description ||
            "No description provided"}
        </p>

      </div>

      {/* REASON */}

      <div className="mt-5">

        <label
          htmlFor="deletion-reason"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Reason for deletion
        </label>

        <textarea
          id="deletion-reason"
          value={deletionReason}
          onChange={(e) => {
            setDeletionReason(e.target.value);
            setDeleteError("");
          }}
          rows={3}
          maxLength={500}
          placeholder="Enter reason for deleting this issue..."
          className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />

        <p className="mt-1 text-right text-xs text-slate-400">
          {deletionReason.length}/500
        </p>

      </div>

      {/* ERROR */}

      {deleteError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {deleteError}
        </div>
      )}

      {/* BUTTONS */}

      <div className="mt-6 flex justify-end gap-3">

        <button
          type="button"
          disabled={deleteLoading}
          onClick={() => {
            setDeleteIssue(null);
            setDeletionReason("");
            setDeleteError("");
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={
            deleteLoading ||
            !deletionReason.trim()
          }
          onClick={handleDeleteIssue}
          className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleteLoading
            ? "Deleting..."
            : "Delete Issue"}
        </button>

      </div>

    </div>

  </div>
)}

    </PageFrame>
  );
}

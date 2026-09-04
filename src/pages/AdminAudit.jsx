import { useEffect, useState } from "react";
import PageFrame, { Panel } from "../components/PageFrame";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminAudit() {
  // ==================================
  // Ward Heads
  // ==================================

  const [wardHeads, setWardHeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [processingId, setProcessingId] =
    useState(null);

  // ==================================
  // Fetch Pending Ward Heads
  // ==================================

  const fetchPendingWardHeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BACKEND_URL}/api/super-admin/ward-heads/pending`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load Ward Head requests"
        );
      }

      setWardHeads(
        data.wardHeads || []
      );
    } catch (error) {
      console.error(
        "Fetch Pending Ward Heads Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load Ward Head requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================
  // Load Data
  // ==================================

  useEffect(() => {
    fetchPendingWardHeads();
  }, []);

  // ==================================
  // Approve Ward Head
  // ==================================

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${BACKEND_URL}/api/super-admin/ward-heads/${id}/approve`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to approve Ward Head"
        );
      }

      setMessage(
        data.message ||
          "Ward Head approved successfully"
      );

      // Remove approved Ward Head
      // from pending list

      setWardHeads((previous) =>
        previous.filter(
          (wardHead) =>
            wardHead._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Approve Ward Head Error:",
        error
      );

      setError(
        error.message ||
          "Unable to approve Ward Head"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==================================
  // Reject Ward Head
  // ==================================

  const handleReject = async (id) => {
    const rejectionReason =
      window.prompt(
        "Enter rejection reason"
      );

    if (
      rejectionReason === null
    ) {
      return;
    }

    if (
      !rejectionReason.trim()
    ) {
      setError(
        "Rejection reason is required"
      );

      return;
    }

    try {
      setProcessingId(id);

      setError("");
      setMessage("");

      const response = await fetch(
        `${BACKEND_URL}/api/super-admin/ward-heads/${id}/reject`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            rejectionReason:
              rejectionReason.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to reject Ward Head"
        );
      }

      setMessage(
        data.message ||
          "Ward Head rejected successfully"
      );

      // Remove rejected Ward Head
      // from pending list

      setWardHeads((previous) =>
        previous.filter(
          (wardHead) =>
            wardHead._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Reject Ward Head Error:",
        error
      );

      setError(
        error.message ||
          "Unable to reject Ward Head"
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <PageFrame
      title="Admin & Audit"
      description="Manage access, Ward Head approvals and administrative activity."
      action="＋ Invite admin"
    >
      {/* ================================== */}
      {/* Success Message */}
      {/* ================================== */}

      {message && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {/* ================================== */}
      {/* Error Message */}
      {/* ================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ================================== */}
      {/* Ward Head Approval Panel */}
      {/* ================================== */}

      <Panel
        title="Ward Head Approval Requests"
        subtitle="Review pending Ward Head registration requests."
      >
        {/* ================================== */}
        {/* Header */}
        {/* ================================== */}

        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Pending Requests
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Super Admin approval is required before Ward Heads can access the admin panel.
            </p>
          </div>

          <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
            {wardHeads.length} Pending
          </div>
        </div>

        {/* ================================== */}
        {/* Loading */}
        {/* ================================== */}

        {loading && (
          <div className="py-10 text-center text-sm text-slate-400">
            Loading Ward Head requests...
          </div>
        )}

        {/* ================================== */}
        {/* Empty State */}
        {/* ================================== */}

        {!loading &&
          wardHeads.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
              <p className="text-sm font-semibold text-slate-600">
                No pending Ward Head requests
              </p>

              <p className="mt-1 text-xs text-slate-400">
                New registration requests will appear here.
              </p>
            </div>
          )}

        {/* ================================== */}
        {/* Ward Head List */}
        {/* ================================== */}

        <div className="space-y-4">
          {wardHeads.map(
            (wardHead) => (
              <div
                key={wardHead._id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* ============================== */}
                  {/* Ward Head Details */}
                  {/* ============================== */}

                  <div className="flex items-start gap-4">

                    {/* Avatar */}

                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e5f4f0] text-sm font-bold text-[#08776d]">
                      {wardHead.name
                        ?.split(" ")
                        .map(
                          (word) =>
                            word[0]
                        )
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>

                      {/* Name */}

                      <h3 className="text-sm font-bold text-slate-900">
                        {wardHead.name}
                      </h3>

                      {/* Phone */}

                      <p className="mt-1 text-xs text-slate-500">
                        📞 {wardHead.phone}
                      </p>

                      {/* Location */}

                      <div className="mt-3 flex flex-wrap gap-2">

                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                          {wardHead.district}
                        </span>

                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                          {wardHead.areaType}
                        </span>

                        {wardHead.localBody && (
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                            {wardHead.localBody}
                          </span>
                        )}

                        {wardHead.block && (
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                            {wardHead.block}
                          </span>
                        )}

                        {wardHead.panchayat && (
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                            {wardHead.panchayat}
                          </span>
                        )}

                        <span className="rounded-lg bg-[#e5f4f0] px-2.5 py-1 text-[11px] font-semibold text-[#08776d]">
                          {wardHead.ward}
                        </span>

                      </div>
                    </div>
                  </div>

                  {/* ============================== */}
                  {/* Actions */}
                  {/* ============================== */}

                  <div className="flex gap-3">

                    {/* Reject */}

                    <button
                      type="button"

                      onClick={() =>
                        handleReject(
                          wardHead._id
                        )
                      }

                      disabled={
                        processingId ===
                        wardHead._id
                      }

                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processingId ===
                      wardHead._id
                        ? "Processing..."
                        : "Reject"}
                    </button>

                    {/* Approve */}

                    <button
                      type="button"

                      onClick={() =>
                        handleApprove(
                          wardHead._id
                        )
                      }

                      disabled={
                        processingId ===
                        wardHead._id
                      }

                      className="rounded-xl bg-[#08776d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#06655d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processingId ===
                      wardHead._id
                        ? "Processing..."
                        : "Approve"}
                    </button>

                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Panel>

      {/* ================================== */}
      {/* Audit Log */}
      {/* ================================== */}

      <div className="mt-6">

        <Panel
          title="Audit Log"
          subtitle="Recent administrative actions"
        >
          <div className="space-y-4">

            {[
              [
                "Rahul Kumar",
                "Changed Issue #1021",
                "Pending → Resolved",
                "10:31 AM",
              ],

              [
                "Amit Verma",
                "Updated User #812",
                "Mobile number changed",
                "10:12 AM",
              ],

              [
                "Neha Singh",
                "Exported issue report",
                "Bihar · August 2026",
                "09:45 AM",
              ],

              [
                "Rahul Kumar",
                "Assigned Ward 07",
                "Operator: Suresh Paswan",
                "Yesterday",
              ],
            ].map(
              (
                [
                  admin,
                  action,
                  detail,
                  time,
                ]
              ) => (
                <div
                  key={
                    time +
                    action
                  }

                  className="flex items-center gap-4 border-b border-slate-100 pb-4"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e5f4f0] text-xs font-bold text-[#08776d]">
                    {admin
                      .split(" ")
                      .map(
                        (word) =>
                          word[0]
                      )
                      .join("")}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {admin}{" "}

                      <span className="font-normal text-slate-500">
                        {action}
                      </span>
                    </p>

                    <p className="text-xs text-slate-400">
                      {detail}
                    </p>
                  </div>

                  <time className="text-xs text-slate-400">
                    {time}
                  </time>
                </div>
              )
            )}

          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}
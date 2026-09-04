import { useEffect, useState } from "react";
import PageFrame, { Panel } from "../components/PageFrame";

const API_URL = "http://localhost:4000";

export default function AdminAudit() {
  // ==================================
  // Ward Head States
  // ==================================

  const [pendingWardHeads, setPendingWardHeads] = useState([]);

  const [approvedWardHeads, setApprovedWardHeads] = useState([]);

  const [rejectedWardHeads, setRejectedWardHeads] = useState([]);

  // ==================================
  // Loading States
  // ==================================

  const [loadingPending, setLoadingPending] = useState(true);

  const [loadingApproved, setLoadingApproved] = useState(true);

  const [loadingRejected, setLoadingRejected] = useState(true);

  // ==================================
  // Action Loading
  // ==================================

  const [actionLoading, setActionLoading] = useState(null);

  // ==================================
  // Error State
  // ==================================

  const [error, setError] = useState("");

  // ==================================
  // Fetch Pending Ward Heads
  // GET
  // /api/super-admin/ward-heads?status=pending
  // ==================================

  const fetchPendingWardHeads = async () => {
    try {
      setLoadingPending(true);

      const response = await fetch(
        `${API_URL}/api/super-admin/ward-heads?status=pending`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to fetch pending Ward Head requests"
        );
      }

      setPendingWardHeads(data.wardHeads || []);
    } catch (error) {
      console.error("Pending Ward Heads Error:", error);

      setError(error.message);
    } finally {
      setLoadingPending(false);
    }
  };

  // ==================================
  // Fetch Approved Ward Heads
  // GET
  // /api/super-admin/ward-heads?status=approved
  // ==================================

  const fetchApprovedWardHeads = async () => {
    try {
      setLoadingApproved(true);

      const response = await fetch(
        `${API_URL}/api/super-admin/ward-heads?status=approved`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch approved Ward Heads");
      }

      setApprovedWardHeads(data.wardHeads || []);
    } catch (error) {
      console.error("Approved Ward Heads Error:", error);

      setError(error.message);
    } finally {
      setLoadingApproved(false);
    }
  };

  // ==================================
  // Fetch Rejected Ward Heads
  // GET
  // /api/super-admin/ward-heads?status=rejected
  // ==================================

  const fetchRejectedWardHeads = async () => {
    try {
      setLoadingRejected(true);

      const response = await fetch(
        `${API_URL}/api/super-admin/ward-heads?status=rejected`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch rejected Ward Heads");
      }

      setRejectedWardHeads(data.wardHeads || []);
    } catch (error) {
      console.error("Rejected Ward Heads Error:", error);

      setError(error.message);
    } finally {
      setLoadingRejected(false);
    }
  };

  // ==================================
  // Load All Ward Head Data
  // ==================================

  const fetchAllWardHeads = async () => {
    setError("");

    await Promise.all([
      fetchPendingWardHeads(),
      fetchApprovedWardHeads(),
      fetchRejectedWardHeads(),
    ]);
  };

  useEffect(() => {
    fetchAllWardHeads();
  }, []);

  // ==================================
  // Approve Ward Head
  // PATCH
  // /api/super-admin/ward-heads/:id/approve
  // ==================================

  const handleApprove = async (wardHead) => {
    const confirmed = window.confirm(
      `Are you sure you want to approve ${wardHead.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setActionLoading(`approve-${wardHead._id}`);

      const response = await fetch(
        `${API_URL}/api/super-admin/ward-heads/${wardHead._id}/approve`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to approve Ward Head");
      }

      // ==================================
      // Refresh All Lists
      // ==================================

      await fetchAllWardHeads();
    } catch (error) {
      console.error("Approve Ward Head Error:", error);

      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ==================================
  // Reject Ward Head
  // PATCH
  // /api/super-admin/ward-heads/:id/reject
  // ==================================

  const handleReject = async (wardHead) => {
    const rejectionReason = window.prompt(
      `Enter rejection reason for ${wardHead.name}:`
    );

    if (rejectionReason === null) {
      return;
    }

    try {
      setError("");

      setActionLoading(`reject-${wardHead._id}`);

      const response = await fetch(
        `${API_URL}/api/super-admin/ward-heads/${wardHead._id}/reject`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            rejectionReason: rejectionReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to reject Ward Head");
      }

      // ==================================
      // Refresh All Lists
      // ==================================

      await fetchAllWardHeads();
    } catch (error) {
      console.error("Reject Ward Head Error:", error);

      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ==================================
  // Date Format
  // ==================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==================================
  // Initials
  // ==================================

  const getInitials = (name) => {
    if (!name) {
      return "WH";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <PageFrame
      title="Admin & Audit"
      description="Manage Ward Head approvals and review administrative actions."
      action="＋ Invite admin"
    >
      {/* ================================== */}
      {/* Error */}
      {/* ================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* ================================== */}
      {/* Pending Ward Head Requests */}
      {/* ================================== */}

      <Panel
        title="Pending Ward Head Requests"
        subtitle={`Total pending requests: ${pendingWardHeads.length}`}
      >
        {loadingPending ? (
          <div className="py-8 text-center text-sm text-slate-400">
            Loading pending Ward Head requests...
          </div>
        ) : pendingWardHeads.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No pending Ward Head requests.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingWardHeads.map((wardHead) => (
              <div
                key={wardHead._id}
                className="flex flex-col gap-4 border-b border-slate-100 pb-4 last:border-b-0 md:flex-row md:items-center"
              >
                {/* Profile */}

                <div className="flex items-center gap-3">
                  {wardHead.photo ? (
                    <img
                      src={wardHead.photo}
                      alt={wardHead.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">
                      {getInitials(wardHead.name)}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {wardHead.name}
                    </p>

                    <p className="text-xs text-slate-400">{wardHead.phone}</p>
                  </div>
                </div>

                {/* Location */}

                <div className="flex-1">
                  <p className="text-sm text-slate-600">
                    {wardHead.district}

                    {wardHead.block && ` • ${wardHead.block}`}

                    {wardHead.panchayat && ` • ${wardHead.panchayat}`}
                  </p>

                  <p className="text-xs text-slate-400">
                    Ward: {wardHead.ward || "N/A"}
                  </p>
                </div>

                {/* Status */}

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">
                    Pending
                  </span>

                  <time className="text-xs text-slate-400">
                    {formatDate(wardHead.createdAt)}
                  </time>
                </div>

                {/* Actions */}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(wardHead)}
                    disabled={actionLoading === `approve-${wardHead._id}`}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading === `approve-${wardHead._id}`
                      ? "Approving..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(wardHead)}
                    disabled={actionLoading === `reject-${wardHead._id}`}
                    className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading === `reject-${wardHead._id}`
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* ================================== */}
      {/* Approved Ward Heads */}
      {/* ================================== */}

      <div className="mt-6">
        <Panel
          title="Approved Ward Heads"
          subtitle={`Total approved Ward Heads: ${approvedWardHeads.length}`}
        >
          {loadingApproved ? (
            <div className="py-8 text-center text-sm text-slate-400">
              Loading approved Ward Heads...
            </div>
          ) : approvedWardHeads.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No approved Ward Heads found.
            </div>
          ) : (
            <div className="space-y-4">
              {approvedWardHeads.map((wardHead) => (
                <div
                  key={wardHead._id}
                  className="flex flex-col gap-4 border-b border-slate-100 pb-4 last:border-b-0 md:flex-row md:items-center"
                >
                  {/* Profile */}

                  <div className="flex items-center gap-3">
                    {wardHead.photo ? (
                      <img
                        src={wardHead.photo}
                        alt={wardHead.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e5f4f0] text-sm font-bold text-[#08776d]">
                        {getInitials(wardHead.name)}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {wardHead.name}
                      </p>

                      <p className="text-xs text-slate-400">{wardHead.phone}</p>
                    </div>
                  </div>

                  {/* Location */}

                  <div className="flex-1">
                    <p className="text-sm text-slate-600">
                      {wardHead.district}

                      {wardHead.block && ` • ${wardHead.block}`}

                      {wardHead.panchayat && ` • ${wardHead.panchayat}`}
                    </p>

                    <p className="text-xs text-slate-400">
                      Ward: {wardHead.ward || "N/A"}
                    </p>
                  </div>

                  {/* Status */}

                  <div className="flex flex-col items-start gap-1 md:items-end">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                      Approved
                    </span>

                    <time className="text-xs text-slate-400">
                      {formatDate(wardHead.updatedAt)}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* ================================== */}
      {/* Rejected Ward Heads */}
      {/* ================================== */}

      <div className="mt-6">
        <Panel
          title="Rejected Ward Heads"
          subtitle={`Total rejected Ward Heads: ${rejectedWardHeads.length}`}
        >
          {loadingRejected ? (
            <div className="py-8 text-center text-sm text-slate-400">
              Loading rejected Ward Heads...
            </div>
          ) : rejectedWardHeads.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No rejected Ward Heads found.
            </div>
          ) : (
            <div className="space-y-4">
              {rejectedWardHeads.map((wardHead) => (
                <div
                  key={wardHead._id}
                  className="flex flex-col gap-4 border-b border-slate-100 pb-4 last:border-b-0 md:flex-row md:items-center"
                >
                  {/* Profile */}

                  <div className="flex items-center gap-3">
                    {wardHead.photo ? (
                      <img
                        src={wardHead.photo}
                        alt={wardHead.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-sm font-bold text-rose-600">
                        {getInitials(wardHead.name)}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {wardHead.name}
                      </p>

                      <p className="text-xs text-slate-400">{wardHead.phone}</p>
                    </div>
                  </div>

                  {/* Location and Reason */}

                  <div className="flex-1">
                    <p className="text-sm text-slate-600">
                      {wardHead.district}

                      {wardHead.block && ` • ${wardHead.block}`}

                      {wardHead.panchayat && ` • ${wardHead.panchayat}`}
                    </p>

                    <p className="mt-1 text-xs text-rose-500">
                      Reason: {wardHead.rejectionReason || "No reason provided"}
                    </p>
                  </div>

                  {/* Status */}

                  <div className="flex flex-col items-start gap-1 md:items-end">
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                      Rejected
                    </span>

                    <time className="text-xs text-slate-400">
                      {formatDate(wardHead.updatedAt)}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </PageFrame>
  );
}

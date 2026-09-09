import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminProtectedRoute from "./components/SuperAdminProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Issues from "./pages/Issues";
import IssueDetails from "./pages/IssueDetails";
import Geography from "./pages/Geography";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import AdminAudit from "./pages/AdminAudit";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================================
            SUPER ADMIN LOGIN
        ========================================== */}

        <Route path="/super-admin/login" element={<SuperAdminLogin />} />

        {/* ==========================================
            SUPER ADMIN PROTECTED AREA
        ========================================== */}

        <Route
          element={
            <SuperAdminProtectedRoute>
              <AdminLayout />
            </SuperAdminProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="users" element={<Users />} />

          <Route path="issues" element={<Issues />} />

          <Route path="issues/:id" element={<IssueDetails />} />

          <Route path="geography" element={<Geography />} />

          <Route path="analytics" element={<Analytics />} />

          <Route path="calendar" element={<Calendar />} />

          <Route path="alerts" element={<Alerts />} />

          <Route path="reports" element={<Reports />} />

          <Route path="admin-audit" element={<AdminAudit />} />

          <Route path="settings" element={<Settings />} />

          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

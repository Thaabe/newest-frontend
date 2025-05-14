// frontend/src/App.jsx

import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PendingApproval from "./pages/auth/PendingApproval";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import PendingApprovals from "./pages/admin/PendingApprovals";

// Lender Pages
import LenderDashboard from "./pages/lender/Dashboard";
import AddLoan from "./pages/lender/AddLoan";
import ViewReports from "./pages/lender/ViewReports";

// Consumer Pages
import ConsumerDashboard from "./pages/consumer/Dashboard";
import ViewReport from "./pages/consumer/ViewReport";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/manage-users"
            element={
              <PrivateRoute
                element={<ManageUsers />}
                allowedRoles={["admin"]}
              />
            }
          />

          <Route
            path="/admin/pending-approvals"
            element={
              <PrivateRoute
                element={<PendingApprovals />}
                allowedRoles={["admin"]}
              />
            }
          />

          {/* Lender Routes */}
          <Route
            path="/lender/dashboard"
            element={
              <PrivateRoute
                element={<LenderDashboard />}
                allowedRoles={["lender"]}
              />
            }
          />
          <Route
            path="/lender/add-loan"
            element={
              <PrivateRoute element={<AddLoan />} allowedRoles={["lender"]} />
            }
          />
          <Route
            path="/lender/view-reports"
            element={
              <PrivateRoute
                element={<ViewReports />}
                allowedRoles={["lender"]}
              />
            }
          />

          {/* Consumer Routes */}
          <Route
            path="/consumer/dashboard"
            element={
              <PrivateRoute
                element={<ConsumerDashboard />}
                allowedRoles={["consumer"]}
              />
            }
          />
          <Route
            path="/consumer/view-report"
            element={
              <PrivateRoute
                element={<ViewReport />}
                allowedRoles={["consumer"]}
              />
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

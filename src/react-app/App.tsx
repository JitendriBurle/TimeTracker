import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@getmocha/users-service/react";

import ProtectedRoute from "@/react-app/components/ProtectedRoute";
import Login from "@/react-app/pages/Login";
import Dashboard from "@/react-app/pages/Dashboard";
import Analytics from "@/react-app/pages/Analytics";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ✅ Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ✅ Public */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics/:date"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

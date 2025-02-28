import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Ephemera from "@/pages/Ephemera";
import Realized from "@/pages/Realized";
import Buried from "@/pages/Buried";
import ProtectedRoute from "@/components/protected-route";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/realized"
        element={
          <ProtectedRoute>
            <Realized />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alive"
        element={
          <ProtectedRoute>
            <Ephemera />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buried"
        element={
          <ProtectedRoute>
            <Buried />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

import type React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

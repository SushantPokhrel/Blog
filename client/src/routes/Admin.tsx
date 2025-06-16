import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
type Props = {
  children: React.ReactNode;
};
const Admin: React.FC<Props> = ({ children }) => {
  const { user } = useAuthContext();
  return user.role === "admin" ? children : <Navigate to="/*" replace />; // replaces the protected route
};

export default Admin;

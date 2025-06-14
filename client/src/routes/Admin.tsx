import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
type Props = {
  children: React.ReactNode;
};
const Admin: React.FC<Props> = ({ children }) => {
  const { user } = useUserContext();
  return user.role === "admin" ? children : <Navigate to="/*" replace />; // replaces the protected route
};

export default Admin;

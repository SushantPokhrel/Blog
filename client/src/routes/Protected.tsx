import { Navigate } from "react-router-dom";
import React from "react";
import { useUserContext } from "../contexts/UserContext";
import Loader from "../components/Loader";
type ProtectedRouteProps = {
  children: React.ReactNode;
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useUserContext();
  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    ); //

  return isAuthenticated ? children : <Navigate to="/user/auth" replace />; // replaces the protected route
};

export default ProtectedRoute;

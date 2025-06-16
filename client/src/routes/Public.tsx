import { useAuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
type PublicRouteProps = {
  children: React.ReactNode;
};
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAuthContext();
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};
export default PublicRoute;

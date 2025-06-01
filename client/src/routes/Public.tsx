import { useUserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
type PublicRouteProps = {
  children: React.ReactNode;
};
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useUserContext();
  if (loading) {
    return <Loader />;
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};
export default PublicRoute;

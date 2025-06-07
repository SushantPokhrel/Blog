import { useUserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
type PublicRouteProps = {
  children: React.ReactNode;
};
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useUserContext();
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};
export default PublicRoute;

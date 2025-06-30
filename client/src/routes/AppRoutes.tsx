import { Routes, Route, useLocation } from "react-router-dom";
import NotFound from "../components/NotFound";
import Dashboard from "../pages/Dashboard";
import UserPost from "../pages/UserPost";
import Footer from "../components/Footer";
import MyBlogs from "../components/MyBlogs";
import Profile from "../components/Profile";
import Users from "../components/Users";
import Analytics from "../components/Analytics";
import AllBlogs from "../components/AllBlogs";
import EditPost from "../pages/Edit";
import SavedPosts from "../pages/SavedPosts";
import Admin from "../routes/Admin";
import Home from "../pages/Home";
import CreatePost from "../pages/CreatePost";
import AuthForm from "../components/AuthForm";
import ProtectedRoute from "../routes/Protected";
import PublicRoute from "../routes/Public";
import Notifications from "../pages/Notifications";
const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <UserPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/auth"
          element={
            <PublicRoute>
              <AuthForm />
            </PublicRoute>
          }
        />
        <Route
          path="/createPost"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editPost/:postId"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="myblogs" element={<MyBlogs />} />
          <Route path="savedposts" element={<SavedPosts />} />
          <Route path="notifications" element={<Notifications />} />
          <Route
            path="allusers"
            element={
              <Admin>
                <Users />
              </Admin>
            }
          />
          <Route
            path="analytics"
            element={
              <Admin>
                <Analytics />
              </Admin>
            }
          />
          <Route
            path="allposts"
            element={
              <Admin>
                <AllBlogs />
              </Admin>
            }
          />
        </Route>

        <Route path="*" element={<NotFound children="Home" />} />
      </Routes>
      {location.pathname.startsWith("/dashboard") ? null : <Footer />}
    </>
  );
};
export default AppRoutes;

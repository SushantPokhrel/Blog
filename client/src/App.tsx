import "./App.css";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./routes/Protected";
import PublicRoute from "./routes/Public";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NotFound from "./components/NotFound";
import UserContextProvider from "./contexts/UserContext";
import Dashboard from "./pages/Dashboard";
import UserPost from "./pages/UserPost";
import Footer from "./components/Footer";
import ScrollToTop from "./Utilities/ScrollToTop";
import MyBlogs from "./components/MyBlogs";
import Profile from "./components/Profile";
import Users from "./components/Users";
import Analytics from "./components/Analytics";
import AllBlogs from "./components/AllBlogs";

function App() {
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Nav />
          <AppRoutes />
        </BrowserRouter>
      </UserContextProvider>
    </>
  );
}
const AppRoutes = () => {
  const location = useLocation();


  console.log(location.pathname);
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="allusers" element={<Users />} />
          <Route path="myblogs" element={<MyBlogs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="allposts" element={<AllBlogs />} />
        </Route>

        <Route path="*" element={<NotFound children="Home" />} />
      </Routes>
      {location.pathname.startsWith("/dashboard") ? null : <Footer />}
    </>
  );
};
export default App;

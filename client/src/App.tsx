import "./App.css";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./routes/Protected";
import PublicRoute from "./routes/Public";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import UserContextProvider from "./contexts/UserContext";
import Dashboard from "./components/Dashboard";
import UserPost from "./pages/UserPost";
import Footer from "./components/Footer";
import ScrollToTop from "./Utilities/ScrollToTop";

function App() {
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Nav />
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
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </UserContextProvider>
    </>
  );
}

export default App;

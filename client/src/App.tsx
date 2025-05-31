import "./App.css";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Post from "./pages/Post";
import AuthForm from "./components/AuthForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import UserContextProvider from "./contexts/UserContext";

function App() {
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/auth" element={<AuthForm />} />
            <Route path="/createPost" element={<Post />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </>
  );
}

export default App;

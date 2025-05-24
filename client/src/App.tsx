import "./App.css";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import AuthForm from "./components/AuthForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/auth" element={<AuthForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

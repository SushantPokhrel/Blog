import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
const ClientId = import.meta.env.VITE_CLIENT_ID;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={ClientId}>
      {" "}
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);

import React, { createContext, useContext, useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

type UserTypes = {
  email: string;
  username: string;
  profilePhoto?: string;
  role: string;
  customUsername?: string;
};
type AuthContextTypes = {
  user: UserTypes;
  setUser: React.Dispatch<React.SetStateAction<UserTypes>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
type AuthContextProviderProps = {
  children: React.ReactNode;
};
const AuthContext = createContext<AuthContextTypes | null>(null);
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<UserTypes>({
    email: "",
    username: "",
    profilePhoto: "",
    role: "",
    customUsername: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkAuth = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        credentials: "include",
      });

      if (response.status === 401) {
        const err = await response.json();
        if (err.message === "Token expired") {
          alert("Login again");
          location.href = "/user/auth";
        }

        setUser({
          email: "",
          username: "",
          profilePhoto: "",
          role: "",
          customUsername: "",
        });
        return;
      }

      const data = await response.json();
      const { email, username, picture, role, customUsername } = data.user;
      setUser({
        email,
        username,
        profilePhoto: picture,
        role,
        customUsername,
      });
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Auth check failed", e);
      setIsAuthenticated(false);
      setUser({
        email: "",
        username: "",
        profilePhoto: "",
        role: "",
        customUsername: "",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
    const intervalId = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  if (!authContext)
    throw new Error("Cannot use outside of auth context provider");
  return authContext;
};

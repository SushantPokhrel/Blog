import React, { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
type UserTypes = {
  email: string;
  username: string;
  profilePhoto: string;
  role: string;
};
type UserContextTypes = {
  user: UserTypes;
  setUser: React.Dispatch<React.SetStateAction<UserTypes>>;
};
type UserContextProviderProps = {
  children: React.ReactNode;
};
export const UserContext = createContext<UserContextTypes | null>(null);
const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<UserTypes>({
    email: "",
    username: "",
    profilePhoto: "",
    role: "",
  });
  const checkAuth = async () => {
    try {
      const response = await fetch(`${backendUrl}/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        const err = await response.json();
        if (err.message === "Token expired") {
          alert("Session expired. Please log in again.");
        }
        setUser({
          email: "",
          username: "",
          profilePhoto: "",
          role: "",
        });
        return;
      }

      const data = await response.json();
      setUser(data);
    } catch (e) {
      console.error("Auth check failed", e);
      setUser({
        email: "",
        username: "",
        profilePhoto: "",
        role: "",
      });
    } finally {
      console.log("finally ran");
    }
  };
  // to check auth initially and every 5 min
  useEffect(() => {
    checkAuth();

    const intervalId = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("no context value found");
  return context;
};
export default UserContextProvider;

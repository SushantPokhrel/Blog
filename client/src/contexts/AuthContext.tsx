import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../Socket";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

type UserTypes = {
  email: string;
  username: string;
  profilePhoto?: string;
  role: string;
  customUsername?: string;
  userId: string;
};

type likes = string[];
type NotificationsTypes = {
  likedByName: string;
  postTitle: string;
  likes: likes;
  postOwnerName: string;
};

type AuthContextTypes = {
  user: UserTypes;
  setUser: React.Dispatch<React.SetStateAction<UserTypes>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: NotificationsTypes[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsTypes[]>>;
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
    userId: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationsTypes[]>([]);

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
          userId: "",
        });
        return;
      }

      const data = await response.json();
      const { email, username, picture, role, customUsername, user_id } =
        data.user;
      setUser({
        email,
        username,
        profilePhoto: picture,
        role,
        customUsername,
        userId: user_id,
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
        userId: "",
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
  useEffect(() => {
    if (isAuthenticated && user.userId) {
      socket.auth = { userID: user.userId };
      // console.log(socket.auth);
      socket.connect();
      const onConnect = () => {
        console.log("socket connected");
        socket.on("notifyOwner", (_) => {
          // console.log(data);
        });
      };
      socket.once("connect", onConnect);
    }
    return () => {
      socket.off("notifyOwner");
      socket.off("connect");
    };
  }, [isAuthenticated, user.userId]);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        isAuthenticated,
        setIsAuthenticated,
        notifications,
        setNotifications,
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

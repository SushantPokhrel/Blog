import React, { createContext, useContext, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
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

// type likes = string[];
type NotificationsTypes = {
  likerName: string;
  postTitle: string;
  likes: number;
  postOwnerName: string;
  likerProfile: string;
  createdAt: string;
  displayTime: string;
  isRead:boolean
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
  const getNotifications = async () => {
    const response = await fetch(`${backendUrl}/api/notifications/all`, {
      credentials: "include",
    });
    const data = await response.json();
    // console.log(data);

    setNotifications(
      data.map((notification: NotificationsTypes) => {
        const { createdAt } = notification;
        const d = new Date(createdAt);
        const result = formatDistanceToNow(d, {
          addSuffix: true,
        });
        return {
          ...notification,
          displayTime: result,
        };
      })
    );
  };
  // for socket and notifications
  useEffect(() => {
    if (isAuthenticated && user.userId) {
      socket.auth = { userID: user.userId };
      // console.log(socket.auth);
      socket.connect();
      const onConnect = () => {
        console.log("socket connected");
        getNotifications();
        socket.on("notifyOwner", (data: NotificationsTypes) => {
          setNotifications((prev) => {
            const { createdAt } = data;
            // console.log(data)
            // console.log(createdAt);
            // console.log(
            //   new Date(createdAt).getTime() - new Date(createdAt).getTime()
            // );

            const d = new Date(createdAt);
            const result = formatDistanceToNow(d, {
              addSuffix: true,
            });
            const newValue = [...prev, { ...data, displayTime: result }];
            newValue.sort(
              (v1, v2) =>
                new Date(v2.createdAt).getTime() -
                new Date(v1.createdAt).getTime()
            );
            return newValue;
          });
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

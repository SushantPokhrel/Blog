import React, { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type UserTypes = {
  email: string;
  username: string;
  profilePhoto: string;
  role: string;
};

type Post = {
  title: string;
  banner: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  subTitle: string;
  _id: string;
  authorName: string;
  createdAt: string;
};

type UserContextTypes = {
  user: UserTypes;
  setUser: React.Dispatch<React.SetStateAction<UserTypes>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  loadingPosts: boolean;
  fetchPosts:()=>void
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  // check user authentication state
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
        console.log(err.message);

        setUser({
          email: "",
          username: "",
          profilePhoto: "",
          role: "",
        });
        return;
      }

      const data = await response.json();
      const { email, username, picture, role } = data.user;
      setUser({
        email,
        username,
        profilePhoto: picture,
        role,
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
      });
    } finally {
      console.log("Auth check finally ran");
      setLoading(false);
    }
  };
  // fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/posts/all", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      console.log("Fetched posts:", data);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchPosts();

    const intervalId = setTimeout(() => {
      checkAuth();
    }, 5 * 60 * 1000);

    return () => clearTimeout(intervalId);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
        posts,
        setPosts,
        loadingPosts,
        fetchPosts
      }}
    >
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

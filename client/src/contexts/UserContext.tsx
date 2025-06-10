import React, { createContext, useContext, useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

type UserTypes = {
  email: string;
  username: string;
  profilePhoto?: string;
  role: string;
  customUsername?: string;
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
  likeCount: number;
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
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  fetchPosts: () => Promise<void>;
  setLoadingPosts: React.Dispatch<React.SetStateAction<boolean>>;
  categoryPostsLoading: boolean;
  setCategoryPostsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
    customUsername: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [categoryPostsLoading, setCategoryPostsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState(() => {
    console.log(location.search);
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("category") || "For You";
  }); // check user authentication state
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
          customUsername:""
        });
        return;
      }

      const data = await response.json();
      console.log(data)
      const { email, username, picture, role,customUsername } = data.user;
      setUser({
        email,
        username,
        profilePhoto: picture,
        role,
        customUsername
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
        customUsername:""
      });
    } finally {
      console.log("Auth check finally ran");
      setLoading(false);
    }
  };
  // fetch all posts
  const fetchPosts = async () => {
    setCategoryPostsLoading(true);
    try {
      const res = await fetch(
        `${backendUrl}/api/posts/?category=${capitalizeAfterSpace(category)}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      console.log("Fetched posts:", data);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoadingPosts(false);
      setCategoryPostsLoading(false);
    }
  };
  const capitalizeAfterSpace = (str: string) => {
    return str
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  useEffect(() => {
    checkAuth();
    fetchPosts();

    const intervalId = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

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
        category,
        setCategory,
        fetchPosts,
        setLoadingPosts,
        categoryPostsLoading,
        setCategoryPostsLoading,
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

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

type IndividualPostsContextType = {
  individualPosts: Post[];
  fetchIndividualPosts: (username: string) => Promise<void>;
  setIndividualPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  individualPostsLoading:boolean
};


const IndividualPostsContext = createContext<IndividualPostsContextType | null>(
  null
);

export const IndividualPostsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [individualPosts, setIndividualPosts] = useState<Post[]>([]);
  const [individualPostsLoading, setIndividualPostsLoading] = useState(true);
  const { user } = useAuthContext();
  const fetchIndividualPosts = async (username: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/posts/author/${username}`,
        {
          credentials: "include",
        }
      );

      if (response.status === 404) {
        setIndividualPosts([]);
        return;
      }

      const data = await response.json();
      setIndividualPosts(data);
    } catch (error) {
      console.error("Error fetching individual posts:", error);
    }
    finally{
      setIndividualPostsLoading(false)
    }
  };
  useEffect(() => {
    fetchIndividualPosts(user.username);
  }, [user]);
  return (
    <IndividualPostsContext.Provider
      value={{ individualPosts, fetchIndividualPosts, setIndividualPosts,individualPostsLoading }}
    >
      {children}
    </IndividualPostsContext.Provider>
  );
};

export const useIndividualPostsContext = () => {
  const context = useContext(IndividualPostsContext);
  if (!context)
    throw new Error(
      "useIndividualPostsContext must be used within IndividualPostsProvider"
    );
  return context;
};

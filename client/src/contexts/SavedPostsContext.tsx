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

type SavedPostsContextType = {
  savedPosts: Post[];
  setSavedPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  fetchSavedPosts: (email: string) => Promise<void>;
  savedPostsLoading: boolean;
  savedIds: string[];
};

const SavedPostsContext = createContext<SavedPostsContextType | null>(null);

export const SavedPostsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedPostsLoading, setSavedPostsLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const { user } = useAuthContext();
  const fetchSavedPosts = async (email: string) => {
    setSavedPostsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/posts/saved/${email}`, {
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to fetch saved posts");
        return;
      }

      const data = await response.json();
      console.log("savedposts", data);
      setSavedPosts(data);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    } finally {
      setSavedPostsLoading(false);
    }
  };
  useEffect(() => {
    if (user.email) {
      fetchSavedPosts(user.email);
    }
  }, [user]);
  useEffect(() => {
    setSavedIds(savedPosts.map((p) => p._id));
  }, [savedPosts]);

  return (
    <SavedPostsContext.Provider
      value={{
        savedPosts,
        setSavedPosts,
        fetchSavedPosts,
        savedPostsLoading,
        savedIds,
      }}
    >
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPostsContext = () => {
  const context = useContext(SavedPostsContext);
  if (!context)
    throw new Error(
      "useSavedPostsContext must be used within SavedPostsProvider"
    );
  return context;
};

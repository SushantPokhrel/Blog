import React, { createContext, useContext, useEffect, useState } from "react";

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

type PostsContextType = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  loadingPosts: boolean;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  fetchPosts: () => Promise<void>;
  categoryPostsLoading: boolean;
};

const PostsContext = createContext<PostsContextType | null>(null);

const capitalizeAfterSpace = (str: string) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [categoryPostsLoading, setCategoryPostsLoading] = useState(false);
  const [category, setCategory] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("category") || "For You";
  });

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
      // console.log(data);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoadingPosts(false);
      setCategoryPostsLoading(false);
    }
  };

  useEffect(() => {
    // console.log(category);
    fetchPosts();
  }, [category]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        loadingPosts,
        category,
        setCategory,
        fetchPosts,
        categoryPostsLoading,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context)
    throw new Error("usePostsContext must be used within PostsProvider");
  return context;
};

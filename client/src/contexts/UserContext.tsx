// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useAuthContext } from "./AuthContext";
// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// type Post = {
//   title: string;
//   banner: string;
//   content: string;
//   author: string;
//   category: string;
//   tags: string[];
//   subTitle: string;
//   _id: string;
//   authorName: string;
//   createdAt: string;
//   likeCount: number;
// };

// type UserContextTypes = {
//   posts: Post[];
//   setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
//   loadingPosts: boolean;
//   category: string;
//   setCategory: React.Dispatch<React.SetStateAction<string>>;
//   fetchPosts: () => Promise<void>;
//   setLoadingPosts: React.Dispatch<React.SetStateAction<boolean>>;
//   categoryPostsLoading: boolean;
//   setCategoryPostsLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   individualPosts: Post[];
//   fetchIndividualPosts: (username: string) => Promise<void>;
//   setIndividualPosts: React.Dispatch<React.SetStateAction<Post[]>>;
//   savedPosts: Post[];
//   setSavedPosts: React.Dispatch<React.SetStateAction<Post[]>>;
//   fetchSavedPosts: (email: string) => Promise<void>;
//   savedPostsLoading: boolean;
//   savedIds: string[];
// };

// type UserContextProviderProps = {
//   children: React.ReactNode;
// };

// export const UserContext = createContext<UserContextTypes | null>(null);

// const UserContextProvider: React.FC<UserContextProviderProps> = ({
//   children,
// }) => {
//   const { isAuthenticated, user } = useAuthContext();
//   const [loadingPosts, setLoadingPosts] = useState(true);
//   const [categoryPostsLoading, setCategoryPostsLoading] = useState(true);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [individualPosts, setIndividualPosts] = useState<Post[]>([]);
//   const [savedPosts, setSavedPosts] = useState<Post[]>([]);
//   const [savedPostsLoading, setSavedPostsLoading] = useState(false);
//   const [category, setCategory] = useState(() => {
//     const searchParams = new URLSearchParams(location.search);
//     return searchParams.get("category") || "For You";
//   });

//   const [savedIds, setSavedIds] = useState<string[] | []>([]);

//   const fetchPosts = async () => {
//     setCategoryPostsLoading(true);
//     try {
//       const res = await fetch(
//         `${backendUrl}/api/posts/?category=${capitalizeAfterSpace(category)}`,
//         {
//           credentials: "include",
//         }
//       );
//       if (!res.ok) throw new Error("Failed to fetch posts");
//       const data = await res.json();
//       setPosts(data);
//       console.log("all posts", data);
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//     } finally {
//       setLoadingPosts(false);
//       setCategoryPostsLoading(false);
//     }
//   };

//   const fetchIndividualPosts = async (username: string) => {
//     try {
//       const response = await fetch(
//         `${backendUrl}/api/posts/author/${username}`,
//         {
//           credentials: "include",
//         }
//       );

//       if (response.status === 404) {
//         setIndividualPosts([]);
//         return;
//       }

//       const data = await response.json();
//       setIndividualPosts(data);
//     } catch (error) {
//       console.error("Error fetching individual posts:", error);
//     }
//   };

//   const fetchSavedPosts = async (email: string) => {
//     setSavedPostsLoading(true);
//     try {
//       const response = await fetch(`${backendUrl}/api/posts/saved/${email}`, {
//         credentials: "include",
//       });

//       if (!response.ok) {
//         console.error("Failed to fetch saved posts");
//         return;
//       }

//       const data = await response.json();
//       console.log(data);
//       setSavedPosts(data);
//     } catch (error) {
//       console.error("Error fetching saved posts:", error);
//     } finally {
//       setSavedPostsLoading(false);
//     }
//   };

//   const capitalizeAfterSpace = (str: string) => {
//     return str
//       .split(" ")
//       .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchPosts();
//       fetchIndividualPosts(user.username);
//       fetchSavedPosts(user.email);
//     }
//   }, [isAuthenticated]);
//   useEffect(() => {
//     setSavedIds(savedPosts.map((p) => p._id));
//   }, [savedPosts]);

//   return (
//     <UserContext.Provider
//       value={{
//         posts,
//         setPosts,
//         loadingPosts,
//         category,
//         setCategory,
//         fetchPosts,
//         setLoadingPosts,
//         categoryPostsLoading,
//         setCategoryPostsLoading,
//         individualPosts,
//         fetchIndividualPosts,
//         setIndividualPosts,
//         savedPosts,
//         setSavedPosts,
//         fetchSavedPosts,
//         savedPostsLoading,
//         savedIds,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUserContext = () => {
//   const context = useContext(UserContext);
//   if (!context) throw new Error("no context value found");
//   return context;
// };

// export default UserContextProvider;

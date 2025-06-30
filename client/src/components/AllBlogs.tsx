import React, { useEffect } from "react";
import { usePostsContext } from "../contexts/PostsContext";
import NotFound from "../components/NotFound";
import Loader from "../components/Loader";
import PostCard from "./PostCard";
import { useAuthContext } from "../contexts/AuthContext";
const AllBlogs: React.FC = () => {
  const { posts, loadingPosts, fetchPosts, setCategory, category } =
    usePostsContext();
  const { isAuthenticated } = useAuthContext();
  useEffect(() => {
    setCategory("For You");
  }, []);
  useEffect(() => {
    fetchPosts();
  }, [isAuthenticated, category]);
  if (loadingPosts)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  return (
    <div className="flex flex-col gap-6 max-w-3xl md:px-2 mx-auto ">
      {posts.length ? (
        posts.map((post) => (
          <PostCard post={post} key={post._id} hideOption={false} />
        ))
      ) : (
        <NotFound children="Create one" />
      )}
    </div>
  );
};

export default AllBlogs;

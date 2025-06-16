import React from "react";
import { usePostsContext } from "../contexts/PostsContext";

import Loader from "./Loader";
import PostCard from "./PostCard";
const Posts: React.FC = () => {
  const { posts, categoryPostsLoading } = usePostsContext();

  if (categoryPostsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className=" flex flex-col gap-6 ">
      {posts.map((post) => (
        <PostCard post={post} key={post._id} hideOption={true} />
      ))}
    </div>
  );
};

export default Posts;

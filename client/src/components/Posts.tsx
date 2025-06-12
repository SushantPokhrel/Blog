import React from "react";
import { useUserContext } from "../contexts/UserContext";

import Loader from "./Loader";
import PostCard from "./PostCard";
const Posts: React.FC = () => {
  const { posts, categoryPostsLoading } = useUserContext();

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

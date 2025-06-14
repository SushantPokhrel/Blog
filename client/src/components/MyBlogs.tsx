import React from "react";
import { useUserContext } from "../contexts/UserContext";
import PostCard from "./PostCard";
import Loader from "./Loader";
import NotFound from "./NotFound";

const MyBlogs: React.FC = () => {
  const { individualPosts, loadingPosts,user } = useUserContext();
console.log(individualPosts)
  if (loadingPosts) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  if (!individualPosts.length) {
    return <NotFound>Create one</NotFound>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl md:px-2 mx-auto ">
      <div>
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">Your posts</h1>
        <span className="text-xs ">-{user.username}</span>
      </div>
      {individualPosts.map((post) => (
        <PostCard post={post} key={post._id} hideOption={false} />
      ))}
    </div>
  );
};

export default MyBlogs;

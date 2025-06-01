import React, { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import NotFound from "../components/NotFound";
import Loader from "../components/Loader";
function Home() {
  const { posts, loadingPosts } = useUserContext();
  if (loadingPosts) <Loader />;
  if (!posts.length) {
    <NotFound />;
  }

  return (
    <div className="wrapper  flex flex-col gap-4">
      {posts.map((post) => (
        <Link
          to={`/post/${post._id}`}
          key={post._id}
          className="flex flex-col gap-3 py-3.5 px-1.5 border-b border-b-gray-100"
        >
          <div className="upper-section flex justify-between gap-2  ">
            <div className="basis-3/4 flex flex-col gap-1.5">
              <span className="text-gray-700 text-[13px]">
                -{post.authorName}
              </span>
              <h1 className="text-xl font-bold leading-[1.12] text-gray-800">
                {post.title}
              </h1>
              <p className="text-gray-700 line-clamp-2 text-sm">
                {post.subTitle}
              </p>
            </div>
            <div className="basis-1/4 self-center">
              <img
                src={post.banner}
                alt={`Banner for ${post.title}`}
                className="w-full aspect-square rounded-sm"
              />
            </div>
          </div>
          <div className="lower-section  text-[12px]   flex justify-between gap-1.5">
            <div className="flex gap-2.5 items-center">
              <strong className="text-blue-400">{post.category}</strong>
              <span className="text-gray-700">
                {post.createdAt.split("T")[0]}
              </span>
            </div>
            <div>...</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Home;

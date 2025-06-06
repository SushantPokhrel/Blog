import React, { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import { PiHandsClappingThin } from "react-icons/pi";
import Loader from "./Loader";
const Posts: React.FC = () => {
  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const { posts, categoryPostsLoading } = useUserContext();
  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    const day = d.getDate().toString().padStart(2, "0"); // ensures 01, 02 etc.
    const month = Months[d.getMonth()];
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };
  if (categoryPostsLoading) {
   return <div className="flex justify-center items-center">
      <Loader />
    </div>;
  }
  return (
    <div className=" flex flex-col gap-4 ">
      {posts.map((post) => (
        <Link
          to={`/post/${post._id}`}
          key={post._id}
          className="flex flex-col gap-3 py-3.5 px-1.5 border-b border-b-gray-100"
        >
          <div className="upper-section flex justify-between gap-2 md:gap-7">
            <div className="md:basis-3/5 basis-3/4 flex flex-col gap-1.5">
              <span className="text-gray-700 text-[13px]">
                -{post.authorName}
              </span>
              <h1 className="text-xl font-bold leading-[1.12] text-gray-800 md:text-2xl">
                {post.title}
              </h1>
              <p className="text-gray-700 line-clamp-2 text-sm">
                {post.subTitle}
              </p>
            </div>
            <div className="md:basis-2/5 basis-1/4 self-center ">
              <img
                src={post.banner}
                alt={`Banner for ${post.title}`}
                className="w-full aspect-square rounded-sm md:aspect-auto"
              />
            </div>
          </div>
          <div className="lower-section text-[12px] flex justify-between gap-1.5">
            <div className="flex gap-2.5 items-center">
              <span className="text-gray-700">
                {formatDate(post.createdAt)}
              </span>
              <span className="flex gap-1 items-center">
                <PiHandsClappingThin className="size-5" />
                <span>{post.likeCount}</span>
              </span>
            </div>
            <div
              className="text-xl font-semibold hover:scale-125"
              onClick={(e) => {
                e.preventDefault();
                alert("This feature will be added soon");
                e.stopPropagation();
              }}
            >
              ...
            </div>
          </div>
          <div>
            {" "}
            <strong className="text-blue-400 text-[12px]">
              {post.category}
            </strong>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Posts;

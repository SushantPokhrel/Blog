import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiHandsClappingThin } from "react-icons/pi";
import DropdownMenuDemo from "./Dropdown";
import { MdLibraryAdd, MdLibraryAddCheck } from "react-icons/md";
import { useUserContext } from "../contexts/UserContext";
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
type Props = {
  post: Post;
  hideOption?: boolean;
};
type BlogPostOptions = "edit" | "delete" | "author info";

const PostCard: React.FC<Props> = ({ post, hideOption }) => {
  const { setSavedPosts, savedIds } = useUserContext();
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

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
  const PostCardOptions: BlogPostOptions[] = ["edit", "delete", "author info"];

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    const day = d.getDate().toString().padStart(2, "0"); // ensures 01, 02 etc.
    const month = Months[d.getMonth()];
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleSavePost = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`${backendUrl}/api/auth/save/${post._id}`, {
        credentials: "include",
        method: "POST",
      });

      if (!response.ok) {
        alert("Failed to save the post");
        return;
      }

      alert("Post saved ✔");

      // Update savedPosts in context by adding this post
      setSavedPosts((prev) => [...prev, post]);

      // Optionally navigate to saved posts page
      navigate("/dashboard/savedposts");
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnsavePost = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(
        `${backendUrl}/api/auth/unsave/${post._id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );

      if (!response.ok) {
        alert("Failed to unsave the post");
        return;
      }
      alert("Post removed from your list ✔");

      // Update savedPosts in context by removing this post
      setSavedPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    setSaved(savedIds.includes(post._id));
  }, [savedIds]);
  return (
    <>
      <Link
        to={`/post/${post._id}`}
        className="flex flex-col  py-3.5 px-1.5 border-b border-b-gray-100"
      >
        <div className="upper-section flex justify-between gap-2 md:gap-7">
          <div className="md:basis-3/5 basis-3/4 flex flex-col gap-2.5">
            <span className="text-gray-700 text-[13px] flex gap-2 items-center">
              <img
                src={post.banner}
                alt={post.title}
                className="w-6 aspect-square rounded-sm"
              />{" "}
              <span> {post.authorName}</span>
            </span>
            <h1 className="text-xl font-bold leading-[1.12] text-gray-800 md:text-2xl">
              {post.title}
            </h1>
            <p className="text-gray-700 line-clamp-2 text-sm">
              {post.subTitle}
            </p>
            <div className="lower-section text-[12px] flex justify-between gap-1.5">
              <div className="flex gap-3 items-center">
                <span className="text-gray-700">
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex gap-1 items-center">
                  <PiHandsClappingThin className="size-5" />
                  <span>{post.likeCount}</span>
                </span>

                {saved ? (
                  <span
                    className="remove-post"
                    onClick={handleUnsavePost}
                    title="remove from saved posts?"
                  >
                    <MdLibraryAddCheck className="size-5" />
                  </span>
                ) : (
                  <span
                    className="save-post"
                    onClick={handleSavePost}
                    title="add to saved posts"
                  >
                    <MdLibraryAdd className="size-5" />
                  </span>
                )}
              </div>
              <DropdownMenuDemo
                postId={post._id}
                hideOption={hideOption}
                TriggerChild={
                  <div
                    className="text-xl font-semibold hover:scale-125"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    ...
                  </div>
                }
                postcardOptions={PostCardOptions}
              />
            </div>
          </div>
          <div className=" basis-1/4  self-center  md:self-start md:basis-2/5 ">
            <img
              src={post.banner}
              alt={`Banner for ${post.title}`}
              className="w-full aspect-square rounded-sm md:aspect-auto max-h-40"
            />
          </div>
        </div>
      </Link>
    </>
  );
};

export default PostCard;

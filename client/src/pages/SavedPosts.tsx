import React, { useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import PostCard from "../components/PostCard";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
const SavedPosts: React.FC = () => {
  const { user, savedPosts, fetchSavedPosts, savedPostsLoading } =
    useUserContext();

  useEffect(() => {
    if (user.email) {
      fetchSavedPosts(user.email);
    }
  }, [user.email]);

  return (
    <div className="flex flex-col gap-6 max-w-3xl md:px-2 mx-auto">
      {savedPostsLoading ? (
        <div className="min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : savedPosts.length ? (
        <div>
          <h1 className="text-lg md:text-2xl font-semibold text-gray-700">Reading List</h1>
          <span className="text-xs">-{user.username}</span>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-base md:text-2xl font-semibold mb-1.5 text-gray-700">
            You don't have any saved posts.
          </h1>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-500 text-white font-semibold text-sm px-4 py-2.5 rounded-md">
              Add one
            </Button>
          </Link>
        </div>
      )}

      {!savedPostsLoading &&
        savedPosts.map((post) => (
          <PostCard post={post} hideOption={true} key={post._id} />
        ))}
    </div>
  );
};

export default SavedPosts;

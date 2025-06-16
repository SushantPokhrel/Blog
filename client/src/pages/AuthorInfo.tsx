import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { usePostsContext } from "../contexts/PostsContext";
import Button from "../components/Button";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

type AuthorInfo = {
  customUsername: string;
  email: string;
  profilePicture?: string;
  description?: string;
};

const fallbackImg =
  "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png";

const AuthorInfo: React.FC = () => {
  const { postId } = useParams();
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo>({
    customUsername: "",
    email: "",
    profilePicture: "",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const { fetchPosts } = usePostsContext();

  const getAuthorInfo = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/auth/user/details/${postId}`,
        { credentials: "include" }
      );
      const data = await response.json();
      const { customUsername, email, picture } = data;

      setAuthorInfo({
        email,
        profilePicture: picture || fallbackImg,
        description: authorInfo.description,
        customUsername,
      });
    } catch (error) {
      console.error("Error fetching author info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthorInfo();
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <Loader />;
      </div>
    );
  }

  return (
    <div className="max-w-2xl text-gray-700 mx-auto   p-6 my-36 bg-gray-100 rounded-md ">
      <div className="flex flex-col md:flex-row  items-center md:items-start text-center md:text-left justify-center  gap-6">
        <img
          src={authorInfo.profilePicture || fallbackImg}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImg;
          }}
          alt="Author"
          className="w-18 h-18 rounded-full object-cover shadow-md ring-2 ring-blue-100"
        />
        <div className="flex flex-col">
          <h2 className=" text-xl md:text-2xl font-bold text-gray-800">
            {authorInfo.customUsername}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{authorInfo.email}</p>
          {authorInfo.description && (
            <p className="mt-6 text-sm leading-relaxed text-gray-700">
              {authorInfo.description}
            </p>
          )}
          <div className="mt-2.5">
            <Button
              children="Get in touch"
              className="py-2.5 text-xs px-4.5 rounded-md bg-blue-700 hover:bg-blue-600 text-white active:bg-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;

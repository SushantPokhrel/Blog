import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useUserContext } from "../contexts/UserContext";

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
  const { fetchPosts } = useUserContext();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-28 h-28 mb-4">
            <img
              src={authorInfo.profilePicture || fallbackImg}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImg;
              }}
              alt="Author"
              className="rounded-full w-full h-full object-cover ring-4 ring-blue-100 shadow-md"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {authorInfo.customUsername}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{authorInfo.email}</p>
        </div>

        {authorInfo.description && (
          <p className="mt-6 text-gray-700 text-sm leading-relaxed text-center">
            {authorInfo.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;

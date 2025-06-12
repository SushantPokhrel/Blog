import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import PostCard from "./PostCard";
import Loader from "./Loader";
import NotFound from "./NotFound";
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

const MyBlogs: React.FC = () => {
  const { user } = useUserContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/posts/author/${user.username}`,
          {
            credentials: "include",
          }
        );
        if (response.status === 404) {
          setPosts([]);
          return;
        }

        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl md:px-2 mx-auto ">
      {posts.length ? (
        posts.map((post) => <PostCard post={post} key={post._id} hideOption={false}/>)
      ) : (
        <NotFound children="Create one" />
      )}
    </div>
  );
};

export default MyBlogs;

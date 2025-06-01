import React, { useEffect, useState } from "react";
import Prism from "prismjs";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import "prismjs/themes/prism-tomorrow.css";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import NotFound from "../components/NotFound";
type PostType = {
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
};
function UserPost() {
  const { id } = useParams();
  const [post, setPost] = useState<PostType>({
    title: "",
    banner: "",
    content: "",
    author: "",
    category: "",
    tags: [],
    subTitle: "",
    _id: "",
    authorName: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${backendUrl}/api/posts/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setPost(data);
      })
      .catch((e) => console.log(e.message))
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    Prism.highlightAll();
  }, [post]);
  if (!loading && !post._id) {
    return <NotFound />;
  }
  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-2 my-8">
      <div className="mb-6 flex flex-col gap-6  m-2 pb-4">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          <h2 className="text-base font-normal text-gray-600">
            {post.subTitle}
          </h2>
          <div className="mt-2 flex flex-col">
            <strong className="text-gray-600 text-sm font-normal">
              {post.createdAt.split("T")[0]}
            </strong>

            <span className="text-gray-800 text-sm">-{post.authorName}</span>
          </div>
          <div className="text-sm ">
            <span className="text-gray-600">Category: </span>
            <span className="font-semibold">{post.category}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {post.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <img src={post.banner} alt="Banner" className="w-full h-auto" />
        <div
          className="prose prose-blue max-w-none post-display"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}

export default UserPost;

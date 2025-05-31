import React, { useEffect, useState } from "react";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";

type PostProps = {
  title: string;
  banner: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
}[];

function Home() {
  const [posts, setPosts] = useState<PostProps>([
    {
      title: "",
      banner: "",
      content: "",
      author: "",
      category: "",
      tags: [],
    },
  ]);
  
  useEffect(() => {
    Prism.highlightAll();
  }, [posts]);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts/all")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPosts(data);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-2 my-4">
      {posts.map((post, key) => (
        <div key={key} className="mb-6 flex flex-col gap-6 border-b m-2 pb-4">
          <div className="flex flex-col gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
            <strong className="text-gray-600 text-sm">{post.author}</strong>
            {/* Category */}
            <span className="text-sm text-indigo-600 font-semibold mt-1">
              Category: {post.category}
            </span>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-1">
              {post.tags.map((tag, idx) => (
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
      ))}
    </div>
  );
}

export default Home;

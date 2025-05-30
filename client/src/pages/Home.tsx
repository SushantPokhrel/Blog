import React, { useEffect, useState } from "react";
// or another theme
import Prism from "prismjs";

// Import Prism CSS theme (choose one)
// or import a different theme if you want:
import "prismjs/themes/prism-tomorrow.css";

// Import language components you want to highlight
// import "prismjs/components/prism-cpp"; // C++
// import "prismjs/components/prism-javascript"; // JavaScript
// import "prismjs/components/prism-python"; // Python

type PostProps = [
  {
    title: string;
    banner: string;
    content: string;
    author: string;
  }
];
function Home() {
  const [posts, setPosts] = useState<PostProps>([
    {
      title: "",
      banner: "",
      content: "",
      author: "",
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
    <div className="max-w-3xl mx-auto p-2">
      {posts.map((post, key) => (
        <div key={key} className="mb-6 border-b m-2 pb-4">
          <div className="flex flex-col gap-2 mb-2">
            <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
            <strong className="text-gray-600 text-sm">{post.author}</strong>
          </div>
          <img
            src={post.banner}
            alt="Banner"
            className="w-full h-auto mb-2"
          />
          <div
            className="prose  prose-blue max-w-none post-display "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      ))}
    </div>
  );
}

export default Home;

import React, { useEffect, useState, type ReactNode } from "react";
import { IoMdClose } from "react-icons/io"; // Close icon
import Button from "../components/Button";
import Editor from "../components/Editor";
import DropdownMenuDemo from "../components/Dropdown";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const MAX_FILE_SIZE_MB = 1; // 1MB limit
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const Post: React.FC = () => {
  const topics = [
    "Web Development",
    "App Development",
    "AI/ML",
    "Cyber Security",
    "Cloud Computing",
    "Data Science",
    "DevOps",
    "Blockchain",
    "Internet of Things (IoT)",
    "UI/UX Design",
  ];
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [base64Img, setBase64Img] = useState("");
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const handleContent = (event: any, editor: any) => {
    setContent(editor.getData().trim());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(
        `File is too large. Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`
      );
      e.target.value = ""; // Clear the input
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Img(reader.result as string);
    };
    reader.readAsDataURL(file); // for base64 string
  };
  const handleSubmit = async () => {
    const postData = {
      title,
      content,
      image: base64Img, // This is the base64 image
      category,
      tags,
    };
    if (!title || !content || !base64Img) {
      alert("Post cannot be empty");
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        alert("Post submitted successfully!");
        console.log(res);
      } else {
        alert("Failed to submit post.");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
    }
  };
  const handleTags = (e: React.MouseEvent<HTMLButtonElement>, tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
      return;
    }
    setTags((prev) => prev.filter((t) => t != tag));
    return;
  };
  useEffect(() => {
    console.log(tags);
  }, [tags]);
  return (
    <div className="wrapper ">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-8 text-center">
        Create a New Post
      </h1>

      <div className="space-y-6 flex flex-col gap-2">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            className="w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Preview Image
          </label>

          <div className="flex items-center space-x-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              <svg
                className="h-5 w-5 mr-2 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              Choose Image
            </label>

            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              required
            />

            {base64Img && (
              <div className="flex-1 flex justify-between items-center ">
                <span className="text-sm text-gray-500 truncate max-w-[150px]">
                  {fileName}
                </span>
                <span
                  onClick={() => setBase64Img("")}
                  className="cursor-pointer"
                >
                  <IoMdClose className="text-red-500 text-2xl font-bold" />
                </span>
              </div>
            )}
          </div>

          {base64Img && (
            <img
              src={base64Img}
              alt="Preview"
              className="mt-4 w-full h-auto rounded-xl border shadow-md"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose a Category
          </label>
          <DropdownMenuDemo setCategory={setCategory} category={category} />
        </div>
        {/* tags section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Tags
          </label>
          <div className="tags flex gap-2 flex-wrap">
            {topics.map((topic) => (
              <Button
                key={topic}
                onClick={(e) => handleTags(e, topic)}
                children={topic}
                className={`   hover:bg-blue-700 hover:text-white cursor-pointer   text-[12px] px-3 py-2 border rounded-3xl ${
                  tags.includes(topic)
                    ? "bg-blue-600 text-white"
                    : "bg-white  text-black"
                }`}
              />
            ))}
          </div>
        </div>
        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="bg-white border border-gray-300 rounded-lg p-2">
            <Editor handleContent={handleContent} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-md"
          >
            Submit Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Post;

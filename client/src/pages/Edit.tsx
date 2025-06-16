import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io"; // Close icon
import Button from "../components/Button";
import Editor from "../components/Editor";
import DropdownMenuDemo from "../components/Dropdown";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { topicTags } from "../Utilities/TopicsTags";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const MAX_FILE_SIZE_MB = 1; // 1MB limit
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const topics: CategoryTypes[] = [
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
type CategoryTypes =
  | "Web Development"
  | "App Development"
  | "AI/ML"
  | "Cyber Security"
  | "Cloud Computing"
  | "Data Science"
  | "DevOps"
  | "Blockchain"
  | "Internet of Things (IoT)"
  | "UI/UX Design";
const EditPost: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [base64Img, setBase64Img] = useState("");
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<CategoryTypes>("Web Development");
  const [subTitle, setSubTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const handleContent = (_: any, editor: any) => {
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
      subTitle,
    };
    if (!title || !content || !base64Img) {
      alert("Post cannot be empty");
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/api/posts/edit/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        alert("Post updated successfully!");
        const { post } = await res.json();

        // console.log(post);
        navigate(`/post/${post._id}`);
      } else {
        alert("Failed to submit post.");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
    }
  };
  const handleTags = (_: React.MouseEvent<HTMLButtonElement>, tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
      return;
    }
    setTags((prev) => prev.filter((t) => t != tag));
    return;
  };
  const handleGetEditingPost = async () => {
    const response = await fetch(`${backendUrl}/api/posts/${postId}`, {
      credentials: "include",
    });
    const data = await response.json();
    // console.log(data);
    const { title, subTitle, tags, content, category, banner, authorName } =
      data;
    setBase64Img(banner);
    setTitle(title);
    setSubTitle(subTitle);
    setTags(tags);
    setContent(content);
    setCategory(category);
    setAuthorName(authorName);
  };
  useEffect(() => {
    handleGetEditingPost();
  }, []);
  return (
    <div className="wrapper ">
      <h1 className="text-2xl flex justify-between items-center font-extrabold text-gray-800 mb-8 text-center">
        <span> Edit Your Post</span>{" "}
        <span className="text-sm font-normal">{authorName}</span>
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
        {/* sub title */}
        <div>
          <label
            htmlFor="subTitle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sub Title
          </label>
          <input
            type="text"
            name="subTitle"
            className="w-full border border-gray-300 text-base p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter sub title"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
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
          <DropdownMenuDemo
            setCategory={setCategory}
            category={category}
            topics={topics}
            TriggerChild={
              <div className="p-2 hover:bg-gray-50 active:bg-gray-100 cursor-pointer inline-flex gap-2 justify-center bg-white text-sm text-black rounded-md  border border-gray-300 shadow-sm">
                <span> {category ? category : "Select Category"}</span>
                <IoIosArrowDown className="size-6 text-gray-500" />
              </div>
            }
          />
        </div>
        {/* tags section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Tags
          </label>
          <div className="tags flex gap-2 flex-wrap">
            {topicTags[category].map((tag) => (
              <Button
                key={tag}
                onClick={(e) => handleTags(e, tag)}
                className={`hover:bg-blue-700 hover:text-white cursor-pointer text-[12px] px-3 py-2 border rounded-3xl ${
                  tags.includes(tag)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="bg-white border border-gray-300 rounded-lg p-2">
            <Editor handleContent={handleContent} initialData={content} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-md"
          >
            Edit Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;

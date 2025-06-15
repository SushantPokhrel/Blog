import React, { useState } from "react";
import Button from "./Button";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

type CommentTypes = {
  username: string;
  picture: string; // URL of user's profile picture
  content: string;
  _id: string;
};
type Props = {
  setComments: React.Dispatch<React.SetStateAction<CommentTypes[]>>;
  postId: string | undefined;
};

const Comment: React.FC<Props> = ({ setComments, postId }) => {
  const [commentContent, setCommentContent] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentContent.trim() === "") return;
    const res = await fetch(`${backendUrl}/api/comments/${postId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentContent,
      }),
    });
    if (!res.ok) {
      alert("Failed to post a comment");
      return;
    }
    const data = await res.json();
    console.log(data);
    const { content, username, picture, _id } = data._doc;
    setComments((prev) => [
      ...prev,
      {
        content,
        username,
        picture,
        _id,
      },
    ]);
    console.log(data);
    // setComments((prev) => [
    //   ...prev,
    //   {
    //     username: "sushant",
    //     picture:
    //       "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
    //     commentContent: commentContent,
    //   },
    // ]);
  };
  return (
    <form className="text-gray-700 text-center" onSubmit={handleSubmit}>
      <h1 className="text-sm mb-2">Leave a comment</h1>
      <div className="">
        <textarea
          onChange={(e) => setCommentContent(e.target.value)}
          value={commentContent}
          placeholder="Say something..."
          name="comment"
          id="comment"
          className=" bg-gray-200 text-sm w-full p-2 rounded-sm max-h-32 "
        ></textarea>
        <Button
          type="submit"
          className="text-sm bg-blue-600 text-white px-3 py-2 md:px-4.5 hover:bg-blue-700"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Comment;

import { useEffect, useState } from "react";
import Prism from "prismjs";
import { PiHandsClappingThin } from "react-icons/pi";
import { motion, useScroll } from "motion/react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import "prismjs/themes/prism-tomorrow.css";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import NotFound from "../components/NotFound";
import MemoizedContentDisplay from "../components/BlogContentMemoized";
import Comment from "../components/Comment";
import { useAuthContext } from "../contexts/AuthContext";
import { socket } from "../Socket";

type CommentTypes = {
  username: string;
  picture: string;
  content: string;
  _id: string;
};

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
  likeCount: number;
  isLiked: boolean;
};

function UserPost() {
  const { user } = useAuthContext();
  const { id } = useParams();
  const { scrollYProgress } = useScroll();
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
    likeCount: 0,
    isLiked: false,
  });
  const [loading, setLoading] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [date, setDate] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [comments, setComments] = useState<CommentTypes[]>([
    {
      username: "Alice",
      picture:
        "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
      content: "Awesome 👋",
      _id: "1",
    },
    {
      username: "Bob",
      picture:
        "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
      content: "Good job 👏",
      _id: "2",
    },
  ]);

  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchComments = async () => {
    const response = await fetch(`${backendUrl}/api/comments/all/${id}`, {
      credentials: "include",
    });
    const data = await response.json();
    setComments(data);
  };

  useEffect(() => {
    fetch(`${backendUrl}/api/posts/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLikeCount(data.likeCount);
        setIsLiked(data.isLiked);
      })
      .catch((e) => {
        console.log(e);
        alert("Network error");
      })
      .finally(() => {
        setLoading(false);
      });
    fetchComments();
  }, [id]);

  useEffect(() => {
    const d = new Date(post.createdAt);
    const day = d.getDate().toString().padStart(2, "0");
    const month = Months[d.getMonth()];
    const year = d.getFullYear().toString();
    setDate(`${month} ${day}, ${year}`);

    const newDiv = document.createElement("div");
    newDiv.innerHTML = post.content;
    const textContent = newDiv.textContent || newDiv.innerText || "";
    setWordCount(textContent.split(/\s+/).length);
  }, [post]);

  useEffect(() => {
    Prism.highlightAll();
  }, [post.content]);

  const handleLikes = async () => {
    if (user.userId === post.author) {
      return alert("You cannot like your own post");
    }
    try {
      const response = await fetch(`${backendUrl}/api/posts/liked/${id}`, {
        credentials: "include",
        method: "POST",
      });
      const data = await response.json();
      setLikeCount(data.likes);
      setIsLiked(data.liked);
      if (data.liked) {
        socket.emit("postLiked", {
          likedByName: user.username,
          postOwnerName: post.authorName,
          postTitle: post.title,
          likes: data.likes,
          postOwnerID:post.author
        });
      }
    } catch (error) {
      alert("Network error");
    }
  };

  if (!loading && !post._id) {
    return <NotFound children="Home" />;
  }

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <div>
      <motion.div
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          height: 10,
          originX: 0,
          backgroundColor: "#2563EB",
        }}
      />
      <div className="wrapper max-w-[700px]!">
        <div className="mb-6 flex flex-col gap-8 m-2 ">
          <div className="flex flex-col gap-3 md:gap-4">
            <h1 className="text-3xl font-bold text-gray-800 md:text-5xl leading-8 md:leading-none">
              {post.title}
            </h1>
            <h2 className="text-base font-normal text-gray-600 md:text-lg">
              {post.subTitle}
            </h2>
            <div className="mt-2 flex flex-col text-[13px] font-normal">
              <div className="flex gap-2">
                <span className="text-gray-600">
                  {Math.ceil(wordCount / 200)} min read
                </span>
                {" . "}
                <span className="text-gray-600">{date}</span>
              </div>
              <span className="text-gray-800 text-sm">-{post.authorName}</span>
              <span className="text-blue-600 text-xs font-semibold uppercase tracking-wide">
                {post.category}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-1">
              {post.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-400 text-xs font-medium px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="extra flex justify-between border-b border-b-gray-200">
            <span
              className="flex gap-1 justify-start  p-2 items-center cursor-pointer  active:bg-blue-200"
              onClick={handleLikes}
            >
              <PiHandsClappingThin
                className={`size-5 ${
                  isLiked ? "text-black scale-125" : " text-gray-500 scale-100"
                }`}
              />
              <span className="text-sm text-gray-700 font-light">
                {likeCount}
              </span>
            </span>
            <span>...</span>
          </div>
          <img src={post.banner} alt="Banner" className="w-full h-auto" />

          <MemoizedContentDisplay
            content={post.content}
            className=" post-display"
          />

          <div className="extra border-b border-b-gray-200 flex justify-between">
            <span
              className="flex gap-1 justify-start items-center active:bg-blue-200 p-2 cursor-pointer"
              onClick={handleLikes}
            >
              <PiHandsClappingThin
                className={`size-5 ${
                  isLiked ? "text-black scale-125" : " text-gray-500 scale-100"
                }`}
              />
              <span className="text-sm text-gray-700 font-light">
                {likeCount}
              </span>
            </span>
            <span>...</span>
          </div>

          <Comment setComments={setComments} postId={id} />

          <div className="show-comments flex flex-col gap-4 ">
            {comments.length
              ? comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex gap-3.5 border-b border-b-gray-200 p-2.5"
                  >
                    <div>
                      <img
                        src={
                          comment.picture ||
                          "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png"
                        }
                        alt="profile"
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <h1 className="text-sm ">{comment.username}</h1>
                      <p className="text-xs">{comment.content}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPost;

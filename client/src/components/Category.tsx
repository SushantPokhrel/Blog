import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useEffect, useRef } from "react";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

const topics = [
  "For You",
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

const Category = () => {
  const ulRef = useRef<HTMLUListElement | null>(null);
  const { fetchPosts, setCategory, category } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategory = (value: string) => {
    setCategory(value);

    if (value === "For You") {
      // Go to root path without query param
      navigate("/", { replace: true });
    } else {
      // Add query param ?category=value
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("category", value.replace(" ", "-").toLowerCase());
      navigate(`/?${searchParams.toString()}`, { replace: true });
    }
  };

  const handleScroll = (direction: string) => {
    if (!ulRef.current) return;

    const scrollAmount = 150;
    if (direction === "left") {
      ulRef.current.scrollLeft -= scrollAmount;
    } else if (direction === "right") {
      ulRef.current.scrollLeft += scrollAmount;
    }
  };

  useEffect(() => {
    if (category) {
      fetchPosts();
    }
  }, [category]);

  return (
    <div className="relative max-w-xs md:max-w-2xl mx-auto ">
      <div className="arrowContainer flex justify-between absolute top-0 pointer-events-none z-10 w-full">
        <FaChevronLeft
          className="size-4 cursor-pointer text-gray-400 pointer-events-auto hover:text-gray-600"
          onClick={() => handleScroll("left")}
        />
        <FaChevronRight
          className="size-4 cursor-pointer text-gray-400 pointer-events-auto hover:text-gray-600"
          onClick={() => handleScroll("right")}
        />
      </div>
      <div className="container">
        <ul
          ref={ulRef}
          className="flex gap-5 overflow-x-scroll scrollbar-none "
        >
          {topics.map((topic) => (
            <li
              onClick={() => handleCategory(topic)}
              key={topic}
              className={`text-xs whitespace-nowrap text-center text-gray-600 hover:underline hover:text-gray-800`}
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Category;

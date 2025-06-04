import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
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
const Category = () => {
  const ulRef = useRef<HTMLUListElement | null>(null);
  const { posts } = useUserContext();
  const handleScroll = (direction: string) => {
    if (!ulRef.current) return;

    const scrollAmount = 150;
    console.log(ulRef.current.scrollLeft);
    if (direction === "left") {
      ulRef.current.scrollLeft -= scrollAmount;
      console.log(ulRef.current.scrollLeft);
    } else if (direction === "right") {
      console.log(ulRef.current.scrollLeft);
      ulRef.current.scrollLeft += scrollAmount;
      console.log(ulRef.current.scrollLeft);
    }
  };
  return (
    <div className="relative max-w-xs md:max-w-2xl mx-auto ">
      <div className="arrowContainer flex justify-between mb-2.5 absolute pointer-events-none z-10 w-full">
        <FaChevronLeft
          className="size-4 
            cursor-pointer text-gray-600 pointer-events-auto"
          onClick={() => handleScroll("left")}
        />{" "}
        <FaChevronRight
          className="size-4 text-gray-600 cursor-pointer pointer-events-auto"
          onClick={() => handleScroll("right")}
        />
      </div>
      <div className="container">
        <ul
          ref={ulRef}
          className="flex  gap-5 overflow-x-scroll scrollbar-none"
        >
          {topics.map((topic) => (
            <li
              key={topic}
              className="text-xs text-gray-500 whitespace-nowrap text-center "
              onClick={() => console.log(topic)}
            >
              <Link to={`/?tag=${topic.replace(/\s+/g, "-").toLowerCase()}`}>
                {" "}
                {topic}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Category;

import React, { useEffect, useState } from "react";
import { HiMiniBars3 } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io"; // Close icon
import { FaPenClip } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { IoIosCheckmark } from "react-icons/io";

import Button from "./Button";
import { usePostsContext } from "../contexts/PostsContext";
import { useAuthContext } from "../contexts/AuthContext";
import SearchModal from "./SearchModal";
import { ToolTip } from "./ToolTip";

const Nav: React.FC = () => {
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
  const { setCategory } = usePostsContext();
  const { isAuthenticated, notifications } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleMenu = () => {
    setIsOpen((prev) => !prev);
  };
  const navigate = useNavigate();

  const handleCategory = (value: string) => {
    setCategory(value);

    navigate({
      pathname: "/", // explicitly navigate to `/`
    });

    setIsOpen(false);
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isOpen]);
  return (
    <nav className=" flex justify-between p-3 sticky top-0 z-40 items-center shadow-sm shadow-gray-100 bg-white md:px-6">
      <div className="flex items-center cursor-pointer logo-name  text-sm md:text-lg  ">
        <Link
          to="/"
          onClick={() => setCategory("For You")}
          className="flex items-center"
        >
          <span>Dev</span>
          <span className="text-blue-500">Writes</span>
          <IoIosCheckmark className="size-6 " />
        </Link>
      </div>
      <div className="flex gap-1.5 md:gap-2  items-center">
        {isAuthenticated && <SearchModal />}
        {isAuthenticated && (
          <Link
            to="/createPost"
            className="flex items-center p-1.5 rounded-sm gap-2 cursor-pointer text-sm active:bg-blue-200 text-gray-500 hover:text-gray-800"
          >
            <FaPenClip className="size-3" /> <span>Write</span>
          </Link>
        )}
        {isAuthenticated && (
          <div
            className="hamburger-menu p-2 cursor-pointer rounded-sm active:bg-blue-200 text-gray-500 md:hidden"
            onClick={handleToggleMenu}
          >
            <HiMiniBars3 className="size-5" />
          </div>
        )}
        {isAuthenticated && (
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="hidden  relative md:inline-block p-1.5 rounded-sm active:bg-blue-200 text-gray-500 hover:text-gray-700"
          >
            <IoPersonOutline className="size-4 " />
            {notifications.length ? <ToolTip />:null }
          </Link>
        )}
      </div>
      {/* nav links menu  && overlay*/}
      {isOpen && (
        <div
          className="overlay  fixed z-40  inset-0 bg-black opacity-25  transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`flex flex-col gap-10 fixed  text-[14px] font-semibold top-0 h-screen overflow-auto -left-full bg-white   text-gray-800 p-4 z-50 transition-all duration-700  ${
          isOpen ? " w-7/12 left-0" : " pointer-events-none"
        }`}
      >
        <div className="flex justify-end">
          <div
            className="p-2 active:bg-blue-200 cursor-pointer text-gray-500 "
            onClick={handleToggleMenu}
          >
            <IoMdClose className="size-5" />
          </div>
        </div>
        <ul className="space-y-4 ">
          {topics.map((topic, index) => (
            <li
              onClick={() => handleCategory(topic.toLowerCase())}
              key={index}
              className={`active:bg-blue-300 p-1.5 rounded-sm cursor-pointer text-gray-700 `}
            >
              {topic}
            </li>
          ))}
        </ul>
        {isAuthenticated ? (
          <div className="flex justify-between items-center">
            {" "}
            <Link to="/" onClick={() => setIsOpen(false)}>
              <Button
                children="Home"
                className="py-1.5 px-4 bg-blue-500 hover:bg-blue-700 text-white active:bg-blue-600"
              />
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="p-1.5 relative rounded-sm active:bg-blue-200 text-gray-500"
            >
              <IoPersonOutline className="size-5 " />
            {notifications.length ? <ToolTip />:null }
            </Link>
          </div>
        ) : (
          <div className="buttons">
            <Link to="/user/auth">
              {" "}
              <Button
                children="Login"
                onClick={() => setIsOpen(false)}
                className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white active:bg-blue-600"
              />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;

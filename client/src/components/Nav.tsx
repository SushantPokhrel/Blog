import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { HiMiniBars3 } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io"; // Close icon
import { Link } from "react-router-dom";
import Button from "./Button";

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

  

  const [isOpen, setIsOpen] = useState(false);
  const handleToggleMenu = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <nav className=" flex justify-between p-4 items-center bg-white ">
      <div className="flex items-center cursor-pointer logo-name text-lg ">
        <Link to="/">
          <span className="text-blue-400">Vibe</span>Write
        </Link>
      </div>
      <div className="flex gap-3">
        <div className="p-2 active:bg-blue-200">
          <CiSearch className="size-6" />
        </div>
        <div
          className="hamburger-menu p-2 active:bg-blue-200"
          onClick={handleToggleMenu}
        >
          <HiMiniBars3 className="size-6" />
        </div>
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
          <div className="p-2 active:bg-blue-200" onClick={handleToggleMenu}>
            <IoMdClose className="size-6" />
          </div>
        </div>
        <ul className="space-y-4 ">
          {topics.map((topic, index) => (
            <li key={index} className={`hover:text-blue-300 cursor-pointer`}>
              {topic}
            </li>
          ))}
        </ul>
        <div className="buttons">
         <Link to="/user/auth"> <Button
            children="Login"
            onClick={() => setIsOpen(false)}
            className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white active:bg-blue-600"
          /></Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

import React, { useState, useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Outlet, NavLink } from "react-router-dom";
import { returnIcons } from "../Utilities/ReturnIcons";
import { IoMdClose } from "react-icons/io"; // Close icon
import { MdOutlineMenuOpen } from "react-icons/md";
import Footer from "../components/Footer";

const Dashboard: React.FC = () => {
  const { user } = useUserContext();
  const linksUser = ["Profile", "MyBlogs", "CreateNew"];
  const linksAdmin = [...linksUser, "AllUsers", "AllPosts", "Analytics"];
  const [isOpen, setIsOpen] = useState(false);
  // Function to render NavLinks based on item
  const renderNavLink = (item: string) => {
    const baseClasses =
      "flex items-center gap-3 p-2.5 rounded-md hover:bg-blue-900 transition-colors text-sm";
    let to: string;

    if (item === "CreateNew") {
      to = `/createPost`;
    } else if (item === "Profile") {
      to = `/dashboard`;
    } else {
      to = `/dashboard/${item.toLowerCase()}`;
    }

    return (
      <li key={item}>
        <NavLink
          end
          to={to}
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive ? `${baseClasses} bg-blue-800` : baseClasses
          }
        >
          {returnIcons(item)}
          <span>{item}</span>
        </NavLink>
      </li>
    );
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isOpen]);
  return (
    <div className="min-h-screen flex  md:p-0 relative ">
      {/* Sidebar */}
      {isOpen && (
        <aside className=" bg-blue-950 text-white py-1.5 px-2 fixed  z-20 w-full left-0  h-full">
          <div className="cursor-pointer  flex justify-end mb-1">
            <span className="active:bg-blue-300 p-2 rounded-sm">
              {" "}
              <IoMdClose
                className="size-5  "
                onClick={() => setIsOpen(false)}
              />
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {(user.role === "user" ? linksUser : linksAdmin).map((item) =>
              renderNavLink(item)
            )}
          </ul>
        </aside>
      )}
      {/* larger screen */}
      <aside className=" bg-blue-950 hidden md:block  text-white p-2 md:py-5 fixed w-[20%]  z-20  left-0  h-full">
        <ul className="flex flex-col gap-2">
          {(user.role === "user" ? linksUser : linksAdmin).map((item) =>
            renderNavLink(item)
          )}
        </ul>
      </aside>
      <main className="grow md:ml-[20%]  flex flex-col ">
        <div className="dashboard-options flex md:hidden p-2.5">
          <span className="active:bg-blue-300 p-1.5 border border-gray-300 rounded-sm">
            <MdOutlineMenuOpen
              className="size-6 active:bg-blue-300 text-gray-600 "
              onClick={() => setIsOpen(true)}
            />
          </span>
        </div>
        {/* Main content area */}
        <div className="py-8 px-3">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;

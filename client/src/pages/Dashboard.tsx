import React from "react";
import { useUserContext } from "../contexts/UserContext";
import { Outlet, NavLink } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useUserContext();
  const linksUser = ["Profile", "MyBlogs", "CreateNew"];
  const linksAdmin = [...linksUser, "AllUsers", "AllPosts", "Analytics"];

  // Function to render NavLinks based on item
  const renderNavLink = (item: string) => {
    console.log(item.toLowerCase());
    if (item === "CreateNew") {
      return (
        <li key={item}>
          <NavLink to={`/createPost`}>{item}</NavLink>
        </li>
      );
    }
    if (item === "Profile") {
      return (
        <li key={item}>
          <NavLink to={`/dashboard`}>{item}</NavLink>
        </li>
      );
    }
    return (
      <li key={item}>
        <NavLink to={`/dashboard/${item.toLowerCase()}`}>{item}</NavLink>
      </li>
    );
  };

  return (
    <div className="min-h-screen p-4 flex justify-between">
      <div className="sidebar">
        <ul>
          {user.role === "user"
            ? linksUser.map((item) => renderNavLink(item))
            : linksAdmin.map((item) => renderNavLink(item))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;

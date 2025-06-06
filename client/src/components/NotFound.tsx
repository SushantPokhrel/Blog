import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
type Props = {
  children: React.ReactNode;
};
const NotFound: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/006/208/684/small/search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
        alt="404-notfound"
        className="w-auto self-center "
      />
      <Button className="bg-blue-600  hover:bg-blue-700 active:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-md">
        <Link to={children === "Home" ? "/" : "/createPost"}>{children}</Link>
      </Button>
    </div>
  );
};

export default NotFound;

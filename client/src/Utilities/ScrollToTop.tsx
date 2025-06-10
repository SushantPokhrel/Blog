import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const ScrollToTop: React.FC = () => {
  const currentPath = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPath.pathname]);

  return null;
};

export default ScrollToTop;

import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { IoIosCheckmark } from "react-icons/io";
const Footer = () => {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) return null;
  return (
    <div className="border-t border-t-gray-100 px-4 py-5   md:border-none ">
      <footer className="flex flex-col max-w-4xl mx-auto gap-4 md:gap-6 md:flex-row md:justify-between md:py-24 md:max-w-5xl md:mx-auto">
        <p className="text-sm font-light md:text-base text-gray-700 flex ">
        <span> &copy; {new Date().getFullYear()} Dev Writes{" "}</span> 
          <IoIosCheckmark className="size-6" />
        </p>
        <div>
          <p className="text-sm md:text-base font-normal">SITE LINKS</p>
          <ul className="list-none flex flex-col gap-2 text-gray-700 text-sm font-light ">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm md:text-base font-normal">QUICK LINKS</p>
          <ul className="list-none flex flex-col gap-2 text-gray-700 font-light text-sm">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">Recent Posts</Link>
            </li>
            <li>
              <Link to="/">Popular Posts</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm md:text-base font-normal">SOCIALS</p>
          <ul className="list-none flex flex-col gap-2 text-gray-700  font-light text-sm ">
            <li>
              <a
                href="https://twitter.com/yourblog"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://github.com/SushantPokhrel"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/sushant-pokhrel-33436928b/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm  font-light md:text-base">
          <p className="text-gray-700">
            Built with <span className="font-semibold">MERN</span> Stack
          </p>
          <p>
            by{" "}
            <a
              href="https://sushantpokhrel.com.np/"
              target="_blank"
              className="refLink"
            >
              Sushant Pokhrel
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

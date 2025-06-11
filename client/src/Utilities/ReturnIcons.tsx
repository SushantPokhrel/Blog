import type { IconType } from "react-icons/lib";
import {
  MdPersonOutline,
  MdArticle,
  MdPostAdd,
  MdAnalytics,
  MdPeopleOutline,
} from "react-icons/md";
const iconsMap: { [key: string]: IconType } = {
  Profile: MdPersonOutline,
  MyBlogs: MdArticle,
  CreateNew: MdPostAdd,
  AllUsers: MdPeopleOutline,
  AllPosts: MdArticle,
  Analytics: MdAnalytics,
};

export const returnIcons = (name: string) => {
  const IconComponent = iconsMap[name];
  if (!IconComponent) return null;
  return <IconComponent className="size-5"/>;
};

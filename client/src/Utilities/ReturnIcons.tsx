import type { IconType } from "react-icons/lib";
import {
  MdPersonOutline,
  MdArticle,
  MdPostAdd,
  MdAnalytics,
  MdPeopleOutline,
} from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";

const iconsMap: { [key: string]: IconType } = {
  Profile: MdPersonOutline,
  MyBlogs: MdArticle,
  CreateNew: MdPostAdd,
  AllUsers: MdPeopleOutline,
  AllPosts: MdArticle,
  Analytics: MdAnalytics,
  SavedPosts:IoSaveOutline,
  Notifications:IoMdNotificationsOutline,
};

export const returnIcons = (name: string) => {
  const IconComponent = iconsMap[name];
  if (!IconComponent) return null;
  return <IconComponent className="size-5 md:size-6"/>;
};

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
type Props = {
  setCategory: (value:string) => void;
  category:string
};
export default function DropdownMenuDemo({ setCategory ,category}: Props) {
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
  const handleDropdown = (value: string) => {
    console.log(value);
    setCategory(value);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="p-2 hover:bg-gray-50 active:bg-gray-100 cursor-pointer inline-flex gap-2 justify-center bg-white text-sm text-black rounded-md  border border-gray-300 shadow-sm">
          <span> {category ? category : "Select Category"}</span>
          <IoIosArrowDown className="size-6 text-gray-500" />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white text-black shadow-md p-2 "
          side="top"
          sideOffset={6}
          align="start"
        >
          {topics.map((topic) => (
            <DropdownMenu.Item
              key={topic}
              onSelect={() => handleDropdown(topic)}
              className="p-1.5 hover:bg-gray-100 active:bg-gray-100  outline-0  rounded text-sm"
            >
              {topic}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

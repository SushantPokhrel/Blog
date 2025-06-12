import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type React from "react";
import { useNavigate } from "react-router-dom";
type CategoryTypes =
  | "Web Development"
  | "App Development"
  | "AI/ML"
  | "Cyber Security"
  | "Cloud Computing"
  | "Data Science"
  | "DevOps"
  | "Blockchain"
  | "Internet of Things (IoT)"
  | "UI/UX Design";
type BlogPostOptions = "save" | "edit" | "delete" | "share" | "authorInfo";
type Props = {
  setCategory?: React.Dispatch<React.SetStateAction<CategoryTypes>>;
  category?: CategoryTypes;
  topics?: CategoryTypes[];
  TriggerChild: React.ReactNode;
  postcardOptions?: BlogPostOptions[];
  hideOption?: boolean;
  postId?: string;
};

export default function DropdownMenuDemo({
  topics,
  TriggerChild,
  setCategory,
  postcardOptions,
  hideOption,
  postId,
}: Props) {
  const hiddenOptions = ["edit", "delete"];
  const navigate = useNavigate();
  const handleDropdownCategory = (value: CategoryTypes) => {
    console.log(value);
    if (setCategory) {
      setCategory(value);
    }
  };
  const handleDropdownOptions = (value: BlogPostOptions) => {
    console.log(value);
    if (value === "edit") {
      navigate(`/editPost/${postId}`);
    }
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{TriggerChild}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white text-black shadow-md p-2 "
          side="top"
          sideOffset={-4}
          align="start"
          onClick={(e) => e.preventDefault()}
        >
          {topics?.map((topic) => (
            <DropdownMenu.Item
              key={topic}
              onSelect={() => handleDropdownCategory(topic)}
              className="p-1.5 mb-1 cursor-pointer hover:bg-gray-100 active:bg-gray-100  outline-0  rounded text-sm"
            >
              {topic}
            </DropdownMenu.Item>
          ))}
          {postcardOptions?.map((option) => {
            if (hideOption && hiddenOptions.includes(option)) {
              return null;
            }
            return (
              <DropdownMenu.Item
                key={option}
                onSelect={() => handleDropdownOptions(option)}
                className="p-1.5 md:mb-1  cursor-pointer hover:bg-gray-100 active:bg-gray-100  outline-0  rounded text-sm"
              >
                {option}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

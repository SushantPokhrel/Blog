import { Dialog } from "radix-ui";
import { IoMdClose } from "react-icons/io"; // Close icon
import { CiSearch } from "react-icons/ci";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
type Post = {
  title: string;
  banner: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  subTitle: string;
  _id: string;
  authorName: string;
  createdAt: string;
  likeCount: number;
};
const DialogDemo = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const focusRef = useRef<HTMLInputElement | null>(null);
  const idRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerFocus = (e: Event) => {
    if (focusRef.current) {
      e.preventDefault();
      focusRef.current.focus();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (e.target.value.trim() === "") {
      return;
    }
    if (idRef.current) {
      clearTimeout(idRef.current);
    }
    setLoading(true);
    console.log(e.target.value);
    idRef.current = setTimeout(() => {
      fetch(`${backendUrl}/api/posts/search?query=${value}`, {
        credentials: "include",
      })
        .then((res) => {
          if (res.status == 404) {
            setIsFound(false);
            setSearchedPosts([]);
            throw new Error("No results found");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Search results:", data);
          setIsFound(true);
          setSearchedPosts(data);
        })
        .catch((e) => {
          console.log(e.message);
          setIsFound(false);
          setSearchedPosts([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300); // 300ms d
  };
  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) {
          setQuery("");
          setSearchedPosts([]);
          setIsFound(false);
          setLoading(false);
        }
      }}
    >
      <Dialog.Trigger asChild>
        <div className="p-2 cursor-pointer active:bg-blue-200  text-gray-500 hover:text-gray-800">
          <CiSearch className="size-5" />
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay fixed inset-0 bg-gray-600/50" />
        <Dialog.Content
          onOpenAutoFocus={triggerFocus}
          className="DialogContent flex flex-col gap-4 bg-gray-800 text-white  w-full max-w-xs p-4 rounded-md fixed  left-1/2 top-1/3  -translate-x-1/2 md:top-1/4 md:max-w-xl"
        >
          <Dialog.Title className="DialogTitle text-base font-semibold flex justify-between">
            <p> Search a Post</p>
            <Dialog.Close asChild onClick={() => setQuery("")}>
              <IoMdClose className="size-5 cursor-pointer" />
            </Dialog.Close>
          </Dialog.Title>
          <Dialog.Description className="DialogDescription hidden">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
          <fieldset className="Fieldset">
            <input
              className="Input w-full p-1.5  outline-white border-2 rounded-sm border-white"
              id="keyword"
              placeholder="Search..."
              ref={focusRef}
              onChange={handleChange}
              value={query}
            />
          </fieldset>
          <div className="result text-sm">
            {loading ? (
              <p>Loading...</p>
            ) : isFound ? (
              searchedPosts?.map((post) => (
                <Dialog.Close asChild>
                  <Link
                    to={`/post/${post._id}`}
                    key={post._id}
                    className="cursor-pointer mt-2.5 p-3 line-clamp-2 shadow-sm shadow-gray-600 rounded-md active:bg-gray-600 hover:bg-gray-500 transition-all"
                  >
                    {post.title}
                  </Link>
                </Dialog.Close>
              ))
            ) : (
              <p>No result found</p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogDemo;

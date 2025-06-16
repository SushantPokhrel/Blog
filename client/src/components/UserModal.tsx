import React, { useEffect, useState } from "react";
import { Dialog, VisuallyHidden } from "radix-ui";
import Loader from "../components/Loader";
import Button from "../components/Button";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type AuthorInfo = {
  customUsername: string;
  email: string;
  profilePicture?: string;
  description?: string;
};

const fallbackImg =
  "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png";

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string | undefined;
};

export const UserModal: React.FC<Props> = ({ show, setShow, postId }) => {
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getAuthorInfo = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/auth/user/details/${postId}`,
        { credentials: "include" }
      );
      const data = await response.json();
      const { customUsername, email, picture, description } = data;

      setAuthorInfo({
        customUsername,
        email,
        profilePicture: picture || fallbackImg,
        description:
          description ||
          `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      });
    } catch (error) {
      console.error("Error fetching author info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && postId) {
      setLoading(true);
      getAuthorInfo();
    }
  }, [show, postId]);

  return (
    <Dialog.Root open={show} onOpenChange={(open) => setShow(open)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-[55] inset-0 bg-black/50 " />
        <Dialog.Content className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-full max-w-xs md:max-w-md p-6 rounded-xl shadow-lg fixed z-[60] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <VisuallyHidden.Root>
            <Dialog.Title className="text-lg font-semibold mb-4 text-center">
              Author Information
            </Dialog.Title>
          </VisuallyHidden.Root>

          {loading ? (
            <div className="flex justify-center text-sm items-center py-12">
              <Loader />
            </div>
          ) : authorInfo ? (
            <div className="flex flex-col items-center text-gray-200 text-center gap-2">
              <img
                src={authorInfo.profilePicture || fallbackImg}
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = fallbackImg)
                }
                alt="Author"
                className="w-20 h-20 rounded-full object-cover shadow-md ring-2 ring-blue-200"
              />
              <h2 className="text-lg font-semibold">
                {authorInfo.customUsername}
              </h2>
              <p className="text-xs">{authorInfo.email}</p>
              <p className="text-xs mt-2 ">{authorInfo.description}</p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs rounded">
                Get in touch
              </Button>
            </div>
          ) : (
            <p className="text-center text-red-500">No author data found.</p>
          )}

          <Dialog.Close asChild>
            <button
              className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-red-500"
              aria-label="Close"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

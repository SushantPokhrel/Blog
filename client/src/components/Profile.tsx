import React, { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import Loader from "./Loader";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE_MB = 1; // 1MB limit
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated } = useUserContext();

  const [savingUsername, setSavingUsername] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newUsername, setNewUsername] = useState(
    user.customUsername || user.username
  );

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setIsAuthenticated(false);
        setUser({
          email: "",
          username: "",
          profilePhoto: "",
          role: "",
        });
        alert("User logged out successfully");
        navigate("/user/auth");
      } else {
        alert("Failed logging out, try again");
      }
    } catch (e) {
      console.log(e);
      alert("Failed logging out, try again");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      alert("Username cannot be empty.");
      return;
    }
    setSavingUsername(true);
    try {
      const res = await fetch(`${backendUrl}/api/auth/user/${user.email}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: newUsername }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser((prevUser) => ({
          ...prevUser,
          customUsername: updatedUser.customUsername,
        }));
        alert("Username updated successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSavingUsername(false);
    }
  };

  const handleProfileImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingImage(true);
    if (!e.target.files) return;
    if (e.target.files?.[0].size > MAX_FILE_SIZE_BYTES) {
      alert("Image size must be less than 1mb");
      return;
    }
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append("profile-img", file);
    try {
      const response = await fetch(`${backendUrl}/api/auth/user/profileImg`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        alert("Could not upload image, try again");
        return;
      }
      const data = await response.json();
      setUser((prev) => ({
        ...prev,
        profilePhoto: data.image,
      }));
    } catch (e) {
      console.log(e);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  if (!user.email) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center md:space-x-6">
        <div className="flex-shrink-0 mb-4 md:mb-0">
          {uploadingImage ? (
            <Loader />
          ) : (
            <label htmlFor="profile-img" className="cursor-pointer">
              <img
                src={
                  user.profilePhoto ||
                  "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png"
                }
                alt="profile"
                className="text-center hover:opacity-75 active:opacity-75 w-28 h-28 text-xs italic object-cover rounded-full "
              />
            </label>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          name="profile-img"
          id="profile-img"
          onChange={handleProfileImg}
          accept="image/*"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-800">
            {user.customUsername || user.username}
          </h2>
          <p className="text-gray-600 text-xs mt-1 ">{user.email}</p>
          <p className="text-gray-500 text-xs mt-1 font-semibold">
            {user.role.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4 text-center">
        <h3 className="font-semibold text-gray-700 mb-2 text-sm">
          Hello {user.customUsername || user.username.split(" ")[0]}
        </h3>
        <p className="text-gray-600 text-xs">
          Welcome to your profile page! Here you can view and manage your
          personal information. We aim to ensure your data is always secure and
          up to date.
        </p>
      </div>
      {/* edit profile */}
      <div className="edit-profile mt-4">
        <fieldset className="border border-gray-300 rounded p-2">
          <legend className="text-sm font-semibold text-gray-700">
            Edit Username
          </legend>
          <div className="mt-2">
            <input
              type="text"
              id="username"
              name="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="mt-1 block  w-full bg-gray-100 rounded-sm text-sm focus:outline-blue-500 p-3"
              placeholder="Enter your username"
            />
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex justify-center space-x-3">
        <Button
          className="px-4 text-xs py-2 bg-blue-500 text-white active:bg-blue-600 hover:bg-blue-400 flex items-center justify-center gap-2"
          onClick={handleUsernameUpdate}
          disabled={savingUsername}
        >
          {savingUsername && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          )}
          {savingUsername ? "Saving..." : "Save Username"}
        </Button>

        <Button
          onClick={handleLogout}
          className="px-4 text-xs py-2 bg-red-500 text-white active:bg-red-600 hover:bg-red-400 flex items-center justify-center gap-2"
          disabled={loggingOut}
        >
          {loggingOut && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          )}
          {loggingOut ? "Logging out..." : "Log Out"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;

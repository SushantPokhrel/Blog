import React, { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import Loader from "./Loader";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState(user.customUsername||user.username);

  const handleLogout = async () => {
    setLoading(true);
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
        return;
      }
    } catch (e) {
      console.log(e);
      alert("Failed logging out, try again");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    setLoading(true);
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
      setLoading(false);
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
          <img
            src={user.profilePhoto}
            alt={`${user.username}'s profile`}
            className="w-100% h-auto object-cover rounded-full border-2 border-black"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.customUsername || user.username}
          </h2>
          <p className="text-gray-600 text-sm mt-1">{user.email}</p>
          <p className="text-gray-500 text-sm mt-1 font-semibold">
            {user.role.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-700 mb-2">
          Hello {user.username.split(" ")[0]}
        </h3>
        <p className="text-gray-600 text-sm">
          Welcome to your profile page! Here you can view and manage your
          personal information. We aim to ensure your data is always secure and
          up to date.
        </p>
      </div>

      <div className="mt-6 flex justify-center space-x-3">
        <Button
          className="px-4 text-xs py-2 bg-blue-500 text-white active:bg-blue-600 hover:bg-blue-400"
          onClick={handleUsernameUpdate}
        >
          {loading ? "Saving..." : "Save Username"}
        </Button>
        <Button
          onClick={handleLogout}
          className="px-4 text-xs py-2 bg-red-500 text-white active:bg-red-600 hover:bg-red-400"
        >
          {loading ? "Logging out..." : "Log Out"}
        </Button>
      </div>

      {/* Edit profile */}
      <div className="edit-profile mt-4">
        <fieldset className="border border-gray-300 rounded p-4">
          <legend className="text-base font-semibold text-gray-700">
            Edit Username
          </legend>
          <div className="mt-2">
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="mt-1 block w-full rounded-sm text-sm border-b border-b-gray-400 focus:outline-blue-500 focus:ring-blue-500 p-2"
              placeholder="Enter your username"
            />
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default Profile;

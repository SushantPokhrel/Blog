import React from "react";
import { FaCheckDouble } from "react-icons/fa6";
import { useAuthContext } from "../contexts/AuthContext";
import NotificationCard from "../components/NotificationCard";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Notifications: React.FC = () => {
  const { notifications, setNotifications } = useAuthContext();
  const handleReadNotifications = async () => {
    const res = await fetch(`${backendUrl}/api/notifications/read`, {
      credentials: "include",
      method: "PATCH",
    });
    if (res.ok) {
      setNotifications((prev) => {
        return prev.map((n) => ({ ...n, isRead: true }));
      });
    }
  };
  return (
    <div className="max-w-sm md:p-2.5 md:mx-auto md:max-w-2xl">
      <div className="notifications flex flex-col gap-2 text-sm">
        {notifications && notifications.length ? (
          <>
            {notifications.some((n) => n.isRead == false) && (
              <div className="text-blue-500 flex justify-end items-center gap-2">
                <p>Mark all as read</p>
                <FaCheckDouble
                  className="size-5 cursor-pointer"
                  onClick={handleReadNotifications}
                />
              </div>
            )}
            <NotificationCard />
          </>
        ) : (
          <h2 className="text-sm text-gray-700">No notifications to show</h2>
        )}
      </div>
    </div>
  );
};

export default Notifications;

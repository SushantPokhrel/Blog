type NotificationsTypes = {
  likerName: string;
  postTitle: string;
  likes: number;
  postOwnerName: string;
  likerProfile: string;
  createdAt: string;
  displayTime:string
};

import React from "react";
import { useAuthContext } from "../contexts/AuthContext";

const NotificationCard: React.FC = () => {
  const { notifications } = useAuthContext();

  return (
    <>
    {notifications.length && <h1 className="text-gray-700 text-base font-semibold">All Notifications</h1>}
      {notifications.map((notification: NotificationsTypes, index: number) => (
        <div
          key={index}
          className="flex  gap-3 text-gray-700 items-center border-b p-2.5 mb-2 border-gray-100"
        >
          <div className="shrink-0">
            <img
              src={notification.likerProfile}
              className="rounded-full w-10 h-10 object-cover italic"
            />
          </div>
          <div className="text-xs md:text-sm">
            <h1>
              <strong>{notification.likerName}</strong> liked your post
            </h1>
            <p className="mt-1.5">
              "{notification.postTitle}" by you has {notification.likes} like
              {notification.likes !== 1 ? "s" : ""}.
            </p>
            <p className="mt-1.5 text-xs">{notification.displayTime}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationCard;

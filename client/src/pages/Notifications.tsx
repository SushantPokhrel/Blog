import React from "react";
import { useAuthContext } from "../contexts/AuthContext";

const Notifications: React.FC = () => {
  const { notifications } = useAuthContext();
  console.log(notifications);
  return (
    <div className="text-center">
      {/* <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
        Notifications
      </h1> */}
      <div className="notifications flex flex-col gap-2 ">
        <h2 className="text-sm text-gray-700">No notifications to show</h2>
      </div>
    </div>
  );
};

export default Notifications;

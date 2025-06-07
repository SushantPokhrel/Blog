import React from "react";
import { useUserContext } from "../contexts/UserContext";

const Users: React.FC = () => {
  const { user } = useUserContext();

  return <div className="users">this is users section</div>;
};

export default Users;

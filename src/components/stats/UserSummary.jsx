import React from "react";
import ProfileAvatar from "../ProfileAvatar";
import UserStatsCard from "./UserStatsCard";

const UserSummary = () => {
  return (
<div className="hidden md:flex gap-2 flex-wrap items-start w-[350px]">
  <div>
    <ProfileAvatar />
  </div>
  <div>
    <UserStatsCard />
  </div>
</div>

  );
};

export default UserSummary;

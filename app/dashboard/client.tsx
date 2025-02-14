"use client";

import { TaskList } from "@/components/tasks.list";
import { UserProfile } from "@/components/user.profile";

export default function ClientDashboard() {
  return (
    <>
      <div className="flex justify-between items-start">
        <UserProfile />
      </div>
      <TaskList />
    </>
  );
}

import { TaskList } from "@/components/tasks.list";
import { AddProject } from "@/components/projects.add";
import { AddTask } from "@/components/tasks.add";
import { UserProfile } from "@/components/user.profile";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <UserProfile />
        <div className="space-x-4">
          <AddProject />
          <AddTask />
        </div>
      </div>
      <TaskList />
    </div>
  );
}

import { UserProfile } from "@/components/user.profile";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <UserProfile />
      </div>
    </div>
  );
}

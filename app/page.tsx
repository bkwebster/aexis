import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { TaskList } from "@/components/tasks.list";
import { AddProject } from "@/components/projects.add";
import { AddTask } from "@/components/tasks.add";
import { Calendar } from "@/components/ui.calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import UIUser from "@/components/ui.user";
import {
  Calendar as CalendarIcon,
  PenLine,
  Pyramid,
  Rows3,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-x-4">
          <div className="grid grid-cols-[32px_1fr_32px_1fr_32px_1fr_32px_1fr_128px] grid-rows-[96px_1fr_32px] gap-0 h-screen w-screen overflow-hidden">
            {/* Row 1 */}
            <div className="border-r border-b flex items-start justify-end p-3 relative">
              <svg
                width="7"
                height="64"
                viewBox="0 0 7 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.349505 49.7763L0.880499 49.2366C0.993662 49.1148 1.16776 48.9233 1.48984 48.9233L6.99999 48.9233L6.99999 50.0897L4.10999 50.0897L4.10128 62.2677L4.6758 62.8336L6.99999 62.8336L6.99999 64L4.38854 64C4.06646 64 3.89237 63.8085 3.7792 63.6866L3.24821 63.1469C3.12634 63.0251 2.93484 62.8684 2.93484 62.5463L2.94354 50.0897L1.7771 50.0897L1.19387 50.6642L1.19387 64L0.0361328 64L0.0361322 50.377C0.0361322 50.0549 0.227638 49.8982 0.349505 49.7763Z"
                  fill="currentColor"
                />
                <path
                  d="M0.0361308 17.5118L1.48984 17.5118C1.81191 17.5118 1.9686 17.7207 2.09047 17.8339L3.51806 19.244L4.94565 17.8339C5.06752 17.7207 5.2242 17.5118 5.54628 17.5118L6.99999 17.5118L6.99999 18.6782L5.83354 18.6782L4.10128 20.4105L4.10128 29.6898L5.83354 31.4221L6.99999 31.4221L6.99999 32.5885L5.54628 32.5885C5.2242 32.5885 5.06752 32.3796 4.94565 32.2665L3.51806 30.8563L2.09047 32.2665C1.9686 32.3796 1.81191 32.5885 1.48984 32.5885L0.0361314 32.5885L0.0361314 31.4221L1.20258 31.4221L2.93484 29.6898L2.93484 20.4105L1.20258 18.6782L0.0361308 18.6782L0.0361308 17.5118Z"
                  fill="currentColor"
                />
                <path
                  d="M1.19387 7.66985e-06L1.19387 13.3358L1.77709 13.9103L2.93591 13.9103L2.93591 7.59371e-06L5.55498 7.47922e-06C5.86836 7.46553e-06 6.04245 0.191511 6.15562 0.313379L6.68661 0.853078C6.80848 0.974945 6.99998 1.13163 6.99998 1.45371L6.99998 15.0768L5.84224 15.0768L5.84224 1.74097L5.25902 1.16645L4.10236 1.16645L4.10236 15.0768L1.48113 15.0768C1.16776 15.0768 0.993661 14.8852 0.880498 14.7634L0.349504 14.2237C0.227637 14.1018 0.0361306 13.9451 0.0361306 13.623L0.03613 7.72046e-06L1.19387 7.66985e-06Z"
                  fill="currentColor"
                />
                <path
                  d="M0.0361307 15.7064L6.99998 15.7064L6.99999 16.8729L0.0361308 16.8729L0.0361307 15.7064Z"
                  fill="currentColor"
                />
                <path
                  d="M0.0361321 46.8366L0.0361315 33.2135L3.53064 33.2135L4.10516 33.788L4.10516 47.1238L5.24827 47.1238L5.8402 46.5406L5.8402 33.2135L6.98923 33.2135L6.98923 46.8366C6.98923 47.1586 6.79773 47.3153 6.67586 47.4372L6.14487 47.9769C6.0317 48.0988 5.85761 48.2903 5.53553 48.2903L1.48113 48.2903C1.16776 48.2903 0.993662 48.0988 0.880499 47.9769L0.349506 47.4372C0.227638 47.3153 0.0361321 47.1586 0.0361321 46.8366ZM2.93872 47.1238L2.93872 34.38L1.18517 34.38L1.18517 46.5406L1.7771 47.1238L2.93872 47.1238Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="border-r border-b overflow-hidden w-full h-full flex items-start justify-between flex-col p-3">
              <Calendar week={2} />
              <div className="font-mono text-xs text-foreground uppercase flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Pyramid size="11" />
                </div>
                <div className="text-muted hover:text-foreground transition-colors duration-120 cursor-pointer">
                  Date
                </div>
                <div className="text-muted hover:text-foreground transition-colors duration-120 cursor-pointer">
                  Project
                </div>
              </div>
            </div>
            <div className="border-r border-b" />
            <div className="border-r border-b overflow-hidden w-full h-full flex items-start justify-start flex-col p-3">
              <Calendar week={3} />
            </div>
            <div className="border-r border-b" />
            <div className="border-r border-b overflow-hidden w-full h-full flex items-start justify-start flex-col p-3">
              <Calendar week={4} />
            </div>
            <div className="border-r border-b" />
            <div className="border-r border-b overflow-hidden w-full h-full flex items-start justify-start flex-col p-3">
              <Calendar week={5} />
            </div>
            <div className="border-b" />
            {/* Row 2 */}
            <div className="border-r border-b overflow-hidden">
              <div className="py-3 px-2 flex flex-col gap-3 w-full h-full justify-start items-end">
                <Rows3
                  size="16"
                  strokeWidth="1.5"
                  className="text-foreground hover:text-foreground transition-colors duration-120 cursor-pointer"
                />
                <PenLine
                  size="16"
                  strokeWidth="1.5"
                  className="text-muted hover:text-foreground transition-colors duration-120 cursor-pointer"
                />
                <CalendarIcon
                  size={16}
                  strokeWidth={1.5}
                  className="text-muted hover:text-foreground transition-colors duration-120 cursor-pointer"
                />
                <div className="mt-auto mr-[2px] w-full absolute bottom-1.5 left-1.5">
                  <UIUser />
                </div>
              </div>
            </div>

            <ScrollArea className="border-r border-b h-full w-full">
              <div className="p-3 flex flex-col gap-3">
                <TaskList week={1} />
              </div>
            </ScrollArea>

            <div className="border-r border-b overflow-hidden" />

            <ScrollArea className="border-r border-b h-full w-full">
              <div className="p-3 flex flex-col gap-3">
                <TaskList week={2} />
              </div>
            </ScrollArea>

            <div className="border-r border-b overflow-hidden" />
            <ScrollArea className="border-r border-b h-full w-full">
              <div className="p-3 flex flex-col gap-3">
                <TaskList week={3} />
              </div>
            </ScrollArea>
            <div className="border-r border-b overflow-hidden" />

            <ScrollArea className="border-r border-b h-full w-full">
              <div className="p-3 flex flex-col gap-3">
                <TaskList week={4} />
              </div>
            </ScrollArea>

            <div className="border-r border-b overflow-hidden" />

            {/* Row 5 */}
            <div className="border-r" />
            <div className="border-r" />
            <div className="border-r" />
            <div className="border-r" />
            <div className="border-r" />
            <div className="border-r" />
            <div className="border-r" />
            <div className="border-r" />
            <div />
          </div>
          {/* <AddProject />
          <AddTask /> */}
        </div>
      </div>
    </div>
  );
}

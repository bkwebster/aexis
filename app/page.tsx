import { createClient } from "@/utils/supabase/server";
import { Auth } from "@/components/auth.entry";
import { TaskList } from "@/components/tasks";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return <TaskList />;
  }

  return <Auth />;
}

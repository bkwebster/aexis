import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/database.types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getProjects() {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) throw error;
  return data;
}

export async function getTasksForTimeline() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*, project:projects(name), client:clients(name)")
    .order("due_date", { ascending: true })
    .limit(10);
  if (error) throw error;
  return data;
}

export async function getTasksForProject(projectId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      "*, project:projects(name), client:clients(name), tags:task_tags(tag:tags(name))"
    )
    .eq("project_id", projectId)
    .order("due_date", { ascending: true });
  if (error) throw error;
  return data;
}

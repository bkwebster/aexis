import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/database.types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Task = Database["public"]["Tables"]["tasks"]["Row"] & {
  project: { name: string } | null;
  client: { name: string } | null;
};

export type Project = Database["public"]["Tables"]["projects"]["Row"];

export async function fetchTasks(projectId?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  let query = supabase
    .from("tasks")
    .select("*, project:projects(name), client:clients(name)")
    .eq("user_id", user.id)
    .order("order", { ascending: true });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Error fetching tasks: " + error.message);
  }

  return data || [];
}

export async function updateTaskOrder(tasks: Task[]) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const updates = tasks.map((task, index) => ({
    id: task.id,
    order: index,
    user_id: user.id,
    title: task.title,
    client_id: task.client_id,
    project_id: task.project_id,
    description: task.description,
    due_date: task.due_date,
    priority: task.priority,
    status: task.status,
  }));

  const { error } = await supabase.from("tasks").upsert(updates, {
    onConflict: "id",
  });

  if (error) {
    throw new Error("Error updating task order: " + error.message);
  }
}

export async function fetchProjects() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Error fetching projects: " + error.message);
  }

  return data || [];
}

export async function createProject(name: string, description?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, description, user_id: user.id })
    .select();

  if (error) {
    throw new Error("Error creating project: " + error.message);
  }

  return data[0];
}

export async function createTask(
  task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...task, user_id: user.id })
    .select();

  if (error) {
    throw new Error("Error creating task: " + error.message);
  }

  return data[0];
}

export function subscribeToTasks(callback: () => void) {
  const channel = supabase
    .channel("tasks_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw new Error("Error fetching current user: " + error.message);
  return user;
}

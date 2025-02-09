import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/database.types";

type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"] & {
  project: { name: string } | null;
  client: { name: string } | null;
};

export type Project = Database["public"]["Tables"]["projects"]["Row"];

const supabase = createClient();

export const fetchTasks = async ({
  projectId,
  sortKey = "order",
}: {
  projectId?: string;
  sortKey?: string;
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("User not authenticated");

  let query = supabase
    .from("tasks")
    .select("*, project:projects(name), client:clients(name)")
    .eq("user_id", user.id)
    .order(sortKey, { ascending: true });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Error fetching tasks: " + error.message);
  }

  return data || [];
};

export const fetchProjects = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Error fetching projects: " + error.message);
  }

  return data || [];
};

export const createProject = async (name: string, description?: string) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, description, user_id: user.id })
    .select()
    .single();

  if (error) {
    throw new Error("Error creating project: " + error.message);
  }

  return data;
};

export const createTask = async (task: Omit<TaskInsert, "user_id">) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...task, user_id: user.id })
    .select()
    .single();

  if (error) {
    throw new Error("Error creating task: " + error.message);
  }

  return data;
};

export const updateTaskOrder = async (tasks: Task[]) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("User not authenticated");

  // Update each task's order individually
  for (let i = 0; i < tasks.length; i++) {
    const { error } = await supabase
      .from("tasks")
      .update({ order: i })
      .eq("id", tasks[i].id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error("Error updating task order: " + error.message);
    }
  }
};

export const subscribeToTasks = (callback: () => void) => {
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
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error("Error fetching current user: " + error.message);
  return user;
};

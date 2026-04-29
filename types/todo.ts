export const TODO_STATUSES = ["todo", "in-progress", "done"] as const;

export type TodoStatus = (typeof TODO_STATUSES)[number];

export type Todo = {
  id: string;
  title: string;
  status: TodoStatus;
  createdAt: number;
};

export const TODO_STATUS_LABELS: Record<TodoStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

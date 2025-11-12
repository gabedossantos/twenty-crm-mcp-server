/**
 * Task domain handlers - Using base CRUD handler
 */

import { createCRUDHandlers } from "../../shared/base-handler.js";
import { transformBodyV2 } from "../../shared/transformers.js";
import {
  CREATE_TASK_MUTATION,
  GET_TASK_QUERY,
  LIST_TASKS_QUERY,
  UPDATE_TASK_MUTATION,
} from "./queries.js";
import {
  CreateTaskInput,
  UpdateTaskInput,
  ListTasksParams,
  Task,
  TaskGraphQLInput,
} from "./types.js";

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(data: CreateTaskInput): TaskGraphQLInput {
  const input: TaskGraphQLInput = {
    title: data.title,
  };

  if (data.body) {
    input.bodyV2 = transformBodyV2(data.body);
  }

  if (data.status) input.status = data.status;
  if (data.dueAt) input.dueAt = data.dueAt;
  if (data.assigneeId) input.assigneeId = data.assigneeId;

  return input;
}

/**
 * Transform update input to GraphQL format
 */
function transformUpdateInput(data: UpdateTaskInput): Partial<TaskGraphQLInput> {
  const { id, ...updates } = data;
  const input: Partial<TaskGraphQLInput> = {};

  if (updates.title !== undefined) input.title = updates.title;

  if (updates.body !== undefined) {
    input.bodyV2 = transformBodyV2(updates.body);
  }

  if (updates.status !== undefined) input.status = updates.status;
  if (updates.dueAt !== undefined) input.dueAt = updates.dueAt;
  if (updates.assigneeId !== undefined) input.assigneeId = updates.assigneeId;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(
  params: ListTasksParams
): Record<string, unknown> | null {
  const { searchTerm, status, assigneeId } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) filter.title = { ilike: `%${searchTerm}%` };
  if (status) filter.status = { eq: status };
  if (assigneeId) filter.assigneeId = { eq: assigneeId };

  return Object.keys(filter).length > 0 ? filter : null;
}

// Create CRUD handlers using base handler
const handlers = createCRUDHandlers<
  CreateTaskInput,
  UpdateTaskInput,
  Task,
  TaskGraphQLInput,
  ListTasksParams
>({
  entityName: "task",
  entityNameCapitalized: "Task",
  queries: {
    create: CREATE_TASK_MUTATION,
    get: GET_TASK_QUERY,
    list: LIST_TASKS_QUERY,
    update: UPDATE_TASK_MUTATION,
  },
  transformCreateInput,
  transformUpdateInput,
  buildListFilter,
  formatCreateSuccess: (task) => `✅ Created task: ${task.title}`,
});

// Export handlers
export const createTask = handlers.create;
export const getTask = handlers.get;
export const listTasks = handlers.list;
export const updateTask = handlers.update;

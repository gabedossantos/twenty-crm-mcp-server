/**
 * Task domain type definitions
 */

import { BodyV2Composite, NameComposite } from "../../shared/types.js";

// ======================
// INPUT TYPES
// ======================

export interface CreateTaskInput {
  title: string;
  body?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  dueAt?: string;
  assigneeId?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  body?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  dueAt?: string;
  assigneeId?: string;
}

export interface ListTasksParams {
  limit?: number;
  searchTerm?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  assigneeId?: string;
}

// ======================
// GRAPHQL TYPES
// ======================

export interface TaskGraphQLInput {
  title: string;
  bodyV2?: BodyV2Composite;
  status?: string;
  dueAt?: string;
  assigneeId?: string;
}

// ======================
// DOMAIN MODEL
// ======================

export interface Task {
  id: string;
  title: string;
  bodyV2?: BodyV2Composite;
  status?: string;
  dueAt?: string;
  position?: number;
  assigneeId?: string;
  assignee?: {
    id: string;
    name: NameComposite;
  };
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface TasksEdge {
  node: Task;
}

export interface TasksConnection {
  edges: TasksEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

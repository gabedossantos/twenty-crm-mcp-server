/**
 * MCP tool definitions for Task operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TASK_TOOLS: Tool[] = [
  {
    name: "create_task",
    description: "Create a new task in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Task title (required)" },
        body: {
          type: "string",
          description: "Task body/description in markdown format",
        },
        status: {
          type: "string",
          description: "Task status",
          enum: ["TODO", "IN_PROGRESS", "DONE"],
          default: "TODO",
        },
        dueAt: {
          type: "string",
          description: "Due date (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ)",
        },
        assigneeId: {
          type: "string",
          description: "ID of the workspace member to assign the task to",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "get_task",
    description: "Get details of a specific task by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Task ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_tasks",
    description: "List tasks with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
        searchTerm: {
          type: "string",
          description: "Search by task title",
        },
        status: {
          type: "string",
          description: "Filter by status",
          enum: ["TODO", "IN_PROGRESS", "DONE"],
        },
        assigneeId: {
          type: "string",
          description: "Filter by assignee ID",
        },
      },
    },
  },
  {
    name: "update_task",
    description: "Update an existing task's information",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Task ID (required)" },
        title: { type: "string", description: "Task title" },
        body: {
          type: "string",
          description: "Task body/description in markdown format",
        },
        status: {
          type: "string",
          description: "Task status",
          enum: ["TODO", "IN_PROGRESS", "DONE"],
        },
        dueAt: {
          type: "string",
          description: "Due date (ISO 8601 format)",
        },
        assigneeId: {
          type: "string",
          description: "ID of the workspace member assigned to the task",
        },
      },
      required: ["id"],
    },
  },
];

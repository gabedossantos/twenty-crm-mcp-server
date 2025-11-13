/**
 * MCP tool definitions for TaskTarget operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TASK_TARGET_TOOLS: Tool[] = [
  {
    name: "create_task_target",
    description:
      "Link a task to a person, company, or opportunity in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "Task ID to link (required)",
        },
        personId: {
          type: "string",
          description: "Person ID to link the task to",
        },
        companyId: {
          type: "string",
          description: "Company ID to link the task to",
        },
        opportunityId: {
          type: "string",
          description: "Opportunity ID to link the task to",
        },
      },
      required: ["taskId"],
    },
  },
  {
    name: "list_task_targets",
    description:
      "List task targets (links between tasks and other entities) with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "Filter by task ID - show all entities linked to this task",
        },
        personId: {
          type: "string",
          description: "Filter by person ID - show all tasks linked to this person",
        },
        companyId: {
          type: "string",
          description: "Filter by company ID - show all tasks linked to this company",
        },
        opportunityId: {
          type: "string",
          description:
            "Filter by opportunity ID - show all tasks linked to this opportunity",
        },
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
      },
    },
  },
  {
    name: "delete_task_target",
    description: "Remove a link between a task and an entity (person, company, or opportunity)",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Task target ID to delete",
        },
      },
      required: ["id"],
    },
  },
];

/**
 * MCP tool definitions for Attachment operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ATTACHMENT_TOOLS: Tool[] = [
  {
    name: "create_attachment",
    description: "Upload/create an attachment and link it to a record in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Attachment name/filename (required)",
        },
        fullPath: {
          type: "string",
          description: "Full path or URL to the file (required)",
        },
        fileCategory: {
          type: "string",
          description: "File category (optional)",
          enum: [
            "ARCHIVE",
            "AUDIO",
            "IMAGE",
            "PRESENTATION",
            "SPREADSHEET",
            "TEXT_DOCUMENT",
            "VIDEO",
            "OTHER",
          ],
        },
        taskId: {
          type: "string",
          description: "Task ID to attach the file to",
        },
        opportunityId: {
          type: "string",
          description: "Opportunity ID to attach the file to",
        },
        companyId: {
          type: "string",
          description: "Company ID to attach the file to",
        },
        personId: {
          type: "string",
          description: "Person ID to attach the file to",
        },
        workflowId: {
          type: "string",
          description: "Workflow ID to attach the file to",
        },
        dashboardId: {
          type: "string",
          description: "Dashboard ID to attach the file to",
        },
        authorId: {
          type: "string",
          description: "Author ID (workspace member who created the attachment)",
        },
      },
      required: ["name", "fullPath"],
    },
  },
  {
    name: "get_attachment",
    description: "Get details of a specific attachment by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Attachment ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_attachments",
    description:
      "List attachments with optional filtering by entity type, file category, or search term",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
        searchTerm: {
          type: "string",
          description: "Search by attachment name",
        },
        fileCategory: {
          type: "string",
          description: "Filter by file category",
          enum: [
            "ARCHIVE",
            "AUDIO",
            "IMAGE",
            "PRESENTATION",
            "SPREADSHEET",
            "TEXT_DOCUMENT",
            "VIDEO",
            "OTHER",
          ],
        },
        taskId: {
          type: "string",
          description: "Filter by task ID - show attachments for this task",
        },
        opportunityId: {
          type: "string",
          description:
            "Filter by opportunity ID - show attachments for this opportunity",
        },
        companyId: {
          type: "string",
          description:
            "Filter by company ID - show attachments for this company",
        },
        personId: {
          type: "string",
          description: "Filter by person ID - show attachments for this person",
        },
        workflowId: {
          type: "string",
          description:
            "Filter by workflow ID - show attachments for this workflow",
        },
        dashboardId: {
          type: "string",
          description:
            "Filter by dashboard ID - show attachments for this dashboard",
        },
        authorId: {
          type: "string",
          description: "Filter by author ID (workspace member)",
        },
      },
    },
  },
  {
    name: "delete_attachment",
    description: "Delete an attachment from Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Attachment ID to delete" },
      },
      required: ["id"],
    },
  },
];

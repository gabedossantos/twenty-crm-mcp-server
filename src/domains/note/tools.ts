/**
 * MCP tool definitions for Note operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const NOTE_TOOLS: Tool[] = [
  {
    name: "create_note",
    description: "Create a new note in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Note title (required)" },
        body: {
          type: "string",
          description: "Note body/content in markdown format",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "get_note",
    description: "Get details of a specific note by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Note ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_notes",
    description: "List notes with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
        searchTerm: {
          type: "string",
          description: "Search by note title",
        },
      },
    },
  },
  {
    name: "update_note",
    description: "Update an existing note's information",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Note ID (required)" },
        title: { type: "string", description: "Note title" },
        body: {
          type: "string",
          description: "Note body/content in markdown format",
        },
      },
      required: ["id"],
    },
  },
];

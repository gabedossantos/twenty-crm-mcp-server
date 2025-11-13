/**
 * MCP tool definitions for TimelineActivity operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TIMELINE_ACTIVITY_TOOLS: Tool[] = [
  {
    name: "create_timeline_activity",
    description:
      "Create a timeline activity event in Twenty CRM (tracks events, interactions, and changes)",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Activity name/title (required)",
        },
        properties: {
          type: "object",
          description:
            "JSON object with activity details (e.g., {type: 'CALL', notes: 'Discussed pricing'})",
        },
        happensAt: {
          type: "string",
          description:
            "When the activity occurred (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ)",
        },
        workspaceMemberId: {
          type: "string",
          description: "ID of the workspace member associated with this activity",
        },
        personId: {
          type: "string",
          description: "Person ID to associate with this activity",
        },
        companyId: {
          type: "string",
          description: "Company ID to associate with this activity",
        },
        opportunityId: {
          type: "string",
          description: "Opportunity ID to associate with this activity",
        },
        noteId: {
          type: "string",
          description: "Note ID to associate with this activity",
        },
        taskId: {
          type: "string",
          description: "Task ID to associate with this activity",
        },
        linkedRecordId: {
          type: "string",
          description: "Linked record ID",
        },
        linkedObjectMetadataId: {
          type: "string",
          description: "Linked object metadata ID",
        },
        linkedRecordCachedName: {
          type: "string",
          description: "Cached name of the linked record",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "get_timeline_activity",
    description: "Get details of a specific timeline activity by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Timeline activity ID",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_timeline_activities",
    description:
      "List timeline activities (events and interactions) with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
        searchTerm: {
          type: "string",
          description: "Search by activity name",
        },
        personId: {
          type: "string",
          description:
            "Filter by person ID - show activities for this person",
        },
        companyId: {
          type: "string",
          description:
            "Filter by company ID - show activities for this company",
        },
        opportunityId: {
          type: "string",
          description:
            "Filter by opportunity ID - show activities for this opportunity",
        },
        workspaceMemberId: {
          type: "string",
          description: "Filter by workspace member ID",
        },
        noteId: {
          type: "string",
          description: "Filter by note ID - show activities for this note",
        },
        taskId: {
          type: "string",
          description: "Filter by task ID - show activities for this task",
        },
      },
    },
  },
  {
    name: "update_timeline_activity",
    description: "Update an existing timeline activity's information",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Timeline activity ID (required)",
        },
        name: {
          type: "string",
          description: "Activity name/title",
        },
        properties: {
          type: "object",
          description: "JSON object with activity details",
        },
        happensAt: {
          type: "string",
          description: "When the activity occurred (ISO 8601 format)",
        },
        workspaceMemberId: {
          type: "string",
          description: "ID of the workspace member associated with this activity",
        },
        personId: {
          type: "string",
          description: "Person ID to associate with this activity",
        },
        companyId: {
          type: "string",
          description: "Company ID to associate with this activity",
        },
        opportunityId: {
          type: "string",
          description: "Opportunity ID to associate with this activity",
        },
        noteId: {
          type: "string",
          description: "Note ID to associate with this activity",
        },
        taskId: {
          type: "string",
          description: "Task ID to associate with this activity",
        },
        linkedRecordId: {
          type: "string",
          description: "Linked record ID",
        },
        linkedObjectMetadataId: {
          type: "string",
          description: "Linked object metadata ID",
        },
        linkedRecordCachedName: {
          type: "string",
          description: "Cached name of the linked record",
        },
      },
      required: ["id"],
    },
  },
];

// Keep the old export name for backward compatibility in index.ts
export const ACTIVITY_TOOLS = TIMELINE_ACTIVITY_TOOLS;

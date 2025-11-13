/**
 * MCP tool definitions for NoteTarget operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const NOTE_TARGET_TOOLS: Tool[] = [
  {
    name: "create_note_target",
    description:
      "Link a note to a person, company, or opportunity in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
          description: "Note ID to link (required)",
        },
        personId: {
          type: "string",
          description: "Person ID to link the note to",
        },
        companyId: {
          type: "string",
          description: "Company ID to link the note to",
        },
        opportunityId: {
          type: "string",
          description: "Opportunity ID to link the note to",
        },
      },
      required: ["noteId"],
    },
  },
  {
    name: "list_note_targets",
    description:
      "List note targets (links between notes and other entities) with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
          description: "Filter by note ID - show all entities linked to this note",
        },
        personId: {
          type: "string",
          description: "Filter by person ID - show all notes linked to this person",
        },
        companyId: {
          type: "string",
          description: "Filter by company ID - show all notes linked to this company",
        },
        opportunityId: {
          type: "string",
          description:
            "Filter by opportunity ID - show all notes linked to this opportunity",
        },
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
      },
    },
  },
  {
    name: "delete_note_target",
    description: "Remove a link between a note and an entity (person, company, or opportunity)",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Note target ID to delete",
        },
      },
      required: ["id"],
    },
  },
];

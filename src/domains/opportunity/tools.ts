/**
 * MCP tool definitions for Opportunity operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const OPPORTUNITY_TOOLS: Tool[] = [
  {
    name: "create_opportunity",
    description: "Create a new opportunity in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Opportunity name (required)" },
        amount: {
          type: "number",
          description: "Deal amount (will be stored in micros)",
        },
        currency: {
          type: "string",
          description: "Currency code (e.g., 'EUR', 'USD')",
          default: "USD",
        },
        stage: {
          type: "string",
          description:
            "Opportunity stage (e.g., 'NEW', 'SCREENING', 'MEETING', 'PROPOSAL', 'CUSTOMER')",
        },
        closeDate: {
          type: "string",
          description: "Expected close date (ISO 8601 format: YYYY-MM-DD)",
        },
        companyId: {
          type: "string",
          description: "Company ID to associate with",
        },
        pointOfContactId: {
          type: "string",
          description: "Person ID for point of contact",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "get_opportunity",
    description: "Get details of a specific opportunity by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Opportunity ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_opportunities",
    description: "List opportunities with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
        searchTerm: {
          type: "string",
          description: "Search by opportunity name",
        },
        companyId: {
          type: "string",
          description: "Filter by company ID",
        },
        stage: {
          type: "string",
          description: "Filter by stage",
        },
      },
    },
  },
  {
    name: "update_opportunity",
    description: "Update an existing opportunity's information",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Opportunity ID (required)" },
        name: { type: "string", description: "Opportunity name" },
        amount: { type: "number", description: "Deal amount" },
        currency: { type: "string", description: "Currency code" },
        stage: { type: "string", description: "Opportunity stage" },
        closeDate: {
          type: "string",
          description: "Expected close date (ISO 8601)",
        },
        companyId: { type: "string", description: "Company ID" },
        pointOfContactId: {
          type: "string",
          description: "Point of contact person ID",
        },
      },
      required: ["id"],
    },
  },
];

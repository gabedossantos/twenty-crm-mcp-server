/**
 * MCP tool definitions for Person operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const PERSON_TOOLS: Tool[] = [
  {
    name: "create_person",
    description: "Create a new person in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        firstName: {
          type: "string",
          description: "First name (required)",
        },
        lastName: {
          type: "string",
          description: "Last name (required)",
        },
        email: {
          type: "string",
          description: "Primary email address",
        },
        phone: {
          type: "string",
          description: "Primary phone number (e.g., '1234567890')",
        },
        phoneCountryCode: {
          type: "string",
          description: "Phone country code (e.g., 'US', 'DE')",
        },
        phoneCallingCode: {
          type: "string",
          description: "Phone calling code (e.g., '+1', '+49')",
        },
        jobTitle: {
          type: "string",
          description: "Job title",
        },
        companyId: {
          type: "string",
          description: "Company ID to associate with",
        },
        linkedinUrl: {
          type: "string",
          description: "LinkedIn profile URL",
        },
        xUrl: {
          type: "string",
          description: "X/Twitter profile URL",
        },
        city: {
          type: "string",
          description: "City",
        },
      },
      required: ["firstName", "lastName"],
    },
  },
  {
    name: "get_person",
    description: "Get details of a specific person by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Person ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_people",
    description: "List people with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
        searchTerm: {
          type: "string",
          description: "Search by name or email",
        },
        companyId: {
          type: "string",
          description: "Filter by company ID",
        },
      },
    },
  },
  {
    name: "update_person",
    description: "Update an existing person's information",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Person ID (required)" },
        firstName: { type: "string", description: "First name" },
        lastName: { type: "string", description: "Last name" },
        email: { type: "string", description: "Primary email address" },
        phone: { type: "string", description: "Primary phone number" },
        phoneCountryCode: { type: "string", description: "Phone country code" },
        phoneCallingCode: { type: "string", description: "Phone calling code" },
        jobTitle: { type: "string", description: "Job title" },
        companyId: { type: "string", description: "Company ID" },
        linkedinUrl: { type: "string", description: "LinkedIn profile URL" },
        xUrl: { type: "string", description: "X/Twitter profile URL" },
        city: { type: "string", description: "City" },
      },
      required: ["id"],
    },
  },
];

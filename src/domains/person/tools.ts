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
        website: {
          type: "string",
          description: "Personal or company website URL",
        },
        birthday: {
          type: "string",
          description: "Birthday (ISO date, e.g., 1990-05-21)",
        },
        education: {
          type: "string",
          description: "Education summary (text custom field)",
        },
        addresss: {
          type: "string",
          description: "Mailing address (custom text field)",
        },
        description: {
          type: "string",
          description: "General description/notes (custom text field)",
        },
        experience: {
          type: "string",
          description: "Experience/notes (custom text field)",
        },
        additionalInformation: {
          type: "string",
          description: "Additional information (custom text field)",
        },
        languages: {
          type: "string",
          description: "Languages spoken (comma-separated text)",
        },
        followercount: {
          type: "number",
          description: "LinkedIn follower count",
        },
        connectioncount: {
          type: "number",
          description: "LinkedIn connection count",
        },
        linkedinscore: {
          type: "number",
          description: "Profile completeness score (0-100)",
        },
        linkedinLastUpdated: {
          type: "string",
          description: "Date/time LinkedIn data was last updated (ISO 8601)",
        },
        linkedinUrn: {
          type: "string",
          description: "LinkedIn URN identifier (e.g., urn:li:person:xxxx)",
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
        website: {
          type: "string",
          description: "Personal or company website URL",
        },
        birthday: {
          type: "string",
          description: "Birthday (ISO date)",
        },
        education: {
          type: "string",
          description: "Education summary (text custom field)",
        },
        addresss: {
          type: "string",
          description: "Mailing address (custom text field)",
        },
        description: {
          type: "string",
          description: "General description/notes (custom text field)",
        },
        experience: {
          type: "string",
          description: "Experience/notes (custom text field)",
        },
        additionalInformation: {
          type: "string",
          description: "Additional information (custom text field)",
        },
        languages: {
          type: "string",
          description: "Languages spoken (comma-separated text)",
        },
        followercount: {
          type: "number",
          description: "LinkedIn follower count",
        },
        connectioncount: {
          type: "number",
          description: "LinkedIn connection count",
        },
        linkedinscore: {
          type: "number",
          description: "Profile completeness score (0-100)",
        },
        linkedinLastUpdated: {
          type: "string",
          description: "Date/time LinkedIn data was last updated (ISO 8601)",
        },
        linkedinUrn: {
          type: "string",
          description: "LinkedIn URN identifier (e.g., urn:li:person:xxxx)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "import_linkedin_profile",
    description:
      "Import and parse a LinkedIn profile from Apify scraper JSON output. Automatically extracts all fields, formats experience/education/certifications as Markdown, calculates profile score, and updates the person record. Returns a summary of what was imported.",
    inputSchema: {
      type: "object",
      properties: {
        personId: {
          type: "string",
          description: "Twenty CRM Person ID to update with LinkedIn data",
        },
        apifyData: {
          type: "string",
          description:
            "Raw JSON string from Apify LinkedIn Profile Scraper. Can be the full response array or a single profile object.",
        },
      },
      required: ["personId", "apifyData"],
    },
  },
];

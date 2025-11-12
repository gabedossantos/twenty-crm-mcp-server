/**
 * MCP tool definitions for Company operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const COMPANY_TOOLS: Tool[] = [
  {
    name: "create_company",
    description: "Create a new company in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Company name (required)" },
        domainUrl: { type: "string", description: "Company website URL" },
        addressStreet1: { type: "string", description: "Address street line 1" },
        addressStreet2: { type: "string", description: "Address street line 2" },
        addressCity: { type: "string", description: "City" },
        addressPostcode: { type: "string", description: "Postcode/ZIP" },
        addressState: { type: "string", description: "State/Province" },
        addressCountry: { type: "string", description: "Country" },
        employees: { type: "number", description: "Number of employees" },
        linkedinUrl: { type: "string", description: "LinkedIn company URL" },
        xUrl: { type: "string", description: "X/Twitter URL" },
        annualRecurringRevenue: {
          type: "number",
          description: "Annual recurring revenue (will be stored in micros)",
        },
        currency: {
          type: "string",
          description: "Currency code (e.g., 'EUR', 'USD')",
          default: "USD",
        },
        idealCustomerProfile: {
          type: "boolean",
          description: "Is this an ideal customer profile",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "get_company",
    description: "Get details of a specific company by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Company ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_companies",
    description: "List companies with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
        searchTerm: {
          type: "string",
          description: "Search by company name",
        },
      },
    },
  },
  {
    name: "update_company",
    description: "Update an existing company's information",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Company ID (required)" },
        name: { type: "string", description: "Company name" },
        domainUrl: { type: "string", description: "Company website URL" },
        addressStreet1: { type: "string", description: "Address street line 1" },
        addressStreet2: { type: "string", description: "Address street line 2" },
        addressCity: { type: "string", description: "City" },
        addressPostcode: { type: "string", description: "Postcode/ZIP" },
        addressState: { type: "string", description: "State/Province" },
        addressCountry: { type: "string", description: "Country" },
        employees: { type: "number", description: "Number of employees" },
        linkedinUrl: { type: "string", description: "LinkedIn company URL" },
        xUrl: { type: "string", description: "X/Twitter URL" },
        annualRecurringRevenue: {
          type: "number",
          description: "Annual recurring revenue",
        },
        currency: { type: "string", description: "Currency code" },
        idealCustomerProfile: { type: "boolean", description: "Is ICP" },
      },
      required: ["id"],
    },
  },
];

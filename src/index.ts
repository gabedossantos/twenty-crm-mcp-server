#!/usr/bin/env node

/**
 * Twenty CRM MCP Server - Clean Implementation with TypeScript
 * Uses GraphQL for easier handling of nested objects
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";

// ======================
// TYPE DEFINITIONS
// ======================

interface NameComposite {
  firstName: string;
  lastName: string;
}

interface EmailsComposite {
  primaryEmail: string;
  additionalEmails?: string[];
}

interface PhonesComposite {
  primaryPhoneNumber: string;
  primaryPhoneCountryCode?: string;
  primaryPhoneCallingCode?: string;
  additionalPhones?: unknown[];
}

interface LinkComposite {
  primaryLinkLabel?: string;
  primaryLinkUrl: string;
  secondaryLinks?: unknown[];
}

interface AddressComposite {
  addressStreet1?: string;
  addressStreet2?: string;
  addressCity?: string;
  addressPostcode?: string;
  addressState?: string;
  addressCountry?: string;
}

interface CurrencyComposite {
  amountMicros: number;
  currencyCode: string;
}

// Person Types
interface CreatePersonInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  jobTitle?: string;
  companyId?: string;
  linkedinUrl?: string;
  xUrl?: string;
  city?: string;
}

interface UpdatePersonInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  jobTitle?: string;
  companyId?: string;
  linkedinUrl?: string;
  xUrl?: string;
  city?: string;
}

interface PersonGraphQLInput {
  name: NameComposite;
  emails?: EmailsComposite;
  phones?: PhonesComposite;
  linkedinLink?: LinkComposite;
  xLink?: LinkComposite;
  jobTitle?: string;
  city?: string;
  companyId?: string;
}

interface Person {
  id: string;
  name: NameComposite;
  emails?: EmailsComposite;
  phones?: PhonesComposite;
  jobTitle?: string;
  city?: string;
  linkedinLink?: LinkComposite;
  xLink?: LinkComposite;
  companyId?: string;
  company?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

interface ListPeopleParams {
  limit?: number;
  searchTerm?: string;
  companyId?: string;
}

// Company Types
interface CreateCompanyInput {
  name: string;
  domainUrl?: string;
  addressStreet1?: string;
  addressStreet2?: string;
  addressCity?: string;
  addressPostcode?: string;
  addressState?: string;
  addressCountry?: string;
  employees?: number;
  linkedinUrl?: string;
  xUrl?: string;
  annualRecurringRevenue?: number;
  currency?: string;
  idealCustomerProfile?: boolean;
}

interface UpdateCompanyInput {
  id: string;
  name?: string;
  domainUrl?: string;
  addressStreet1?: string;
  addressStreet2?: string;
  addressCity?: string;
  addressPostcode?: string;
  addressState?: string;
  addressCountry?: string;
  employees?: number;
  linkedinUrl?: string;
  xUrl?: string;
  annualRecurringRevenue?: number;
  currency?: string;
  idealCustomerProfile?: boolean;
}

interface CompanyGraphQLInput {
  name: string;
  domainName?: LinkComposite;
  address?: AddressComposite;
  employees?: number;
  linkedinLink?: LinkComposite;
  xLink?: LinkComposite;
  annualRecurringRevenue?: CurrencyComposite;
  idealCustomerProfile?: boolean;
}

interface Company {
  id: string;
  name: string;
  domainName?: LinkComposite;
  address?: AddressComposite;
  employees?: number;
  linkedinLink?: LinkComposite;
  xLink?: LinkComposite;
  annualRecurringRevenue?: CurrencyComposite;
  idealCustomerProfile?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface ListCompaniesParams {
  limit?: number;
  searchTerm?: string;
}

// GraphQL Response Types
interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

interface PeopleEdge {
  node: Person;
}

interface PeopleConnection {
  edges: PeopleEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface CompaniesEdge {
  node: Company;
}

interface CompaniesConnection {
  edges: CompaniesEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// MCP Response Type (using SDK types)
// CallToolResult from SDK is the proper return type

// ======================
// MAIN SERVER CLASS
// ======================

class TwentyCRMServer {
  private server: Server;
  private apiKey: string;
  private baseUrl: string;
  private graphqlEndpoint: string;

  constructor() {
    this.server = new Server(
      {
        name: "twenty-crm",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiKey = process.env.TWENTY_API_KEY || "";
    this.baseUrl = process.env.TWENTY_BASE_URL || "https://api.twenty.com";
    this.graphqlEndpoint = `${this.baseUrl}/graphql`;

    if (!this.apiKey) {
      throw new Error("TWENTY_API_KEY environment variable is required");
    }

    this.setupToolHandlers();
  }

  /**
   * Execute GraphQL query or mutation
   */
  async graphqlRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const response = await fetch(this.graphqlEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GraphQL request failed (${response.status}): ${errorText}`);
    }

    const result = await response.json() as GraphQLResponse<T>;

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`);
    }

    return result.data;
  }

  setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        // Person Management
        {
          name: "create_person",
          description: "Create a new person in Twenty CRM",
          inputSchema: {
            type: "object",
            properties: {
              firstName: {
                type: "string",
                description: "First name (required)"
              },
              lastName: {
                type: "string",
                description: "Last name (required)"
              },
              email: {
                type: "string",
                description: "Primary email address"
              },
              phone: {
                type: "string",
                description: "Primary phone number (e.g., '1234567890')"
              },
              phoneCountryCode: {
                type: "string",
                description: "Phone country code (e.g., 'US', 'DE')"
              },
              phoneCallingCode: {
                type: "string",
                description: "Phone calling code (e.g., '+1', '+49')"
              },
              jobTitle: {
                type: "string",
                description: "Job title"
              },
              companyId: {
                type: "string",
                description: "Company ID to associate with"
              },
              linkedinUrl: {
                type: "string",
                description: "LinkedIn profile URL"
              },
              xUrl: {
                type: "string",
                description: "X/Twitter profile URL"
              },
              city: {
                type: "string",
                description: "City"
              },
            },
            required: ["firstName", "lastName"]
          }
        },
        {
          name: "get_person",
          description: "Get details of a specific person by ID",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Person ID" }
            },
            required: ["id"]
          }
        },
        {
          name: "list_people",
          description: "List people with optional filtering and pagination",
          inputSchema: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Number of results to return (max: 60, default: 20)"
              },
              searchTerm: {
                type: "string",
                description: "Search by name or email"
              },
              companyId: {
                type: "string",
                description: "Filter by company ID"
              }
            }
          }
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
            required: ["id"]
          }
        },

        // Company Management
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
                description: "Annual recurring revenue (will be stored in micros)"
              },
              currency: {
                type: "string",
                description: "Currency code (e.g., 'EUR', 'USD')",
                default: "USD"
              },
              idealCustomerProfile: {
                type: "boolean",
                description: "Is this an ideal customer profile"
              }
            },
            required: ["name"]
          }
        },
        {
          name: "get_company",
          description: "Get details of a specific company by ID",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Company ID" }
            },
            required: ["id"]
          }
        },
        {
          name: "list_companies",
          description: "List companies with optional filtering and pagination",
          inputSchema: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Number of results to return (max: 60, default: 20)"
              },
              searchTerm: {
                type: "string",
                description: "Search by company name"
              }
            }
          }
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
              annualRecurringRevenue: { type: "number", description: "Annual recurring revenue" },
              currency: { type: "string", description: "Currency code" },
              idealCustomerProfile: { type: "boolean", description: "Is ICP" }
            },
            required: ["id"]
          }
        }
      ];

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "create_person":
            return await this.createPerson(args as unknown as CreatePersonInput);
          case "get_person":
            return await this.getPerson((args as unknown as { id: string }).id);
          case "list_people":
            return await this.listPeople((args || {}) as unknown as ListPeopleParams);
          case "update_person":
            return await this.updatePerson(args as unknown as UpdatePersonInput);

          case "create_company":
            return await this.createCompany(args as unknown as CreateCompanyInput);
          case "get_company":
            return await this.getCompany((args as unknown as { id: string }).id);
          case "list_companies":
            return await this.listCompanies((args || {}) as unknown as ListCompaniesParams);
          case "update_company":
            return await this.updateCompany(args as unknown as UpdateCompanyInput);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${errorMessage}`
            }
          ],
          isError: true
        };
      }
    });
  }

  // ====================
  // PERSON OPERATIONS
  // ====================

  async createPerson(data: CreatePersonInput): Promise<CallToolResult> {
    const mutation = `
      mutation CreatePerson($input: PersonCreateInput!) {
        createPerson(data: $input) {
          id
          name {
            firstName
            lastName
          }
          emails {
            primaryEmail
            additionalEmails
          }
          phones {
            primaryPhoneNumber
            primaryPhoneCountryCode
            primaryPhoneCallingCode
          }
          jobTitle
          city
          linkedinLink {
            primaryLinkUrl
          }
          xLink {
            primaryLinkUrl
          }
          companyId
          createdAt
        }
      }
    `;

    // Build the input object with correct nested structure
    const input: PersonGraphQLInput = {
      name: {
        firstName: data.firstName,
        lastName: data.lastName
      }
    };

    // Add email if provided
    if (data.email) {
      input.emails = {
        primaryEmail: data.email,
        additionalEmails: []
      };
    }

    // Add phone if provided
    if (data.phone) {
      input.phones = {
        primaryPhoneNumber: data.phone,
        primaryPhoneCountryCode: data.phoneCountryCode || "",
        primaryPhoneCallingCode: data.phoneCallingCode || "",
        additionalPhones: []
      };
    }

    // Add LinkedIn if provided
    if (data.linkedinUrl) {
      input.linkedinLink = {
        primaryLinkLabel: "",
        primaryLinkUrl: data.linkedinUrl,
        secondaryLinks: []
      };
    }

    // Add X/Twitter if provided
    if (data.xUrl) {
      input.xLink = {
        primaryLinkLabel: "",
        primaryLinkUrl: data.xUrl,
        secondaryLinks: []
      };
    }

    // Add other simple fields
    if (data.jobTitle) input.jobTitle = data.jobTitle;
    if (data.city) input.city = data.city;
    if (data.companyId) input.companyId = data.companyId;

    const result = await this.graphqlRequest<{ createPerson: Person }>(mutation, { input });

    return {
      content: [
        {
          type: "text",
          text: `✅ Created person: ${result.createPerson.name.firstName} ${result.createPerson.name.lastName}\n\n${JSON.stringify(result.createPerson, null, 2)}`
        }
      ]
    };
  }

  async getPerson(id: string): Promise<CallToolResult> {
    const query = `
      query GetPerson($id: UUID!) {
        person(filter: { id: { eq: $id } }) {
          id
          name {
            firstName
            lastName
          }
          emails {
            primaryEmail
            additionalEmails
          }
          phones {
            primaryPhoneNumber
            primaryPhoneCountryCode
            primaryPhoneCallingCode
          }
          jobTitle
          city
          linkedinLink {
            primaryLinkLabel
            primaryLinkUrl
          }
          xLink {
            primaryLinkLabel
            primaryLinkUrl
          }
          companyId
          company {
            id
            name
          }
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.graphqlRequest<{ person: Person }>(query, { id });

    return {
      content: [
        {
          type: "text",
          text: `Person details:\n\n${JSON.stringify(result.person, null, 2)}`
        }
      ]
    };
  }

  async listPeople(params: ListPeopleParams = {}): Promise<CallToolResult> {
    const { limit = 20, searchTerm, companyId } = params;

    const query = `
      query ListPeople($filter: PersonFilterInput, $limit: Int) {
        people(filter: $filter, first: $limit) {
          edges {
            node {
              id
              name {
                firstName
                lastName
              }
              emails {
                primaryEmail
              }
              phones {
                primaryPhoneNumber
              }
              jobTitle
              city
              companyId
              company {
                id
                name
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (searchTerm) {
      filter.or = [
        { name: { firstName: { ilike: `%${searchTerm}%` } } },
        { name: { lastName: { ilike: `%${searchTerm}%` } } },
        { emails: { primaryEmail: { ilike: `%${searchTerm}%` } } }
      ];
    }
    if (companyId) {
      filter.companyId = { eq: companyId };
    }

    const result = await this.graphqlRequest<{ people: PeopleConnection }>(query, {
      filter: Object.keys(filter).length > 0 ? filter : null,
      limit
    });

    const people = result.people.edges.map(edge => edge.node);
    const summary = `Found ${people.length} people${result.people.pageInfo.hasNextPage ? ' (more available)' : ''}`;

    return {
      content: [
        {
          type: "text",
          text: `${summary}\n\n${JSON.stringify(people, null, 2)}`
        }
      ]
    };
  }

  async updatePerson(data: UpdatePersonInput): Promise<CallToolResult> {
    const { id, ...updates } = data;

    const mutation = `
      mutation UpdatePerson($id: UUID!, $input: PersonUpdateInput!) {
        updatePerson(id: $id, data: $input) {
          id
          name {
            firstName
            lastName
          }
          emails {
            primaryEmail
          }
          phones {
            primaryPhoneNumber
          }
          jobTitle
          city
          updatedAt
        }
      }
    `;

    // Build the input object with correct nested structure
    const input: Partial<PersonGraphQLInput> = {};

    // Update name if provided
    if (updates.firstName || updates.lastName) {
      input.name = {} as NameComposite;
      if (updates.firstName) input.name.firstName = updates.firstName;
      if (updates.lastName) input.name.lastName = updates.lastName;
    }

    // Update email if provided
    if (updates.email) {
      input.emails = {
        primaryEmail: updates.email
      };
    }

    // Update phone if provided
    if (updates.phone || updates.phoneCountryCode || updates.phoneCallingCode) {
      input.phones = {} as PhonesComposite;
      if (updates.phone) input.phones.primaryPhoneNumber = updates.phone;
      if (updates.phoneCountryCode) input.phones.primaryPhoneCountryCode = updates.phoneCountryCode;
      if (updates.phoneCallingCode) input.phones.primaryPhoneCallingCode = updates.phoneCallingCode;
    }

    // Update LinkedIn if provided
    if (updates.linkedinUrl) {
      input.linkedinLink = {
        primaryLinkUrl: updates.linkedinUrl
      };
    }

    // Update X/Twitter if provided
    if (updates.xUrl) {
      input.xLink = {
        primaryLinkUrl: updates.xUrl
      };
    }

    // Add other simple fields
    if (updates.jobTitle !== undefined) input.jobTitle = updates.jobTitle;
    if (updates.city !== undefined) input.city = updates.city;
    if (updates.companyId !== undefined) input.companyId = updates.companyId;

    const result = await this.graphqlRequest<{ updatePerson: Person }>(mutation, { id, input });

    return {
      content: [
        {
          type: "text",
          text: `✅ Updated person\n\n${JSON.stringify(result.updatePerson, null, 2)}`
        }
      ]
    };
  }

  // ====================
  // COMPANY OPERATIONS
  // ====================

  async createCompany(data: CreateCompanyInput): Promise<CallToolResult> {
    const mutation = `
      mutation CreateCompany($input: CompanyCreateInput!) {
        createCompany(data: $input) {
          id
          name
          domainName {
            primaryLinkUrl
          }
          address {
            addressStreet1
            addressStreet2
            addressCity
            addressPostcode
            addressState
            addressCountry
          }
          employees
          linkedinLink {
            primaryLinkUrl
          }
          xLink {
            primaryLinkUrl
          }
          annualRecurringRevenue {
            amountMicros
            currencyCode
          }
          idealCustomerProfile
          createdAt
        }
      }
    `;

    // Build the input object with correct nested structure
    const input: CompanyGraphQLInput = {
      name: data.name
    };

    // Add domain if provided
    if (data.domainUrl) {
      input.domainName = {
        primaryLinkLabel: "",
        primaryLinkUrl: data.domainUrl,
        secondaryLinks: []
      };
    }

    // Add LinkedIn if provided
    if (data.linkedinUrl) {
      input.linkedinLink = {
        primaryLinkLabel: "",
        primaryLinkUrl: data.linkedinUrl,
        secondaryLinks: []
      };
    }

    // Add X/Twitter if provided
    if (data.xUrl) {
      input.xLink = {
        primaryLinkLabel: "",
        primaryLinkUrl: data.xUrl,
        secondaryLinks: []
      };
    }

    // Add ARR if provided (convert to micros)
    if (data.annualRecurringRevenue) {
      input.annualRecurringRevenue = {
        amountMicros: data.annualRecurringRevenue * 1000000, // Convert to micros
        currencyCode: data.currency || "USD"
      };
    }

    // Add address if any address field is provided
    if (data.addressStreet1 || data.addressStreet2 || data.addressCity ||
        data.addressPostcode || data.addressState || data.addressCountry) {
      input.address = {};
      if (data.addressStreet1) input.address.addressStreet1 = data.addressStreet1;
      if (data.addressStreet2) input.address.addressStreet2 = data.addressStreet2;
      if (data.addressCity) input.address.addressCity = data.addressCity;
      if (data.addressPostcode) input.address.addressPostcode = data.addressPostcode;
      if (data.addressState) input.address.addressState = data.addressState;
      if (data.addressCountry) input.address.addressCountry = data.addressCountry;
    }

    // Add other simple fields
    if (data.employees !== undefined) input.employees = data.employees;
    if (data.idealCustomerProfile !== undefined) input.idealCustomerProfile = data.idealCustomerProfile;

    const result = await this.graphqlRequest<{ createCompany: Company }>(mutation, { input });

    return {
      content: [
        {
          type: "text",
          text: `✅ Created company: ${result.createCompany.name}\n\n${JSON.stringify(result.createCompany, null, 2)}`
        }
      ]
    };
  }

  async getCompany(id: string): Promise<CallToolResult> {
    const query = `
      query GetCompany($id: UUID!) {
        company(filter: { id: { eq: $id } }) {
          id
          name
          domainName {
            primaryLinkUrl
          }
          address {
            addressStreet1
            addressStreet2
            addressCity
            addressPostcode
            addressState
            addressCountry
          }
          employees
          linkedinLink {
            primaryLinkUrl
          }
          xLink {
            primaryLinkUrl
          }
          annualRecurringRevenue {
            amountMicros
            currencyCode
          }
          idealCustomerProfile
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.graphqlRequest<{ company: Company }>(query, { id });

    return {
      content: [
        {
          type: "text",
          text: `Company details:\n\n${JSON.stringify(result.company, null, 2)}`
        }
      ]
    };
  }

  async listCompanies(params: ListCompaniesParams = {}): Promise<CallToolResult> {
    const { limit = 20, searchTerm } = params;

    const query = `
      query ListCompanies($filter: CompanyFilterInput, $limit: Int) {
        companies(filter: $filter, first: $limit) {
          edges {
            node {
              id
              name
              domainName {
                primaryLinkUrl
              }
              address {
                addressStreet1
                addressStreet2
                addressCity
                addressPostcode
                addressState
                addressCountry
              }
              employees
              annualRecurringRevenue {
                amountMicros
                currencyCode
              }
              idealCustomerProfile
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `;

    // Build filter
    const filter = searchTerm ? {
      name: { ilike: `%${searchTerm}%` }
    } : null;

    const result = await this.graphqlRequest<{ companies: CompaniesConnection }>(query, { filter, limit });

    const companies = result.companies.edges.map(edge => edge.node);
    const summary = `Found ${companies.length} companies${result.companies.pageInfo.hasNextPage ? ' (more available)' : ''}`;

    return {
      content: [
        {
          type: "text",
          text: `${summary}\n\n${JSON.stringify(companies, null, 2)}`
        }
      ]
    };
  }

  async updateCompany(data: UpdateCompanyInput): Promise<CallToolResult> {
    const { id, ...updates } = data;

    const mutation = `
      mutation UpdateCompany($id: UUID!, $input: CompanyUpdateInput!) {
        updateCompany(id: $id, data: $input) {
          id
          name
          domainName {
            primaryLinkUrl
          }
          address {
            addressStreet1
            addressStreet2
            addressCity
            addressPostcode
            addressState
            addressCountry
          }
          employees
          annualRecurringRevenue {
            amountMicros
            currencyCode
          }
          updatedAt
        }
      }
    `;

    // Build the input object with correct nested structure
    const input: Partial<CompanyGraphQLInput> = {};

    // Update domain if provided
    if (updates.domainUrl) {
      input.domainName = {
        primaryLinkUrl: updates.domainUrl
      };
    }

    // Update LinkedIn if provided
    if (updates.linkedinUrl) {
      input.linkedinLink = {
        primaryLinkUrl: updates.linkedinUrl
      };
    }

    // Update X/Twitter if provided
    if (updates.xUrl) {
      input.xLink = {
        primaryLinkUrl: updates.xUrl
      };
    }

    // Update ARR if provided
    if (updates.annualRecurringRevenue) {
      input.annualRecurringRevenue = {
        amountMicros: updates.annualRecurringRevenue * 1000000,
        currencyCode: updates.currency || "USD"
      };
    }

    // Update address if any address field is provided
    if (updates.addressStreet1 !== undefined || updates.addressStreet2 !== undefined ||
        updates.addressCity !== undefined || updates.addressPostcode !== undefined ||
        updates.addressState !== undefined || updates.addressCountry !== undefined) {
      input.address = {};
      if (updates.addressStreet1 !== undefined) input.address.addressStreet1 = updates.addressStreet1;
      if (updates.addressStreet2 !== undefined) input.address.addressStreet2 = updates.addressStreet2;
      if (updates.addressCity !== undefined) input.address.addressCity = updates.addressCity;
      if (updates.addressPostcode !== undefined) input.address.addressPostcode = updates.addressPostcode;
      if (updates.addressState !== undefined) input.address.addressState = updates.addressState;
      if (updates.addressCountry !== undefined) input.address.addressCountry = updates.addressCountry;
    }

    // Add other simple fields
    if (updates.name !== undefined) input.name = updates.name;
    if (updates.employees !== undefined) input.employees = updates.employees;
    if (updates.idealCustomerProfile !== undefined) input.idealCustomerProfile = updates.idealCustomerProfile;

    const result = await this.graphqlRequest<{ updateCompany: Company }>(mutation, { id, input });

    return {
      content: [
        {
          type: "text",
          text: `✅ Updated company\n\n${JSON.stringify(result.updateCompany, null, 2)}`
        }
      ]
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Twenty CRM MCP Server v2.0 running on stdio (GraphQL-based)");
  }
}

// Export for testing
export { TwentyCRMServer };

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new TwentyCRMServer();
  server.run().catch(console.error);
}

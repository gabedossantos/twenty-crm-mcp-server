#!/usr/bin/env node

/**
 * Twenty CRM MCP Server - Refactored Modular Implementation
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Shared utilities
import { createGraphQLClient, GraphQLClient } from "./shared/graphql-client.js";

// Domain imports
import {
  PERSON_TOOLS,
  createPerson,
  getPerson,
  listPeople,
  updatePerson,
  CreatePersonInput,
  UpdatePersonInput,
  ListPeopleParams,
} from "./domains/person/index.js";

import {
  COMPANY_TOOLS,
  createCompany,
  getCompany,
  listCompanies,
  updateCompany,
  CreateCompanyInput,
  UpdateCompanyInput,
  ListCompaniesParams,
} from "./domains/company/index.js";

import {
  OPPORTUNITY_TOOLS,
  createOpportunity,
  getOpportunity,
  listOpportunities,
  updateOpportunity,
  CreateOpportunityInput,
  UpdateOpportunityInput,
  ListOpportunitiesParams,
} from "./domains/opportunity/index.js";

/**
 * Main Twenty CRM MCP Server
 */
class TwentyCRMServer {
  private server: Server;
  private client: GraphQLClient;

  constructor() {
    // Initialize MCP Server
    this.server = new Server(
      {
        name: "twenty-crm",
        version: "0.3.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize GraphQL client
    this.client = createGraphQLClient();

    // Setup handlers
    this.setupToolHandlers();
  }

  /**
   * Setup MCP tool handlers
   */
  setupToolHandlers(): void {
    // Register list tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [...PERSON_TOOLS, ...COMPANY_TOOLS, ...OPPORTUNITY_TOOLS],
      };
    });

    // Register call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Route to appropriate domain handler
        switch (name) {
          // Person operations
          case "create_person":
            return await createPerson(
              this.client,
              args as unknown as CreatePersonInput
            );
          case "get_person":
            return await getPerson(
              this.client,
              (args as unknown as { id: string }).id
            );
          case "list_people":
            return await listPeople(
              this.client,
              (args || {}) as unknown as ListPeopleParams
            );
          case "update_person":
            return await updatePerson(
              this.client,
              args as unknown as UpdatePersonInput
            );

          // Company operations
          case "create_company":
            return await createCompany(
              this.client,
              args as unknown as CreateCompanyInput
            );
          case "get_company":
            return await getCompany(
              this.client,
              (args as unknown as { id: string }).id
            );
          case "list_companies":
            return await listCompanies(
              this.client,
              (args || {}) as unknown as ListCompaniesParams
            );
          case "update_company":
            return await updateCompany(
              this.client,
              args as unknown as UpdateCompanyInput
            );

          // Opportunity operations
          case "create_opportunity":
            return await createOpportunity(
              this.client,
              args as unknown as CreateOpportunityInput
            );
          case "get_opportunity":
            return await getOpportunity(
              this.client,
              (args as unknown as { id: string }).id
            );
          case "list_opportunities":
            return await listOpportunities(
              this.client,
              (args || {}) as unknown as ListOpportunitiesParams
            );
          case "update_opportunity":
            return await updateOpportunity(
              this.client,
              args as unknown as UpdateOpportunityInput
            );

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Start the MCP server
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Twenty CRM MCP Server running on stdio");
  }

  // ======================
  // TESTING METHODS
  // Expose internal methods for testing
  // ======================

  async graphqlRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    return this.client.request<T>(query, variables);
  }

  async createPerson(data: CreatePersonInput) {
    return createPerson(this.client, data);
  }

  async getPerson(id: string) {
    return getPerson(this.client, id);
  }

  async listPeople(params: ListPeopleParams = {}) {
    return listPeople(this.client, params);
  }

  async updatePerson(data: UpdatePersonInput) {
    return updatePerson(this.client, data);
  }

  async createCompany(data: CreateCompanyInput) {
    return createCompany(this.client, data);
  }

  async getCompany(id: string) {
    return getCompany(this.client, id);
  }

  async listCompanies(params: ListCompaniesParams = {}) {
    return listCompanies(this.client, params);
  }

  async updateCompany(data: UpdateCompanyInput) {
    return updateCompany(this.client, data);
  }

  async createOpportunity(data: CreateOpportunityInput) {
    return createOpportunity(this.client, data);
  }

  async getOpportunity(id: string) {
    return getOpportunity(this.client, id);
  }

  async listOpportunities(params: ListOpportunitiesParams = {}) {
    return listOpportunities(this.client, params);
  }

  async updateOpportunity(data: UpdateOpportunityInput) {
    return updateOpportunity(this.client, data);
  }
}

// Export for testing
export { TwentyCRMServer };

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new TwentyCRMServer();
  server.run().catch(console.error);
}

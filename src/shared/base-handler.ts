/**
 * Base CRUD handler - Generic patterns for all domain operations
 */

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { GraphQLClient } from "./graphql-client.js";
import { Connection } from "./types.js";

/**
 * Configuration for CRUD operations on a domain entity
 */
export interface CRUDConfig<TCreate, TUpdate, TEntity, TGraphQLInput, TListParams> {
  entityName: string; // e.g., "person", "company", "opportunity"
  entityNameCapitalized: string; // e.g., "Person", "Company", "Opportunity"
  pluralEntityName?: string; // Optional: e.g., "people" for irregular plurals
  queries: {
    create: string;
    get: string;
    list: string;
    update: string;
  };
  transformCreateInput: (data: TCreate) => TGraphQLInput;
  transformUpdateInput: (data: TUpdate) => Partial<TGraphQLInput>;
  buildListFilter: (params: TListParams) => Record<string, unknown> | null;
  formatCreateSuccess?: (entity: TEntity) => string;
  formatListSummary?: (count: number, hasMore: boolean) => string;
}

/**
 * Create CRUD handlers for a domain entity
 */
export function createCRUDHandlers<
  TCreate,
  TUpdate extends { id: string },
  TEntity,
  TGraphQLInput,
  TListParams
>(config: CRUDConfig<TCreate, TUpdate, TEntity, TGraphQLInput, TListParams>) {
  const {
    entityName,
    entityNameCapitalized,
    pluralEntityName,
    queries,
    transformCreateInput,
    transformUpdateInput,
    buildListFilter,
    formatCreateSuccess,
    formatListSummary,
  } = config;

  /**
   * Create a new entity
   */
  async function create(
    client: GraphQLClient,
    data: TCreate
  ): Promise<CallToolResult> {
    const input = transformCreateInput(data);

    const result = await client.request<Record<string, TEntity>>(
      queries.create,
      { input }
    );

    const entity = result[`create${entityNameCapitalized}`];
    const successMessage = formatCreateSuccess
      ? formatCreateSuccess(entity)
      : `✅ Created ${entityName}`;

    return {
      content: [
        {
          type: "text",
          text: `${successMessage}\n\n${JSON.stringify(entity, null, 2)}`,
        },
      ],
    };
  }

  /**
   * Get an entity by ID
   */
  async function get(
    client: GraphQLClient,
    id: string
  ): Promise<CallToolResult> {
    const result = await client.request<Record<string, TEntity>>(queries.get, {
      id,
    });

    const entity = result[entityName];

    return {
      content: [
        {
          type: "text",
          text: `${entityNameCapitalized} details:\n\n${JSON.stringify(entity, null, 2)}`,
        },
      ],
    };
  }

  /**
   * List entities with optional filtering
   */
  async function list(
    client: GraphQLClient,
    params: TListParams & { limit?: number }
  ): Promise<CallToolResult> {
    const { limit = 20, ...filterParams } = params;
    const filter = buildListFilter(filterParams as TListParams);

    // Use provided plural or compute it
    const pluralName =
      pluralEntityName ||
      (entityName.endsWith("y")
        ? `${entityName.slice(0, -1)}ies`
        : `${entityName}s`);

    const result = await client.request<Record<string, Connection<TEntity>>>(
      queries.list,
      { filter, limit }
    );

    const connection = result[pluralName];
    const entities = connection.edges.map((edge) => edge.node);
    const summary = formatListSummary
      ? formatListSummary(entities.length, connection.pageInfo.hasNextPage)
      : `Found ${entities.length} ${pluralName}${
          connection.pageInfo.hasNextPage ? " (more available)" : ""
        }`;

    return {
      content: [
        {
          type: "text",
          text: `${summary}\n\n${JSON.stringify(entities, null, 2)}`,
        },
      ],
    };
  }

  /**
   * Update an entity
   */
  async function update(
    client: GraphQLClient,
    data: TUpdate
  ): Promise<CallToolResult> {
    const { id } = data;
    const input = transformUpdateInput(data);

    const result = await client.request<Record<string, TEntity>>(
      queries.update,
      { id, input }
    );

    const entity = result[`update${entityNameCapitalized}`];

    return {
      content: [
        {
          type: "text",
          text: `✅ Updated ${entityName}\n\n${JSON.stringify(entity, null, 2)}`,
        },
      ],
    };
  }

  return {
    create,
    get,
    list,
    update,
  };
}

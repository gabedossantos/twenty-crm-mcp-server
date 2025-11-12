/**
 * GraphQL client for Twenty CRM API
 */

import { GraphQLResponse } from "./types.js";

export interface GraphQLClientConfig {
  apiKey: string;
  baseUrl: string;
}

export class GraphQLClient {
  private apiKey: string;
  private graphqlEndpoint: string;

  constructor(config: GraphQLClientConfig) {
    this.apiKey = config.apiKey;
    this.graphqlEndpoint = `${config.baseUrl}/graphql`;

    if (!this.apiKey) {
      throw new Error("API key is required for GraphQL client");
    }
  }

  /**
   * Execute GraphQL query or mutation
   */
  async request<T>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<T> {
    const response = await fetch(this.graphqlEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `GraphQL request failed (${response.status}): ${errorText}`
      );
    }

    const result = (await response.json()) as GraphQLResponse<T>;

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`);
    }

    return result.data;
  }
}

/**
 * Create a GraphQL client instance from environment variables
 */
export function createGraphQLClient(): GraphQLClient {
  const apiKey = process.env.TWENTY_API_KEY || "";
  const baseUrl = process.env.TWENTY_BASE_URL || "https://api.twenty.com";

  if (!apiKey) {
    throw new Error("TWENTY_API_KEY environment variable is required");
  }

  return new GraphQLClient({ apiKey, baseUrl });
}

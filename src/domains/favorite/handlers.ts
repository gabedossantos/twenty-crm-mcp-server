/**
 * Favorite domain handlers
 */

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { GraphQLClient } from "../../shared/graphql-client.js";
import { Connection } from "../../shared/types.js";
import {
  CREATE_FAVORITE_MUTATION,
  GET_FAVORITE_QUERY,
  LIST_FAVORITES_QUERY,
  DELETE_FAVORITE_MUTATION,
} from "./queries.js";
import {
  AddFavoriteInput,
  ListFavoritesParams,
  Favorite,
  FavoriteGraphQLInput,
} from "./types.js";

/**
 * Transform add input to GraphQL format
 */
function transformAddInput(data: AddFavoriteInput): FavoriteGraphQLInput {
  const input: FavoriteGraphQLInput = {};

  if (data.personId) input.personId = data.personId;
  if (data.companyId) input.companyId = data.companyId;
  if (data.opportunityId) input.opportunityId = data.opportunityId;
  if (data.position !== undefined) input.position = data.position;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(
  params: ListFavoritesParams
): Record<string, unknown> | null {
  const { personId, companyId, opportunityId, forWorkspaceMemberId } = params;
  const filter: Record<string, unknown> = {};

  if (personId) filter.personId = { eq: personId };
  if (companyId) filter.companyId = { eq: companyId };
  if (opportunityId) filter.opportunityId = { eq: opportunityId };
  if (forWorkspaceMemberId) filter.forWorkspaceMemberId = { eq: forWorkspaceMemberId };

  return Object.keys(filter).length > 0 ? filter : null;
}

/**
 * Add a new favorite
 */
export async function addFavorite(
  client: GraphQLClient,
  data: AddFavoriteInput
): Promise<CallToolResult> {
  // Validate that at least one target is provided
  if (!data.personId && !data.companyId && !data.opportunityId) {
    throw new Error(
      "At least one target (personId, companyId, or opportunityId) must be provided"
    );
  }

  const input = transformAddInput(data);

  const result = await client.request<{ createFavorite: Favorite }>(
    CREATE_FAVORITE_MUTATION,
    { input }
  );

  const favorite = result.createFavorite;

  // Determine what was favorited
  const targetType = favorite.personId
    ? "person"
    : favorite.companyId
    ? "company"
    : "opportunity";
  const targetId =
    favorite.personId || favorite.companyId || favorite.opportunityId;

  return {
    content: [
      {
        type: "text",
        text: `✅ Added ${targetType} to favorites (${targetId})\n\n${JSON.stringify(favorite, null, 2)}`,
      },
    ],
  };
}

/**
 * Get a favorite by ID
 */
export async function getFavorite(
  client: GraphQLClient,
  id: string
): Promise<CallToolResult> {
  const result = await client.request<{ favorite: Favorite }>(
    GET_FAVORITE_QUERY,
    { id }
  );

  const favorite = result.favorite;

  return {
    content: [
      {
        type: "text",
        text: `Favorite details:\n\n${JSON.stringify(favorite, null, 2)}`,
      },
    ],
  };
}

/**
 * List favorites with optional filtering
 */
export async function listFavorites(
  client: GraphQLClient,
  params: ListFavoritesParams = {}
): Promise<CallToolResult> {
  const { limit = 20, ...filterParams } = params;
  const filter = buildListFilter(filterParams);

  const result = await client.request<{ favorites: Connection<Favorite> }>(
    LIST_FAVORITES_QUERY,
    { filter, limit }
  );

  const connection = result.favorites;
  const favorites = connection.edges.map((edge) => edge.node);
  const summary = `Found ${favorites.length} favorite(s)${
    connection.pageInfo.hasNextPage ? " (more available)" : ""
  }`;

  return {
    content: [
      {
        type: "text",
        text: `${summary}\n\n${JSON.stringify(favorites, null, 2)}`,
      },
    ],
  };
}

/**
 * Remove a favorite
 */
export async function removeFavorite(
  client: GraphQLClient,
  id: string
): Promise<CallToolResult> {
  await client.request<{ deleteFavorite: { id: string } }>(
    DELETE_FAVORITE_MUTATION,
    { id }
  );

  return {
    content: [
      {
        type: "text",
        text: `✅ Removed favorite: ${id}`,
      },
    ],
  };
}

/**
 * Favorite domain type definitions
 */

import { Favorite } from "../../shared/types.js";

// ======================
// INPUT TYPES
// ======================

export interface AddFavoriteInput {
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  position?: number;
}

export interface ListFavoritesParams {
  limit?: number;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  forWorkspaceMemberId?: string;
}

// ======================
// GRAPHQL INPUT TYPES
// ======================

export interface FavoriteGraphQLInput {
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  position?: number;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface FavoritesEdge {
  node: Favorite;
}

export interface FavoritesConnection {
  edges: FavoritesEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Re-export shared type
export type { Favorite };

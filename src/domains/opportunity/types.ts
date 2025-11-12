/**
 * Opportunity domain type definitions
 */

import { NameComposite, CurrencyComposite } from "../../shared/types.js";

// ======================
// INPUT TYPES
// ======================

export interface CreateOpportunityInput {
  name: string;
  amount?: number;
  currency?: string;
  stage?: string;
  closeDate?: string;
  companyId?: string;
  pointOfContactId?: string;
}

export interface UpdateOpportunityInput {
  id: string;
  name?: string;
  amount?: number;
  currency?: string;
  stage?: string;
  closeDate?: string;
  companyId?: string;
  pointOfContactId?: string;
}

export interface ListOpportunitiesParams {
  limit?: number;
  searchTerm?: string;
  companyId?: string;
  stage?: string;
}

// ======================
// GRAPHQL TYPES
// ======================

export interface OpportunityGraphQLInput {
  name: string;
  amount?: CurrencyComposite;
  stage?: string;
  closeDate?: string;
  companyId?: string;
  pointOfContactId?: string;
}

// ======================
// DOMAIN MODEL
// ======================

export interface Opportunity {
  id: string;
  name: string;
  amount?: CurrencyComposite;
  stage?: string;
  closeDate?: string;
  companyId?: string;
  company?: {
    id: string;
    name: string;
  };
  pointOfContactId?: string;
  pointOfContact?: {
    id: string;
    name: NameComposite;
  };
  createdAt: string;
  updatedAt?: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface OpportunitiesEdge {
  node: Opportunity;
}

export interface OpportunitiesConnection {
  edges: OpportunitiesEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

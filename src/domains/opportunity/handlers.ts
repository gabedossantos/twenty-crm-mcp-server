/**
 * Opportunity domain handlers - Using base CRUD handler
 */

import { createCRUDHandlers } from "../../shared/base-handler.js";
import { transformCurrency } from "../../shared/transformers.js";
import {
  CREATE_OPPORTUNITY_MUTATION,
  GET_OPPORTUNITY_QUERY,
  LIST_OPPORTUNITIES_QUERY,
  UPDATE_OPPORTUNITY_MUTATION,
} from "./queries.js";
import {
  CreateOpportunityInput,
  UpdateOpportunityInput,
  ListOpportunitiesParams,
  Opportunity,
  OpportunityGraphQLInput,
} from "./types.js";

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(
  data: CreateOpportunityInput
): OpportunityGraphQLInput {
  const input: OpportunityGraphQLInput = {
    name: data.name,
  };

  if (data.amount !== undefined) {
    input.amount = transformCurrency(data.amount, data.currency);
  }

  if (data.stage) input.stage = data.stage;
  if (data.closeDate) input.closeDate = data.closeDate;
  if (data.companyId) input.companyId = data.companyId;
  if (data.pointOfContactId) input.pointOfContactId = data.pointOfContactId;

  return input;
}

/**
 * Transform update input to GraphQL format
 */
function transformUpdateInput(
  data: UpdateOpportunityInput
): Partial<OpportunityGraphQLInput> {
  const { id, ...updates } = data;
  const input: Partial<OpportunityGraphQLInput> = {};

  if (updates.name !== undefined) input.name = updates.name;

  if (updates.amount !== undefined) {
    input.amount = transformCurrency(updates.amount, updates.currency);
  }

  if (updates.stage !== undefined) input.stage = updates.stage;
  if (updates.closeDate !== undefined) input.closeDate = updates.closeDate;
  if (updates.companyId !== undefined) input.companyId = updates.companyId;
  if (updates.pointOfContactId !== undefined)
    input.pointOfContactId = updates.pointOfContactId;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(
  params: ListOpportunitiesParams
): Record<string, unknown> | null {
  const { searchTerm, companyId, stage } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) filter.name = { ilike: `%${searchTerm}%` };
  if (companyId) filter.companyId = { eq: companyId };
  if (stage) filter.stage = { eq: stage };

  return Object.keys(filter).length > 0 ? filter : null;
}

// Create CRUD handlers using base handler
const handlers = createCRUDHandlers<
  CreateOpportunityInput,
  UpdateOpportunityInput,
  Opportunity,
  OpportunityGraphQLInput,
  ListOpportunitiesParams
>({
  entityName: "opportunity",
  entityNameCapitalized: "Opportunity",
  queries: {
    create: CREATE_OPPORTUNITY_MUTATION,
    get: GET_OPPORTUNITY_QUERY,
    list: LIST_OPPORTUNITIES_QUERY,
    update: UPDATE_OPPORTUNITY_MUTATION,
  },
  transformCreateInput,
  transformUpdateInput,
  buildListFilter,
  formatCreateSuccess: (opportunity) =>
    `✅ Created opportunity: ${opportunity.name}`,
});

// Export handlers
export const createOpportunity = handlers.create;
export const getOpportunity = handlers.get;
export const listOpportunities = handlers.list;
export const updateOpportunity = handlers.update;

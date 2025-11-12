/**
 * Company domain handlers - Using base CRUD handler
 */

import { createCRUDHandlers } from "../../shared/base-handler.js";
import {
  transformLink,
  transformAddress,
  transformCurrency,
} from "../../shared/transformers.js";
import {
  CREATE_COMPANY_MUTATION,
  GET_COMPANY_QUERY,
  LIST_COMPANIES_QUERY,
  UPDATE_COMPANY_MUTATION,
} from "./queries.js";
import {
  CreateCompanyInput,
  UpdateCompanyInput,
  ListCompaniesParams,
  Company,
  CompanyGraphQLInput,
} from "./types.js";

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(data: CreateCompanyInput): CompanyGraphQLInput {
  const input: CompanyGraphQLInput = {
    name: data.name,
  };

  if (data.domainUrl) input.domainName = transformLink(data.domainUrl);
  if (data.linkedinUrl) input.linkedinLink = transformLink(data.linkedinUrl);
  if (data.xUrl) input.xLink = transformLink(data.xUrl);

  if (data.annualRecurringRevenue) {
    input.annualRecurringRevenue = transformCurrency(
      data.annualRecurringRevenue,
      data.currency
    );
  }

  const address = transformAddress({
    addressStreet1: data.addressStreet1,
    addressStreet2: data.addressStreet2,
    addressCity: data.addressCity,
    addressPostcode: data.addressPostcode,
    addressState: data.addressState,
    addressCountry: data.addressCountry,
  });
  if (address) input.address = address;

  if (data.employees !== undefined) input.employees = data.employees;
  if (data.idealCustomerProfile !== undefined)
    input.idealCustomerProfile = data.idealCustomerProfile;

  return input;
}

/**
 * Transform update input to GraphQL format
 */
function transformUpdateInput(
  data: UpdateCompanyInput
): Partial<CompanyGraphQLInput> {
  const { id, ...updates } = data;
  const input: Partial<CompanyGraphQLInput> = {};

  if (updates.domainUrl) input.domainName = transformLink(updates.domainUrl);
  if (updates.linkedinUrl) input.linkedinLink = transformLink(updates.linkedinUrl);
  if (updates.xUrl) input.xLink = transformLink(updates.xUrl);

  if (updates.annualRecurringRevenue) {
    input.annualRecurringRevenue = transformCurrency(
      updates.annualRecurringRevenue,
      updates.currency
    );
  }

  if (
    updates.addressStreet1 !== undefined ||
    updates.addressStreet2 !== undefined ||
    updates.addressCity !== undefined ||
    updates.addressPostcode !== undefined ||
    updates.addressState !== undefined ||
    updates.addressCountry !== undefined
  ) {
    const address = transformAddress({
      addressStreet1: updates.addressStreet1,
      addressStreet2: updates.addressStreet2,
      addressCity: updates.addressCity,
      addressPostcode: updates.addressPostcode,
      addressState: updates.addressState,
      addressCountry: updates.addressCountry,
    });
    if (address) input.address = address;
  }

  if (updates.name !== undefined) input.name = updates.name;
  if (updates.employees !== undefined) input.employees = updates.employees;
  if (updates.idealCustomerProfile !== undefined)
    input.idealCustomerProfile = updates.idealCustomerProfile;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(params: ListCompaniesParams): Record<string, unknown> | null {
  const { searchTerm } = params;
  return searchTerm ? { name: { ilike: `%${searchTerm}%` } } : null;
}

// Create CRUD handlers using base handler
const handlers = createCRUDHandlers<
  CreateCompanyInput,
  UpdateCompanyInput,
  Company,
  CompanyGraphQLInput,
  ListCompaniesParams
>({
  entityName: "company",
  entityNameCapitalized: "Company",
  queries: {
    create: CREATE_COMPANY_MUTATION,
    get: GET_COMPANY_QUERY,
    list: LIST_COMPANIES_QUERY,
    update: UPDATE_COMPANY_MUTATION,
  },
  transformCreateInput,
  transformUpdateInput,
  buildListFilter,
  formatCreateSuccess: (company) => `✅ Created company: ${company.name}`,
});

// Export handlers
export const createCompany = handlers.create;
export const getCompany = handlers.get;
export const listCompanies = handlers.list;
export const updateCompany = handlers.update;

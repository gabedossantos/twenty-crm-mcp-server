/**
 * Company domain type definitions
 */

import {
  LinkComposite,
  AddressComposite,
  CurrencyComposite,
} from "../../shared/types.js";

// ======================
// INPUT TYPES
// ======================

export interface CreateCompanyInput {
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
  ats?: string;
  lastAtsRun?: string;
}

export interface UpdateCompanyInput {
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
  ats?: string;
  lastAtsRun?: string;
}

export interface ListCompaniesParams {
  limit?: number;
  searchTerm?: string;
}

// ======================
// GRAPHQL TYPES
// ======================

export interface CompanyGraphQLInput {
  name: string;
  domainName?: LinkComposite;
  address?: AddressComposite;
  employees?: number;
  linkedinLink?: LinkComposite;
  xLink?: LinkComposite;
  annualRecurringRevenue?: CurrencyComposite;
  idealCustomerProfile?: boolean;
  ats?: LinkComposite;
  lastAtsRun?: string;
}

// ======================
// DOMAIN MODEL
// ======================

export interface Company {
  id: string;
  name: string;
  domainName?: LinkComposite;
  address?: AddressComposite;
  employees?: number;
  linkedinLink?: LinkComposite;
  xLink?: LinkComposite;
  annualRecurringRevenue?: CurrencyComposite;
  idealCustomerProfile?: boolean;
  ats?: LinkComposite;
  lastAtsRun?: string;
  createdAt: string;
  updatedAt?: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface CompaniesEdge {
  node: Company;
}

export interface CompaniesConnection {
  edges: CompaniesEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

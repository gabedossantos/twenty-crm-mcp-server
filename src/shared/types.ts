/**
 * Shared type definitions used across all domains
 */

// ======================
// COMPOSITE TYPES
// ======================

export interface NameComposite {
  firstName: string;
  lastName: string;
}

export interface EmailsComposite {
  primaryEmail: string;
  additionalEmails?: string[];
}

export interface PhonesComposite {
  primaryPhoneNumber: string;
  primaryPhoneCountryCode?: string;
  primaryPhoneCallingCode?: string;
  additionalPhones?: unknown[];
}

export interface LinkComposite {
  primaryLinkLabel?: string;
  primaryLinkUrl: string;
  secondaryLinks?: unknown[];
}

export interface AddressComposite {
  addressStreet1?: string;
  addressStreet2?: string;
  addressCity?: string;
  addressPostcode?: string;
  addressState?: string;
  addressCountry?: string;
}

export interface CurrencyComposite {
  amountMicros: number;
  currencyCode: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

// Generic pagination types
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Edge<T> {
  node: T;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

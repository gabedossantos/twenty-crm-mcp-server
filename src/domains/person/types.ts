/**
 * Person domain type definitions
 */

import {
  NameComposite,
  EmailsComposite,
  PhonesComposite,
  LinkComposite,
} from "../../shared/types.js";

// ======================
// INPUT TYPES
// ======================

export interface CreatePersonInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  jobTitle?: string;
  companyId?: string;
  linkedinUrl?: string;
  xUrl?: string;
  city?: string;
  education?: string;
  addresss?: string;
  description?: string;
  experience?: string;
}

export interface UpdatePersonInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  jobTitle?: string;
  companyId?: string;
  linkedinUrl?: string;
  xUrl?: string;
  city?: string;
  education?: string;
  addresss?: string;
  description?: string;
  experience?: string;
}

export interface ListPeopleParams {
  limit?: number;
  searchTerm?: string;
  companyId?: string;
}

// ======================
// GRAPHQL TYPES
// ======================

export interface PersonGraphQLInput {
  name: NameComposite;
  emails?: EmailsComposite;
  phones?: PhonesComposite;
  linkedinLink?: LinkComposite;
  xLink?: LinkComposite;
  jobTitle?: string;
  city?: string;
  companyId?: string;
  education?: string;
  addresss?: string;
  description?: string;
  experience?: string;
}

// ======================
// DOMAIN MODEL
// ======================

export interface Person {
  id: string;
  name: NameComposite;
  emails?: EmailsComposite;
  phones?: PhonesComposite;
  jobTitle?: string;
  city?: string;
  linkedinLink?: LinkComposite;
  xLink?: LinkComposite;
  companyId?: string;
  company?: {
    id: string;
    name: string;
  };
  education?: string;
  addresss?: string;
  description?: string;
  experience?: string;
  createdAt: string;
  updatedAt?: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface PeopleEdge {
  node: Person;
}

export interface PeopleConnection {
  edges: PeopleEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

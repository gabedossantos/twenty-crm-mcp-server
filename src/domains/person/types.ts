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
  title?: string;
  companyId?: string;
  linkedinUrl?: string;
  xUrl?: string;
  website?: string;
  birthday?: string;
  city?: string;
  education?: string;
  addresss?: string;
  description?: string;
  experience?: string;
  additionalInformation?: string;
  languages?: string;
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
  title?: string;
  companyId?: string;
  linkedinUrl?: string;
  xUrl?: string;
  website?: string;
  birthday?: string;
  city?: string;
  education?: string;
  addresss?: string;
  description?: string;
  experience?: string;
  additionalInformation?: string;
  languages?: string;
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
  title?: string;
  city?: string;
  companyId?: string;
  education?: string;
  addresss?: string;
  description?: string;
  experience?: string;
  website?: LinkComposite;
  birthday?: string;
  additionalInformation?: string;
  languages?: string;
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
  title?: string;
  city?: string;
  linkedinLink?: LinkComposite;
  xLink?: LinkComposite;
  website?: LinkComposite;
  birthday?: string;
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
  additionalInformation?: string;
  languages?: string;
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

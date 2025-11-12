/**
 * Person domain handlers - Using base CRUD handler
 */

import { createCRUDHandlers } from "../../shared/base-handler.js";
import {
  transformEmail,
  transformPhone,
  transformLink,
} from "../../shared/transformers.js";
import { PhonesComposite } from "../../shared/types.js";
import {
  CREATE_PERSON_MUTATION,
  GET_PERSON_QUERY,
  LIST_PEOPLE_QUERY,
  UPDATE_PERSON_MUTATION,
} from "./queries.js";
import {
  CreatePersonInput,
  UpdatePersonInput,
  ListPeopleParams,
  Person,
  PersonGraphQLInput,
} from "./types.js";

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(data: CreatePersonInput): PersonGraphQLInput {
  const input: PersonGraphQLInput = {
    name: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
  };

  if (data.email) input.emails = transformEmail(data.email);
  if (data.phone) {
    input.phones = transformPhone(
      data.phone,
      data.phoneCountryCode,
      data.phoneCallingCode
    );
  }
  if (data.linkedinUrl) input.linkedinLink = transformLink(data.linkedinUrl);
  if (data.xUrl) input.xLink = transformLink(data.xUrl);
  if (data.jobTitle) input.jobTitle = data.jobTitle;
  if (data.city) input.city = data.city;
  if (data.companyId) input.companyId = data.companyId;

  return input;
}

/**
 * Transform update input to GraphQL format
 */
function transformUpdateInput(
  data: UpdatePersonInput
): Partial<PersonGraphQLInput> {
  const { id, ...updates } = data;
  const input: Partial<PersonGraphQLInput> = {};

  if (updates.firstName || updates.lastName) {
    input.name = {
      firstName: updates.firstName || "",
      lastName: updates.lastName || "",
    };
  }

  if (updates.email) input.emails = transformEmail(updates.email);

  if (updates.phone || updates.phoneCountryCode || updates.phoneCallingCode) {
    input.phones = {} as PhonesComposite;
    if (updates.phone) input.phones.primaryPhoneNumber = updates.phone;
    if (updates.phoneCountryCode)
      input.phones.primaryPhoneCountryCode = updates.phoneCountryCode;
    if (updates.phoneCallingCode)
      input.phones.primaryPhoneCallingCode = updates.phoneCallingCode;
  }

  if (updates.linkedinUrl) input.linkedinLink = transformLink(updates.linkedinUrl);
  if (updates.xUrl) input.xLink = transformLink(updates.xUrl);
  if (updates.jobTitle !== undefined) input.jobTitle = updates.jobTitle;
  if (updates.city !== undefined) input.city = updates.city;
  if (updates.companyId !== undefined) input.companyId = updates.companyId;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(params: ListPeopleParams): Record<string, unknown> | null {
  const { searchTerm, companyId } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) {
    filter.or = [
      { name: { firstName: { ilike: `%${searchTerm}%` } } },
      { name: { lastName: { ilike: `%${searchTerm}%` } } },
      { emails: { primaryEmail: { ilike: `%${searchTerm}%` } } },
    ];
  }
  if (companyId) {
    filter.companyId = { eq: companyId };
  }

  return Object.keys(filter).length > 0 ? filter : null;
}

// Create CRUD handlers using base handler
const handlers = createCRUDHandlers<
  CreatePersonInput,
  UpdatePersonInput,
  Person,
  PersonGraphQLInput,
  ListPeopleParams
>({
  entityName: "person",
  entityNameCapitalized: "Person",
  pluralEntityName: "people", // Irregular plural
  queries: {
    create: CREATE_PERSON_MUTATION,
    get: GET_PERSON_QUERY,
    list: LIST_PEOPLE_QUERY,
    update: UPDATE_PERSON_MUTATION,
  },
  transformCreateInput,
  transformUpdateInput,
  buildListFilter,
  formatCreateSuccess: (person) =>
    `✅ Created person: ${person.name.firstName} ${person.name.lastName}`,
});

// Export handlers
export const createPerson = handlers.create;
export const getPerson = handlers.get;
export const listPeople = handlers.list;
export const updatePerson = handlers.update;

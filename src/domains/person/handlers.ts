/**
 * Person domain handlers - Using base CRUD handler
 */

import { createCRUDHandlers } from "../../shared/base-handler.js";
import { GraphQLClient } from "../../shared/graphql-client.js";
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
 * Ensure critical custom fields are populated after creation.
 * Some create mutations may drop optional fields if an upstream validation fails,
 * so we immediately patch any missing values via updatePerson.
 */
async function ensureCustomFieldsAfterCreate({
  client,
  entity,
  originalInput,
}: {
  client: GraphQLClient;
  entity: Person;
  originalInput: CreatePersonInput;
}) {
  const missingFields: Partial<PersonGraphQLInput> = {};

  if (originalInput.education && !entity.education) {
    missingFields.education = originalInput.education;
  }

  if (originalInput.experience && !entity.experience) {
    missingFields.experience = originalInput.experience;
  }

  if (originalInput.addresss && !entity.addresss) {
    missingFields.addresss = originalInput.addresss;
  }

  if (originalInput.description && !entity.description) {
    missingFields.description = originalInput.description;
  }

  if (Object.keys(missingFields).length === 0) {
    return;
  }

  const updateResult = await client.request<Record<string, Person>>(
    UPDATE_PERSON_MUTATION,
    {
      id: entity.id,
      input: missingFields,
    }
  );

  return updateResult.updatePerson;
}

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
  if (data.education) input.education = data.education;
  if (data.addresss) input.addresss = data.addresss;
  if (data.description) input.description = data.description;
  if (data.experience) input.experience = data.experience;

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
  if (updates.education !== undefined) input.education = updates.education;
  if (updates.addresss !== undefined) input.addresss = updates.addresss;
  if (updates.description !== undefined) input.description = updates.description;
  if (updates.experience !== undefined) input.experience = updates.experience;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(params: ListPeopleParams): Record<string, unknown> | null {
  const { searchTerm, companyId } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) {
    const trimmed = searchTerm.trim();
    const terms = trimmed.split(/\s+/).filter(Boolean);
    const searchFilters: Record<string, unknown>[] = [
      { name: { firstName: { ilike: `%${trimmed}%` } } },
      { name: { lastName: { ilike: `%${trimmed}%` } } },
      { emails: { primaryEmail: { ilike: `%${trimmed}%` } } },
    ];

    if (terms.length >= 2) {
      const first = terms[0];
      const last = terms[terms.length - 1];

      searchFilters.push({
        and: [
          { name: { firstName: { ilike: `%${first}%` } } },
          { name: { lastName: { ilike: `%${last}%` } } },
        ],
      });
    }

    for (const term of terms) {
      searchFilters.push({ name: { firstName: { ilike: `%${term}%` } } });
      searchFilters.push({ name: { lastName: { ilike: `%${term}%` } } });
      searchFilters.push({ emails: { primaryEmail: { ilike: `%${term}%` } } });
    }

    filter.or = searchFilters;
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
  afterCreate: ensureCustomFieldsAfterCreate,
  formatCreateSuccess: (person) =>
    `✅ Created person: ${person.name.firstName} ${person.name.lastName}`,
});

// Export handlers
export const createPerson = handlers.create;
export const getPerson = handlers.get;
export const listPeople = handlers.list;
export const updatePerson = handlers.update;

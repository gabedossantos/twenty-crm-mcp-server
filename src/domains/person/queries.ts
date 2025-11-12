/**
 * GraphQL queries and mutations for Person operations
 */

export const CREATE_PERSON_MUTATION = `
  mutation CreatePerson($input: PersonCreateInput!) {
    createPerson(data: $input) {
      id
      name {
        firstName
        lastName
      }
      emails {
        primaryEmail
        additionalEmails
      }
      phones {
        primaryPhoneNumber
        primaryPhoneCountryCode
        primaryPhoneCallingCode
      }
      jobTitle
      city
      linkedinLink {
        primaryLinkUrl
      }
      xLink {
        primaryLinkUrl
      }
      companyId
      createdAt
    }
  }
`;

export const GET_PERSON_QUERY = `
  query GetPerson($id: UUID!) {
    person(filter: { id: { eq: $id } }) {
      id
      name {
        firstName
        lastName
      }
      emails {
        primaryEmail
        additionalEmails
      }
      phones {
        primaryPhoneNumber
        primaryPhoneCountryCode
        primaryPhoneCallingCode
      }
      jobTitle
      city
      linkedinLink {
        primaryLinkLabel
        primaryLinkUrl
      }
      xLink {
        primaryLinkLabel
        primaryLinkUrl
      }
      companyId
      company {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const LIST_PEOPLE_QUERY = `
  query ListPeople($filter: PersonFilterInput, $limit: Int) {
    people(filter: $filter, first: $limit) {
      edges {
        node {
          id
          name {
            firstName
            lastName
          }
          emails {
            primaryEmail
          }
          phones {
            primaryPhoneNumber
          }
          jobTitle
          city
          companyId
          company {
            id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const UPDATE_PERSON_MUTATION = `
  mutation UpdatePerson($id: UUID!, $input: PersonUpdateInput!) {
    updatePerson(id: $id, data: $input) {
      id
      name {
        firstName
        lastName
      }
      emails {
        primaryEmail
      }
      phones {
        primaryPhoneNumber
      }
      jobTitle
      city
      updatedAt
    }
  }
`;

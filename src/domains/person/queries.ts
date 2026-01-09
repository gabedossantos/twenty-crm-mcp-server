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
      website {
        primaryLinkLabel
        primaryLinkUrl
      }
      birthday
      education
      addresss
      description
      experience
      additionalInformation
      languages
      followercount
      connectioncount
      linkedinscore
      linkedinLastUpdated
      linkedinUrn
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
      website {
        primaryLinkLabel
        primaryLinkUrl
      }
      birthday
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
      education
      addresss
      description
      experience
      additionalInformation
      languages
      followercount
      connectioncount
      linkedinscore
      linkedinLastUpdated
      linkedinUrn
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
          website {
            primaryLinkUrl
          }
          birthday
          companyId
          company {
            id
            name
          }
          education
          addresss
          description
          experience
          additionalInformation
          languages
          followercount
          connectioncount
          linkedinscore
          linkedinLastUpdated
          linkedinUrn
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
      website {
        primaryLinkLabel
        primaryLinkUrl
      }
      imageUrl {
        primaryLinkLabel
        primaryLinkUrl
      }
      birthday
      city
      education
      addresss
      description
      experience
      additionalInformation
      languages
      followercount
      connectioncount
      linkedinscore
      linkedinLastUpdated
      linkedinUrn
      updatedAt
    }
  }
`;

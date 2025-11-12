/**
 * GraphQL queries and mutations for Opportunity operations
 */

export const CREATE_OPPORTUNITY_MUTATION = `
  mutation CreateOpportunity($input: OpportunityCreateInput!) {
    createOpportunity(data: $input) {
      id
      name
      amount {
        amountMicros
        currencyCode
      }
      stage
      closeDate
      companyId
      company {
        id
        name
      }
      pointOfContactId
      pointOfContact {
        id
        name {
          firstName
          lastName
        }
      }
      createdAt
    }
  }
`;

export const GET_OPPORTUNITY_QUERY = `
  query GetOpportunity($id: UUID!) {
    opportunity(filter: { id: { eq: $id } }) {
      id
      name
      amount {
        amountMicros
        currencyCode
      }
      stage
      closeDate
      companyId
      company {
        id
        name
      }
      pointOfContactId
      pointOfContact {
        id
        name {
          firstName
          lastName
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const LIST_OPPORTUNITIES_QUERY = `
  query ListOpportunities($filter: OpportunityFilterInput, $limit: Int) {
    opportunities(filter: $filter, first: $limit) {
      edges {
        node {
          id
          name
          amount {
            amountMicros
            currencyCode
          }
          stage
          closeDate
          companyId
          company {
            id
            name
          }
          pointOfContactId
          pointOfContact {
            id
            name {
              firstName
              lastName
            }
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

export const UPDATE_OPPORTUNITY_MUTATION = `
  mutation UpdateOpportunity($id: UUID!, $input: OpportunityUpdateInput!) {
    updateOpportunity(id: $id, data: $input) {
      id
      name
      amount {
        amountMicros
        currencyCode
      }
      stage
      closeDate
      companyId
      pointOfContactId
      updatedAt
    }
  }
`;

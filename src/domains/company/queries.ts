/**
 * GraphQL queries and mutations for Company operations
 */

export const CREATE_COMPANY_MUTATION = `
  mutation CreateCompany($input: CompanyCreateInput!) {
    createCompany(data: $input) {
      id
      name
      domainName {
        primaryLinkUrl
      }
      address {
        addressStreet1
        addressStreet2
        addressCity
        addressPostcode
        addressState
        addressCountry
      }
      employees
      linkedinLink {
        primaryLinkUrl
      }
      xLink {
        primaryLinkUrl
      }
      annualRecurringRevenue {
        amountMicros
        currencyCode
      }
      idealCustomerProfile
      createdAt
    }
  }
`;

export const GET_COMPANY_QUERY = `
  query GetCompany($id: UUID!) {
    company(filter: { id: { eq: $id } }) {
      id
      name
      domainName {
        primaryLinkUrl
      }
      address {
        addressStreet1
        addressStreet2
        addressCity
        addressPostcode
        addressState
        addressCountry
      }
      employees
      linkedinLink {
        primaryLinkUrl
      }
      xLink {
        primaryLinkUrl
      }
      annualRecurringRevenue {
        amountMicros
        currencyCode
      }
      idealCustomerProfile
      createdAt
      updatedAt
    }
  }
`;

export const LIST_COMPANIES_QUERY = `
  query ListCompanies($filter: CompanyFilterInput, $limit: Int) {
    companies(filter: $filter, first: $limit) {
      edges {
        node {
          id
          name
          domainName {
            primaryLinkUrl
          }
          address {
            addressStreet1
            addressStreet2
            addressCity
            addressPostcode
            addressState
            addressCountry
          }
          employees
          annualRecurringRevenue {
            amountMicros
            currencyCode
          }
          idealCustomerProfile
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const UPDATE_COMPANY_MUTATION = `
  mutation UpdateCompany($id: UUID!, $input: CompanyUpdateInput!) {
    updateCompany(id: $id, data: $input) {
      id
      name
      domainName {
        primaryLinkUrl
      }
      address {
        addressStreet1
        addressStreet2
        addressCity
        addressPostcode
        addressState
        addressCountry
      }
      employees
      annualRecurringRevenue {
        amountMicros
        currencyCode
      }
      updatedAt
    }
  }
`;

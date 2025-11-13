/**
 * GraphQL queries and mutations for Favorite operations
 */

export const CREATE_FAVORITE_MUTATION = `
  mutation CreateFavorite($input: FavoriteCreateInput!) {
    createFavorite(data: $input) {
      id
      position
      personId
      companyId
      opportunityId
      forWorkspaceMemberId
      createdAt
      updatedAt
    }
  }
`;

export const GET_FAVORITE_QUERY = `
  query GetFavorite($id: UUID!) {
    favorite(filter: { id: { eq: $id } }) {
      id
      position
      personId
      companyId
      opportunityId
      forWorkspaceMemberId
      createdAt
      updatedAt
    }
  }
`;

export const LIST_FAVORITES_QUERY = `
  query ListFavorites($filter: FavoriteFilterInput, $limit: Int) {
    favorites(filter: $filter, first: $limit) {
      edges {
        node {
          id
          position
          personId
          companyId
          opportunityId
          forWorkspaceMemberId
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const DELETE_FAVORITE_MUTATION = `
  mutation DeleteFavorite($id: UUID!) {
    deleteFavorite(id: $id) {
      id
    }
  }
`;

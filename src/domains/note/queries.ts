/**
 * GraphQL queries and mutations for Note operations
 */

export const CREATE_NOTE_MUTATION = `
  mutation CreateNote($input: NoteCreateInput!) {
    createNote(data: $input) {
      id
      title
      bodyV2 {
        blocknote
        markdown
      }
      position
      createdBy {
        source
      }
      createdAt
    }
  }
`;

export const GET_NOTE_QUERY = `
  query GetNote($id: UUID!) {
    note(filter: { id: { eq: $id } }) {
      id
      title
      bodyV2 {
        blocknote
        markdown
      }
      position
      createdBy {
        source
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const LIST_NOTES_QUERY = `
  query ListNotes($filter: NoteFilterInput, $limit: Int) {
    notes(filter: $filter, first: $limit) {
      edges {
        node {
          id
          title
          bodyV2 {
            blocknote
            markdown
          }
          position
          createdBy {
            source
          }
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

export const UPDATE_NOTE_MUTATION = `
  mutation UpdateNote($id: UUID!, $input: NoteUpdateInput!) {
    updateNote(id: $id, data: $input) {
      id
      title
      bodyV2 {
        blocknote
        markdown
      }
      position
      updatedAt
    }
  }
`;

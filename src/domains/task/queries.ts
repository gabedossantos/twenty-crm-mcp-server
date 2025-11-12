/**
 * GraphQL queries and mutations for Task operations
 */

export const CREATE_TASK_MUTATION = `
  mutation CreateTask($input: TaskCreateInput!) {
    createTask(data: $input) {
      id
      title
      bodyV2 {
        blocknote
        markdown
      }
      status
      dueAt
      position
      assigneeId
      assignee {
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

export const GET_TASK_QUERY = `
  query GetTask($id: UUID!) {
    task(filter: { id: { eq: $id } }) {
      id
      title
      bodyV2 {
        blocknote
        markdown
      }
      status
      dueAt
      position
      assigneeId
      assignee {
        id
        name {
          firstName
          lastName
        }
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const LIST_TASKS_QUERY = `
  query ListTasks($filter: TaskFilterInput, $limit: Int) {
    tasks(filter: $filter, first: $limit) {
      edges {
        node {
          id
          title
          bodyV2 {
            blocknote
            markdown
          }
          status
          dueAt
          position
          assigneeId
          assignee {
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
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const UPDATE_TASK_MUTATION = `
  mutation UpdateTask($id: UUID!, $input: TaskUpdateInput!) {
    updateTask(id: $id, data: $input) {
      id
      title
      bodyV2 {
        blocknote
        markdown
      }
      status
      dueAt
      position
      assigneeId
      updatedAt
    }
  }
`;

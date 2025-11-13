/**
 * GraphQL queries and mutations for TaskTarget operations
 */

export const CREATE_TASK_TARGET_MUTATION = `
  mutation CreateTaskTarget($input: TaskTargetCreateInput!) {
    createTaskTarget(data: $input) {
      id
      taskId
      personId
      companyId
      opportunityId
      createdAt
      updatedAt
    }
  }
`;

export const LIST_TASK_TARGETS_QUERY = `
  query ListTaskTargets($filter: TaskTargetFilterInput, $limit: Int) {
    taskTargets(filter: $filter, first: $limit) {
      edges {
        node {
          id
          taskId
          personId
          companyId
          opportunityId
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

export const DELETE_TASK_TARGET_MUTATION = `
  mutation DeleteTaskTarget($id: UUID!) {
    deleteTaskTarget(id: $id) {
      id
    }
  }
`;

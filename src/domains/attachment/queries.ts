/**
 * GraphQL queries and mutations for Attachment operations
 */

export const CREATE_ATTACHMENT_MUTATION = `
  mutation CreateAttachment($input: AttachmentCreateInput!) {
    createAttachment(data: $input) {
      id
      name
      fullPath
      type
      fileCategory
      taskId
      opportunityId
      companyId
      personId
      workflowId
      dashboardId
      authorId
      createdBy {
        source
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ATTACHMENT_QUERY = `
  query GetAttachment($id: UUID!) {
    attachment(filter: { id: { eq: $id } }) {
      id
      name
      fullPath
      type
      fileCategory
      taskId
      opportunityId
      companyId
      personId
      workflowId
      dashboardId
      authorId
      createdBy {
        source
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const LIST_ATTACHMENTS_QUERY = `
  query ListAttachments($filter: AttachmentFilterInput, $limit: Int) {
    attachments(filter: $filter, first: $limit) {
      edges {
        node {
          id
          name
          fullPath
          type
          fileCategory
          taskId
          opportunityId
          companyId
          personId
          workflowId
          dashboardId
          authorId
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

export const DELETE_ATTACHMENT_MUTATION = `
  mutation DeleteAttachment($id: UUID!) {
    deleteAttachment(id: $id) {
      id
    }
  }
`;

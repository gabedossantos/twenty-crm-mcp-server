/**
 * GraphQL queries and mutations for TimelineActivity operations
 */

export const CREATE_TIMELINE_ACTIVITY_MUTATION = `
  mutation CreateTimelineActivity($input: TimelineActivityCreateInput!) {
    createTimelineActivity(data: $input) {
      id
      name
      properties
      happensAt
      linkedRecordId
      linkedObjectMetadataId
      linkedRecordCachedName
      workspaceMemberId
      personId
      companyId
      opportunityId
      noteId
      taskId
      workflowId
      workflowVersionId
      workflowRunId
      dashboardId
      createdAt
    }
  }
`;

export const GET_TIMELINE_ACTIVITY_QUERY = `
  query GetTimelineActivity($id: UUID!) {
    timelineActivity(filter: { id: { eq: $id } }) {
      id
      name
      properties
      happensAt
      linkedRecordId
      linkedObjectMetadataId
      linkedRecordCachedName
      workspaceMemberId
      personId
      companyId
      opportunityId
      noteId
      taskId
      workflowId
      workflowVersionId
      workflowRunId
      dashboardId
      createdAt
      updatedAt
    }
  }
`;

export const LIST_TIMELINE_ACTIVITIES_QUERY = `
  query ListTimelineActivities($filter: TimelineActivityFilterInput, $limit: Int) {
    timelineActivities(filter: $filter, first: $limit) {
      edges {
        node {
          id
          name
          properties
          happensAt
          linkedRecordId
          linkedObjectMetadataId
          linkedRecordCachedName
          workspaceMemberId
          personId
          companyId
          opportunityId
          noteId
          taskId
          workflowId
          workflowVersionId
          workflowRunId
          dashboardId
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

export const UPDATE_TIMELINE_ACTIVITY_MUTATION = `
  mutation UpdateTimelineActivity($id: UUID!, $input: TimelineActivityUpdateInput!) {
    updateTimelineActivity(id: $id, data: $input) {
      id
      name
      properties
      happensAt
      linkedRecordId
      linkedObjectMetadataId
      linkedRecordCachedName
      workspaceMemberId
      personId
      companyId
      opportunityId
      noteId
      taskId
      workflowId
      workflowVersionId
      workflowRunId
      dashboardId
      updatedAt
    }
  }
`;

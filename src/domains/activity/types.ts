/**
 * TimelineActivity domain type definitions
 */

import { TimelineActivity } from "../../shared/types.js";

// ======================
// INPUT TYPES
// ======================

export interface CreateTimelineActivityInput {
  name: string;
  properties?: Record<string, unknown>;
  happensAt?: string;
  linkedRecordId?: string;
  linkedObjectMetadataId?: string;
  linkedRecordCachedName?: string;
  workspaceMemberId?: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  noteId?: string;
  taskId?: string;
  workflowId?: string;
  workflowVersionId?: string;
  workflowRunId?: string;
  dashboardId?: string;
}

export interface UpdateTimelineActivityInput {
  id: string;
  name?: string;
  properties?: Record<string, unknown>;
  happensAt?: string;
  linkedRecordId?: string;
  linkedObjectMetadataId?: string;
  linkedRecordCachedName?: string;
  workspaceMemberId?: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  noteId?: string;
  taskId?: string;
  workflowId?: string;
  workflowVersionId?: string;
  workflowRunId?: string;
  dashboardId?: string;
}

export interface ListTimelineActivitiesParams {
  limit?: number;
  searchTerm?: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  workspaceMemberId?: string;
  noteId?: string;
  taskId?: string;
}

// ======================
// GRAPHQL INPUT TYPES
// ======================

export interface TimelineActivityGraphQLInput {
  name: string;
  properties?: Record<string, unknown>;
  happensAt?: string;
  linkedRecordId?: string;
  linkedObjectMetadataId?: string;
  linkedRecordCachedName?: string;
  workspaceMemberId?: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  noteId?: string;
  taskId?: string;
  workflowId?: string;
  workflowVersionId?: string;
  workflowRunId?: string;
  dashboardId?: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface TimelineActivitiesEdge {
  node: TimelineActivity;
}

export interface TimelineActivitiesConnection {
  edges: TimelineActivitiesEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Re-export shared type
export type { TimelineActivity };

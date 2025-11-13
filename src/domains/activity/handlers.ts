/**
 * TimelineActivity domain handlers - Using base CRUD handler
 */

import { createCRUDHandlers } from "../../shared/base-handler.js";
import {
  CREATE_TIMELINE_ACTIVITY_MUTATION,
  GET_TIMELINE_ACTIVITY_QUERY,
  LIST_TIMELINE_ACTIVITIES_QUERY,
  UPDATE_TIMELINE_ACTIVITY_MUTATION,
} from "./queries.js";
import {
  CreateTimelineActivityInput,
  UpdateTimelineActivityInput,
  ListTimelineActivitiesParams,
  TimelineActivity,
  TimelineActivityGraphQLInput,
} from "./types.js";

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(
  data: CreateTimelineActivityInput
): TimelineActivityGraphQLInput {
  const input: TimelineActivityGraphQLInput = {
    name: data.name,
  };

  if (data.properties) input.properties = data.properties;
  if (data.happensAt) input.happensAt = data.happensAt;
  if (data.linkedRecordId) input.linkedRecordId = data.linkedRecordId;
  if (data.linkedObjectMetadataId)
    input.linkedObjectMetadataId = data.linkedObjectMetadataId;
  if (data.linkedRecordCachedName)
    input.linkedRecordCachedName = data.linkedRecordCachedName;
  if (data.workspaceMemberId) input.workspaceMemberId = data.workspaceMemberId;
  if (data.personId) input.personId = data.personId;
  if (data.companyId) input.companyId = data.companyId;
  if (data.opportunityId) input.opportunityId = data.opportunityId;
  if (data.noteId) input.noteId = data.noteId;
  if (data.taskId) input.taskId = data.taskId;
  if (data.workflowId) input.workflowId = data.workflowId;
  if (data.workflowVersionId) input.workflowVersionId = data.workflowVersionId;
  if (data.workflowRunId) input.workflowRunId = data.workflowRunId;
  if (data.dashboardId) input.dashboardId = data.dashboardId;

  return input;
}

/**
 * Transform update input to GraphQL format
 */
function transformUpdateInput(
  data: UpdateTimelineActivityInput
): Partial<TimelineActivityGraphQLInput> {
  const { id, ...updates } = data;
  const input: Partial<TimelineActivityGraphQLInput> = {};

  if (updates.name !== undefined) input.name = updates.name;
  if (updates.properties !== undefined) input.properties = updates.properties;
  if (updates.happensAt !== undefined) input.happensAt = updates.happensAt;
  if (updates.linkedRecordId !== undefined)
    input.linkedRecordId = updates.linkedRecordId;
  if (updates.linkedObjectMetadataId !== undefined)
    input.linkedObjectMetadataId = updates.linkedObjectMetadataId;
  if (updates.linkedRecordCachedName !== undefined)
    input.linkedRecordCachedName = updates.linkedRecordCachedName;
  if (updates.workspaceMemberId !== undefined)
    input.workspaceMemberId = updates.workspaceMemberId;
  if (updates.personId !== undefined) input.personId = updates.personId;
  if (updates.companyId !== undefined) input.companyId = updates.companyId;
  if (updates.opportunityId !== undefined)
    input.opportunityId = updates.opportunityId;
  if (updates.noteId !== undefined) input.noteId = updates.noteId;
  if (updates.taskId !== undefined) input.taskId = updates.taskId;
  if (updates.workflowId !== undefined) input.workflowId = updates.workflowId;
  if (updates.workflowVersionId !== undefined)
    input.workflowVersionId = updates.workflowVersionId;
  if (updates.workflowRunId !== undefined)
    input.workflowRunId = updates.workflowRunId;
  if (updates.dashboardId !== undefined) input.dashboardId = updates.dashboardId;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(
  params: ListTimelineActivitiesParams
): Record<string, unknown> | null {
  const {
    searchTerm,
    personId,
    companyId,
    opportunityId,
    workspaceMemberId,
    noteId,
    taskId,
  } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) filter.name = { ilike: `%${searchTerm}%` };
  if (personId) filter.personId = { eq: personId };
  if (companyId) filter.companyId = { eq: companyId };
  if (opportunityId) filter.opportunityId = { eq: opportunityId };
  if (workspaceMemberId) filter.workspaceMemberId = { eq: workspaceMemberId };
  if (noteId) filter.noteId = { eq: noteId };
  if (taskId) filter.taskId = { eq: taskId };

  return Object.keys(filter).length > 0 ? filter : null;
}

// Create CRUD handlers using base handler
const handlers = createCRUDHandlers<
  CreateTimelineActivityInput,
  UpdateTimelineActivityInput,
  TimelineActivity,
  TimelineActivityGraphQLInput,
  ListTimelineActivitiesParams
>({
  entityName: "timelineActivity",
  entityNameCapitalized: "TimelineActivity",
  pluralEntityName: "timelineActivities",
  queries: {
    create: CREATE_TIMELINE_ACTIVITY_MUTATION,
    get: GET_TIMELINE_ACTIVITY_QUERY,
    list: LIST_TIMELINE_ACTIVITIES_QUERY,
    update: UPDATE_TIMELINE_ACTIVITY_MUTATION,
  },
  transformCreateInput,
  transformUpdateInput,
  buildListFilter,
  formatCreateSuccess: (timelineActivity) =>
    `✅ Created timeline activity: ${timelineActivity.name}`,
});

// Export handlers
export const createTimelineActivity = handlers.create;
export const getTimelineActivity = handlers.get;
export const listTimelineActivities = handlers.list;
export const updateTimelineActivity = handlers.update;

/**
 * Attachment domain handlers
 */

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { GraphQLClient } from "../../shared/graphql-client.js";
import { Connection } from "../../shared/types.js";
import {
  CREATE_ATTACHMENT_MUTATION,
  GET_ATTACHMENT_QUERY,
  LIST_ATTACHMENTS_QUERY,
  DELETE_ATTACHMENT_MUTATION,
} from "./queries.js";
import {
  CreateAttachmentInput,
  ListAttachmentsParams,
  Attachment,
  AttachmentGraphQLInput,
} from "./types.js";

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(
  data: CreateAttachmentInput
): AttachmentGraphQLInput {
  // Validate that at least one relationship ID is provided
  const hasRelationship =
    data.taskId ||
    data.opportunityId ||
    data.companyId ||
    data.personId ||
    data.workflowId ||
    data.dashboardId;

  if (!hasRelationship) {
    throw new Error(
      "At least one relationship ID (taskId, companyId, personId, opportunityId, workflowId, or dashboardId) must be provided"
    );
  }

  const input: AttachmentGraphQLInput = {
    name: data.name,
    fullPath: data.fullPath,
  };

  if (data.fileCategory) input.fileCategory = data.fileCategory;
  if (data.taskId) input.taskId = data.taskId;
  if (data.opportunityId) input.opportunityId = data.opportunityId;
  if (data.companyId) input.companyId = data.companyId;
  if (data.personId) input.personId = data.personId;
  if (data.workflowId) input.workflowId = data.workflowId;
  if (data.dashboardId) input.dashboardId = data.dashboardId;
  if (data.authorId) input.authorId = data.authorId;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(
  params: ListAttachmentsParams
): Record<string, unknown> | null {
  const {
    searchTerm,
    fileCategory,
    taskId,
    opportunityId,
    companyId,
    personId,
    workflowId,
    dashboardId,
    authorId,
  } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) filter.name = { ilike: `%${searchTerm}%` };
  if (fileCategory) filter.fileCategory = { eq: fileCategory };
  if (taskId) filter.taskId = { eq: taskId };
  if (opportunityId) filter.opportunityId = { eq: opportunityId };
  if (companyId) filter.companyId = { eq: companyId };
  if (personId) filter.personId = { eq: personId };
  if (workflowId) filter.workflowId = { eq: workflowId };
  if (dashboardId) filter.dashboardId = { eq: dashboardId };
  if (authorId) filter.authorId = { eq: authorId };

  return Object.keys(filter).length > 0 ? filter : null;
}

/**
 * Create a new attachment
 */
export async function createAttachment(
  client: GraphQLClient,
  data: CreateAttachmentInput
): Promise<CallToolResult> {
  const input = transformCreateInput(data);

  const result = await client.request<{ createAttachment: Attachment }>(
    CREATE_ATTACHMENT_MUTATION,
    { input }
  );

  const attachment = result.createAttachment;

  // Determine what was linked
  const linkedTo = attachment.taskId
    ? `task (${attachment.taskId})`
    : attachment.companyId
    ? `company (${attachment.companyId})`
    : attachment.personId
    ? `person (${attachment.personId})`
    : attachment.opportunityId
    ? `opportunity (${attachment.opportunityId})`
    : attachment.workflowId
    ? `workflow (${attachment.workflowId})`
    : `dashboard (${attachment.dashboardId})`;

  return {
    content: [
      {
        type: "text",
        text: `✅ Created attachment: ${attachment.name}\nLinked to: ${linkedTo}\n\n${JSON.stringify(attachment, null, 2)}`,
      },
    ],
  };
}

/**
 * Get an attachment by ID
 */
export async function getAttachment(
  client: GraphQLClient,
  id: string
): Promise<CallToolResult> {
  const result = await client.request<{ attachment: Attachment }>(
    GET_ATTACHMENT_QUERY,
    { id }
  );

  const attachment = result.attachment;

  return {
    content: [
      {
        type: "text",
        text: `Attachment details:\n\n${JSON.stringify(attachment, null, 2)}`,
      },
    ],
  };
}

/**
 * List attachments with optional filtering
 */
export async function listAttachments(
  client: GraphQLClient,
  params: ListAttachmentsParams = {}
): Promise<CallToolResult> {
  const { limit = 20, ...filterParams } = params;
  const filter = buildListFilter(filterParams);

  const result = await client.request<{
    attachments: Connection<Attachment>;
  }>(LIST_ATTACHMENTS_QUERY, { filter, limit });

  const connection = result.attachments;
  const attachments = connection.edges.map((edge) => edge.node);
  const summary = `Found ${attachments.length} attachment(s)${
    connection.pageInfo.hasNextPage ? " (more available)" : ""
  }`;

  return {
    content: [
      {
        type: "text",
        text: `${summary}\n\n${JSON.stringify(attachments, null, 2)}`,
      },
    ],
  };
}

/**
 * Delete an attachment
 */
export async function deleteAttachment(
  client: GraphQLClient,
  id: string
): Promise<CallToolResult> {
  await client.request<{ deleteAttachment: { id: string } }>(
    DELETE_ATTACHMENT_MUTATION,
    { id }
  );

  return {
    content: [
      {
        type: "text",
        text: `✅ Deleted attachment: ${id}`,
      },
    ],
  };
}

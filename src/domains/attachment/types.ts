/**
 * Attachment domain type definitions
 */

// ======================
// ENUMS
// ======================

export type AttachmentCategory =
  | "ARCHIVE"
  | "AUDIO"
  | "IMAGE"
  | "PRESENTATION"
  | "SPREADSHEET"
  | "TEXT_DOCUMENT"
  | "VIDEO"
  | "OTHER";

export type AttachmentSource =
  | "EMAIL"
  | "CALENDAR"
  | "WORKFLOW"
  | "AGENT"
  | "API"
  | "IMPORT"
  | "MANUAL"
  | "SYSTEM"
  | "WEBHOOK";

// ======================
// INPUT TYPES
// ======================

export interface CreateAttachmentInput {
  name: string;
  fullPath: string;
  fileCategory?: AttachmentCategory;

  // Link to one of these entities:
  taskId?: string;
  opportunityId?: string;
  companyId?: string;
  personId?: string;
  workflowId?: string;
  dashboardId?: string;
  authorId?: string;
}

export interface UpdateAttachmentInput {
  id: string;
  name?: string;
  fullPath?: string;
  fileCategory?: AttachmentCategory;
  taskId?: string;
  opportunityId?: string;
  companyId?: string;
  personId?: string;
  workflowId?: string;
  dashboardId?: string;
}

export interface ListAttachmentsParams {
  limit?: number;
  searchTerm?: string;
  fileCategory?: AttachmentCategory;

  // Filter by relationship:
  taskId?: string;
  opportunityId?: string;
  companyId?: string;
  personId?: string;
  workflowId?: string;
  dashboardId?: string;
  authorId?: string;
}

// ======================
// GRAPHQL TYPES
// ======================

export interface AttachmentGraphQLInput {
  name: string;
  fullPath: string;
  type?: string; // Deprecated field, kept for compatibility
  fileCategory?: AttachmentCategory;
  taskId?: string;
  opportunityId?: string;
  companyId?: string;
  personId?: string;
  workflowId?: string;
  dashboardId?: string;
  authorId?: string;
}

// ======================
// DOMAIN MODEL
// ======================

export interface Attachment {
  id: string;
  name: string;
  fullPath: string;
  type?: string; // Deprecated
  fileCategory?: AttachmentCategory;

  // Relationships
  taskId?: string;
  opportunityId?: string;
  companyId?: string;
  personId?: string;
  workflowId?: string;
  dashboardId?: string;
  authorId?: string;

  // Metadata
  createdBy?: {
    source: AttachmentSource;
  };
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  localPreview?: AttachmentLocalPreview;
}

export type AttachmentLocalPreview =
  | {
      type: "text";
      localPath: string;
      content: string;
      truncated: boolean;
    }
  | {
      type: "binary";
      localPath: string;
    };

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface AttachmentsEdge {
  node: Attachment;
}

export interface AttachmentsConnection {
  edges: AttachmentsEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

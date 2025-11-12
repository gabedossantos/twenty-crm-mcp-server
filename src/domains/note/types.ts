/**
 * Note domain type definitions
 */

import { BodyV2Composite } from "../../shared/types.js";

// ======================
// INPUT TYPES
// ======================

export interface CreateNoteInput {
  title: string;
  body?: string;
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  body?: string;
}

export interface ListNotesParams {
  limit?: number;
  searchTerm?: string;
}

// ======================
// GRAPHQL TYPES
// ======================

export interface NoteGraphQLInput {
  title: string;
  bodyV2?: BodyV2Composite;
}

// ======================
// DOMAIN MODEL
// ======================

export interface Note {
  id: string;
  title: string;
  bodyV2?: BodyV2Composite;
  position?: number;
  createdBy?: {
    source: string;
  };
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface NotesEdge {
  node: Note;
}

export interface NotesConnection {
  edges: NotesEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

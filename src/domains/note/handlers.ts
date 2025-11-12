/**
 * Note domain handlers - Using base CRUD handler
 */

import { createCRUDHandlers } from "../../shared/base-handler.js";
import { transformBodyV2 } from "../../shared/transformers.js";
import {
  CREATE_NOTE_MUTATION,
  GET_NOTE_QUERY,
  LIST_NOTES_QUERY,
  UPDATE_NOTE_MUTATION,
} from "./queries.js";
import {
  CreateNoteInput,
  UpdateNoteInput,
  ListNotesParams,
  Note,
  NoteGraphQLInput,
} from "./types.js";

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(data: CreateNoteInput): NoteGraphQLInput {
  const input: NoteGraphQLInput = {
    title: data.title,
  };

  if (data.body) {
    input.bodyV2 = transformBodyV2(data.body);
  }

  return input;
}

/**
 * Transform update input to GraphQL format
 */
function transformUpdateInput(data: UpdateNoteInput): Partial<NoteGraphQLInput> {
  const { id, ...updates } = data;
  const input: Partial<NoteGraphQLInput> = {};

  if (updates.title !== undefined) input.title = updates.title;

  if (updates.body !== undefined) {
    input.bodyV2 = transformBodyV2(updates.body);
  }

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(
  params: ListNotesParams
): Record<string, unknown> | null {
  const { searchTerm } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) filter.title = { ilike: `%${searchTerm}%` };

  return Object.keys(filter).length > 0 ? filter : null;
}

// Create CRUD handlers using base handler
const handlers = createCRUDHandlers<
  CreateNoteInput,
  UpdateNoteInput,
  Note,
  NoteGraphQLInput,
  ListNotesParams
>({
  entityName: "note",
  entityNameCapitalized: "Note",
  queries: {
    create: CREATE_NOTE_MUTATION,
    get: GET_NOTE_QUERY,
    list: LIST_NOTES_QUERY,
    update: UPDATE_NOTE_MUTATION,
  },
  transformCreateInput,
  transformUpdateInput,
  buildListFilter,
  formatCreateSuccess: (note) => `✅ Created note: ${note.title}`,
});

// Export handlers
export const createNote = handlers.create;
export const getNote = handlers.get;
export const listNotes = handlers.list;
export const updateNote = handlers.update;

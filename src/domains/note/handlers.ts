/**
 * Note domain handlers - Using base CRUD handler
 */

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { createCRUDHandlers } from "../../shared/base-handler.js";
import { GraphQLClient } from "../../shared/graphql-client.js";
import { transformBodyV2 } from "../../shared/transformers.js";
import {
  CREATE_NOTE_MUTATION,
  GET_NOTE_QUERY,
  LIST_NOTES_QUERY,
  UPDATE_NOTE_MUTATION,
} from "./queries.js";
import { CREATE_NOTE_TARGET_MUTATION } from "../noteTarget/queries.js";
import {
  CreateNoteInput,
  UpdateNoteInput,
  ListNotesParams,
  Note,
  NoteGraphQLInput,
} from "./types.js";

/**
 * Build REST client configuration from environment
 */
function getRestConfig() {
  const apiKey = process.env.TWENTY_API_KEY || "";
  const baseUrl = process.env.TWENTY_BASE_URL || "https://api.twenty.com";

  if (!apiKey) {
    throw new Error("TWENTY_API_KEY environment variable is required");
  }

  return { apiKey, baseUrl };
}

/**
 * POST helper for REST endpoints
 */
async function postJson<T>(
  url: string,
  apiKey: string,
  payload: unknown
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`REST request failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as T;
}

/**
 * Normalize note response shape from REST create endpoint
 */
function extractNoteFromResponse(response: unknown): Note {
  const asNote = (candidate: unknown): Note | undefined => {
    if (!candidate || typeof candidate !== "object") return undefined;
    const obj = candidate as Record<string, unknown>;
    if (typeof obj.id === "string") {
      return obj as unknown as Note;
    }
    return undefined;
  };

  const candidates: Array<Note | undefined> = [];

  if (response && typeof response === "object") {
    const obj = response as Record<string, unknown>;
    candidates.push(asNote(obj));
    candidates.push(asNote(obj.data));
    if (obj.data && typeof obj.data === "object") {
      candidates.push(asNote((obj.data as { note?: unknown }).note));
      candidates.push(asNote((obj.data as { createNote?: unknown }).createNote));
    }
    candidates.push(asNote(obj.note));
  }

  if (Array.isArray(response) && response.length > 0) {
    for (const item of response) {
      candidates.push(asNote(item));
    }
  }

  const found = candidates.find((c) => c && typeof c.id === "string");

  if (!found) {
    throw new Error(
      `Note creation response did not include an id. Raw response: ${JSON.stringify(
        response,
        null,
        2
      )}`
    );
  }

  return found;
}

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(data: CreateNoteInput): NoteGraphQLInput {
  const input: NoteGraphQLInput = {
    title: data.title,
    position: 0,
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

/**
 * Create note (REST) and optionally link to a person
 */
export async function createNote(
  client: GraphQLClient,
  data: CreateNoteInput
): Promise<CallToolResult> {
  const { apiKey, baseUrl } = getRestConfig();
  const input = transformCreateInput(data);

  // First attempt: send payload as-is
  let noteResponse: unknown;
  let note: Note | undefined;

  try {
    noteResponse = await postJson<unknown>(
      `${baseUrl}/rest/notes`,
      apiKey,
      input
    );
    note = extractNoteFromResponse(noteResponse);
  } catch (firstError) {
    // Retry with { data: input } shape if id missing or parsing failed
    try {
      noteResponse = await postJson<unknown>(
        `${baseUrl}/rest/notes`,
        apiKey,
        { data: input }
      );
      note = extractNoteFromResponse(noteResponse);
    } catch (secondError) {
      // Re-throw the original error with both payload attempts for clarity
      const details =
        noteResponse !== undefined
          ? ` Last response: ${JSON.stringify(noteResponse, null, 2)}`
          : "";
      throw new Error(
        `Note creation failed: ${
          firstError instanceof Error ? firstError.message : String(firstError)
        }.${details}`
      );
    }
  }

  let linkedToPerson = false;
  let linkWarning: string | null = null;

  if (data.personId) {
    try {
      await client.request(CREATE_NOTE_TARGET_MUTATION, {
        input: {
          noteId: note.id,
          personId: data.personId,
        },
      });
      linkedToPerson = true;
    } catch (error) {
      console.error("Failed to link note to person", error);
      linkWarning = `⚠️ Note created but linking to person (${data.personId}) failed: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  const baseMessage = `✅ Created note: ${note.title || note.id}`;
  const linkMessage = data.personId
    ? linkedToPerson
      ? `🔗 Linked to person (${data.personId}).`
      : linkWarning || "Link to person was requested but did not complete."
    : null;

  const message = [baseMessage, linkMessage].filter(Boolean).join("\n");

  return {
    content: [
      {
        type: "text",
        text: `${message}\n\n${JSON.stringify(note, null, 2)}`,
      },
    ],
  };
}

// Export handlers
export const getNote = handlers.get;
export const listNotes = handlers.list;
export const updateNote = handlers.update;

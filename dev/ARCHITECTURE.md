# Architecture Guide - Twenty CRM MCP Server

**Version:** 0.4.0
**Last Updated:** November 12, 2025

This document explains the modular architecture and how to add new features.

---

## 📐 Architecture Overview

### Modular Domain-Driven Design

The server follows a **modular domain-driven architecture** introduced in v0.3.0:

```
src/
├── domains/               # Domain modules (one per CRM object)
│   ├── person/
│   ├── company/
│   ├── opportunity/
│   ├── task/
│   └── note/
├── shared/                # Shared utilities
│   ├── base-handler.ts    # Generic CRUD operations
│   ├── graphql-client.ts  # GraphQL client
│   ├── transformers.ts    # Field transformations
│   ├── converters.ts      # Data converters
│   └── types.ts           # Shared types
└── index.ts               # Main server
```

### Domain Module Structure

Each domain follows this exact structure:

```
domains/example/
├── types.ts      # Type definitions
├── queries.ts    # GraphQL queries/mutations
├── handlers.ts   # Business logic
├── tools.ts      # MCP tool definitions
└── index.ts      # Public exports
```

---

## 🔧 Adding a New Domain

### Step-by-Step Guide

Let's walk through adding a new domain called `activity` (timelineActivities).

#### 1. Create Domain Directory

```bash
mkdir -p src/domains/activity
```

#### 2. Create `types.ts`

Define all TypeScript interfaces:

```typescript
/**
 * Activity domain type definitions
 */

import { BodyV2Composite } from "../../shared/types.js";

// ======================
// INPUT TYPES
// ======================

export interface CreateActivityInput {
  title: string;
  body?: string;
  type?: string;
  happenedAt?: string;
  linkedRecordId?: string;
}

export interface UpdateActivityInput {
  id: string;
  title?: string;
  body?: string;
  type?: string;
  happenedAt?: string;
}

export interface ListActivitiesParams {
  limit?: number;
  searchTerm?: string;
  type?: string;
  linkedRecordId?: string;
  startDate?: string;
  endDate?: string;
}

// ======================
// GRAPHQL TYPES
// ======================

export interface ActivityGraphQLInput {
  title: string;
  bodyV2?: BodyV2Composite;
  type?: string;
  happenedAt?: string;
  linkedRecordId?: string;
}

// ======================
// DOMAIN MODEL
// ======================

export interface Activity {
  id: string;
  title: string;
  bodyV2?: BodyV2Composite;
  type?: string;
  happenedAt?: string;
  linkedRecordId?: string;
  linkedRecord?: {
    id: string;
    name?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface ActivitiesEdge {
  node: Activity;
}

export interface ActivitiesConnection {
  edges: ActivitiesEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

**Key Patterns:**
- `CreateXInput` - Required + optional fields for creation
- `UpdateXInput` - ID required + all fields optional
- `ListXParams` - Filtering and pagination parameters
- `XGraphQLInput` - Maps to Twenty's GraphQL schema
- Domain model matches GraphQL response structure

#### 3. Create `queries.ts`

Define GraphQL operations:

```typescript
/**
 * GraphQL queries and mutations for Activity operations
 */

export const CREATE_ACTIVITY_MUTATION = `
  mutation CreateActivity($input: ActivityCreateInput!) {
    createActivity(data: $input) {
      id
      title
      bodyV2 {
        blocknote
        markdown
      }
      type
      happenedAt
      linkedRecordId
      linkedRecord {
        id
        __typename
      }
      createdAt
    }
  }
`;

export const GET_ACTIVITY_QUERY = `
  query GetActivity($id: UUID!) {
    timelineActivity(filter: { id: { eq: $id } }) {
      id
      title
      bodyV2 {
        blocknote
        markdown
      }
      type
      happenedAt
      linkedRecordId
      linkedRecord {
        id
        __typename
      }
      createdAt
      updatedAt
    }
  }
`;

export const LIST_ACTIVITIES_QUERY = `
  query ListActivities($filter: TimelineActivityFilterInput, $limit: Int) {
    timelineActivities(filter: $filter, first: $limit) {
      edges {
        node {
          id
          title
          bodyV2 {
            blocknote
            markdown
          }
          type
          happenedAt
          linkedRecordId
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

export const UPDATE_ACTIVITY_MUTATION = `
  mutation UpdateActivity($id: UUID!, $input: ActivityUpdateInput!) {
    updateActivity(id: $id, data: $input) {
      id
      title
      bodyV2 {
        blocknote
        markdown
      }
      type
      happenedAt
      updatedAt
    }
  }
`;
```

**Important:**
- Use exact field names from Twenty's GraphQL schema
- Include all composite fields (like `bodyV2`)
- Request all fields needed for the UI
- Use consistent query naming

#### 4. Create `handlers.ts`

Implement business logic using base CRUD handler:

```typescript
/**
 * Activity domain handlers - Using base CRUD handler
 */

import { createCRUDHandlers } from "../../shared/base-handler.js";
import { transformBodyV2 } from "../../shared/transformers.js";
import {
  CREATE_ACTIVITY_MUTATION,
  GET_ACTIVITY_QUERY,
  LIST_ACTIVITIES_QUERY,
  UPDATE_ACTIVITY_MUTATION,
} from "./queries.js";
import {
  CreateActivityInput,
  UpdateActivityInput,
  ListActivitiesParams,
  Activity,
  ActivityGraphQLInput,
} from "./types.js";

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(
  data: CreateActivityInput
): ActivityGraphQLInput {
  const input: ActivityGraphQLInput = {
    title: data.title,
  };

  if (data.body) {
    input.bodyV2 = transformBodyV2(data.body);
  }

  if (data.type) input.type = data.type;
  if (data.happenedAt) input.happenedAt = data.happenedAt;
  if (data.linkedRecordId) input.linkedRecordId = data.linkedRecordId;

  return input;
}

/**
 * Transform update input to GraphQL format
 */
function transformUpdateInput(
  data: UpdateActivityInput
): Partial<ActivityGraphQLInput> {
  const { id, ...updates } = data;
  const input: Partial<ActivityGraphQLInput> = {};

  if (updates.title !== undefined) input.title = updates.title;

  if (updates.body !== undefined) {
    input.bodyV2 = transformBodyV2(updates.body);
  }

  if (updates.type !== undefined) input.type = updates.type;
  if (updates.happenedAt !== undefined) input.happenedAt = updates.happenedAt;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(
  params: ListActivitiesParams
): Record<string, unknown> | null {
  const { searchTerm, type, linkedRecordId, startDate, endDate } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) filter.title = { ilike: `%${searchTerm}%` };
  if (type) filter.type = { eq: type };
  if (linkedRecordId) filter.linkedRecordId = { eq: linkedRecordId };

  // Date range filtering
  if (startDate || endDate) {
    filter.happenedAt = {};
    if (startDate) filter.happenedAt.gte = startDate;
    if (endDate) filter.happenedAt.lte = endDate;
  }

  return Object.keys(filter).length > 0 ? filter : null;
}

// Create CRUD handlers using base handler
const handlers = createCRUDHandlers<
  CreateActivityInput,
  UpdateActivityInput,
  Activity,
  ActivityGraphQLInput,
  ListActivitiesParams
>({
  entityName: "timelineActivity",
  entityNameCapitalized: "Activity",
  queries: {
    create: CREATE_ACTIVITY_MUTATION,
    get: GET_ACTIVITY_QUERY,
    list: LIST_ACTIVITIES_QUERY,
    update: UPDATE_ACTIVITY_MUTATION,
  },
  transformCreateInput,
  transformUpdateInput,
  buildListFilter,
  formatCreateSuccess: (activity) => `✅ Created activity: ${activity.title}`,
});

// Export handlers
export const createActivity = handlers.create;
export const getActivity = handlers.get;
export const listActivities = handlers.list;
export const updateActivity = handlers.update;
```

**Key Components:**
- `transformCreateInput` - Convert API input to GraphQL format
- `transformUpdateInput` - Handle partial updates
- `buildListFilter` - Construct Twenty filter syntax
- `createCRUDHandlers` - Generic handler factory
- Export individual handlers for use in main server

#### 5. Create `tools.ts`

Define MCP tool schemas:

```typescript
/**
 * MCP tool definitions for Activity operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ACTIVITY_TOOLS: Tool[] = [
  {
    name: "create_activity",
    description: "Create a new activity in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Activity title (required)" },
        body: {
          type: "string",
          description: "Activity description in markdown format",
        },
        type: {
          type: "string",
          description: "Activity type (e.g., 'call', 'email', 'meeting')",
        },
        happenedAt: {
          type: "string",
          description: "When activity happened (ISO 8601: YYYY-MM-DDTHH:MM:SSZ)",
        },
        linkedRecordId: {
          type: "string",
          description: "ID of linked record (person, company, opportunity)",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "get_activity",
    description: "Get details of a specific activity by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Activity ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_activities",
    description: "List activities with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
        searchTerm: {
          type: "string",
          description: "Search by activity title",
        },
        type: {
          type: "string",
          description: "Filter by activity type",
        },
        linkedRecordId: {
          type: "string",
          description: "Filter by linked record ID",
        },
        startDate: {
          type: "string",
          description: "Filter activities after this date (ISO 8601)",
        },
        endDate: {
          type: "string",
          description: "Filter activities before this date (ISO 8601)",
        },
      },
    },
  },
  {
    name: "update_activity",
    description: "Update an existing activity's information",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Activity ID (required)" },
        title: { type: "string", description: "Activity title" },
        body: {
          type: "string",
          description: "Activity description in markdown format",
        },
        type: {
          type: "string",
          description: "Activity type",
        },
        happenedAt: {
          type: "string",
          description: "When activity happened (ISO 8601)",
        },
      },
      required: ["id"],
    },
  },
];
```

**MCP Tool Best Practices:**
- Clear, descriptive names (`verb_noun` pattern)
- Detailed descriptions for Claude to understand
- Specify required vs optional fields
- Include format hints (ISO 8601, etc.)
- Provide examples in descriptions

#### 6. Create `index.ts`

Export public API:

```typescript
/**
 * Activity domain exports
 */

export * from "./types.js";
export * from "./queries.js";
export * from "./handlers.js";
export * from "./tools.js";
```

#### 7. Register in Main Server

Update `src/index.ts`:

```typescript
// Add import
import {
  ACTIVITY_TOOLS,
  createActivity,
  getActivity,
  listActivities,
  updateActivity,
  CreateActivityInput,
  UpdateActivityInput,
  ListActivitiesParams,
} from "./domains/activity/index.js";

// Add to tools list
this.server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      ...PERSON_TOOLS,
      ...COMPANY_TOOLS,
      ...OPPORTUNITY_TOOLS,
      ...TASK_TOOLS,
      ...NOTE_TOOLS,
      ...ACTIVITY_TOOLS,  // <-- Add here
    ],
  };
});

// Add to switch statement
switch (name) {
  // ... existing cases ...

  // Activity operations
  case "create_activity":
    return await createActivity(
      this.client,
      args as unknown as CreateActivityInput
    );
  case "get_activity":
    return await getActivity(
      this.client,
      (args as unknown as { id: string }).id
    );
  case "list_activities":
    return await listActivities(
      this.client,
      (args || {}) as unknown as ListActivitiesParams
    );
  case "update_activity":
    return await updateActivity(
      this.client,
      args as unknown as UpdateActivityInput
    );

  default:
    throw new Error(`Unknown tool: ${name}`);
}

// Add testing methods
async createActivity(data: CreateActivityInput) {
  return createActivity(this.client, data);
}

async getActivity(id: string) {
  return getActivity(this.client, id);
}

async listActivities(params: ListActivitiesParams = {}) {
  return listActivities(this.client, params);
}

async updateActivity(data: UpdateActivityInput) {
  return updateActivity(this.client, data);
}
```

#### 8. Add Tests

Update `src/index.test.ts`:

```typescript
describe('Activity Operations', () => {
  describe('createActivity', () => {
    it('should create an activity with required fields only', async () => {
      const mockResponse = {
        data: {
          createActivity: {
            id: 'activity-123',
            title: 'Phone call with client',
            bodyV2: null,
            type: 'call',
            happenedAt: '2025-01-15T10:00:00Z',
            linkedRecordId: null,
            linkedRecord: null,
            createdAt: '2025-01-15T10:05:00Z'
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await server.createActivity({
        title: 'Phone call with client',
        type: 'call',
        happenedAt: '2025-01-15T10:00:00Z'
      });

      expect(result.content[0].text).toContain('✅ Created activity');
    });
  });

  // Add tests for get, list, update...
});
```

#### 9. Update Documentation

Update `README.md`:

```markdown
### Activity Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_activity` | Create a new activity | `title` |
| `get_activity` | Get activity by ID | `id` |
| `list_activities` | List/search activities | - |
| `update_activity` | Update activity info | `id` |

**Optional Activity Fields:**
- `body` - Activity description in markdown
- `type` - Activity type ('call', 'email', 'meeting')
- `happenedAt` - When activity occurred (ISO 8601)
- `linkedRecordId` - Link to person/company/opportunity
```

#### 10. Build and Test

```bash
# Build TypeScript
npm run build

# Run unit tests
npm test

# Test with MCP (restart Claude Desktop)
# Try: "Create an activity called 'Team meeting' with type 'meeting'"
```

---

## 🏗️ Shared Utilities

### Base CRUD Handler

The `createCRUDHandlers` factory provides generic CRUD operations:

```typescript
const handlers = createCRUDHandlers<CreateInput, UpdateInput, DomainModel, GraphQLInput, ListParams>({
  entityName: "activity",           // GraphQL query name (singular)
  entityNameCapitalized: "Activity", // For mutations
  queries: {
    create: CREATE_MUTATION,
    get: GET_QUERY,
    list: LIST_QUERY,
    update: UPDATE_MUTATION,
  },
  transformCreateInput,              // Convert API → GraphQL
  transformUpdateInput,              // Convert partial updates
  buildListFilter,                   // Build filter object
  formatCreateSuccess: (entity) => `✅ Created: ${entity.name}`,
});
```

### Transformers

Located in `src/shared/transformers.ts`:

```typescript
// Convert email string to composite
transformEmail(email: string): EmailsComposite

// Convert phone to composite
transformPhone(phone: string, countryCode?: string, callingCode?: string): PhonesComposite

// Convert URL to link composite
transformLink(url: string, label?: string): LinkComposite

// Convert address fields to composite
transformAddress(address: AddressInput): AddressComposite

// Convert amount to currency (with micros)
transformCurrency(amount: number, currencyCode: string = "USD"): CurrencyComposite

// Convert markdown to BodyV2
transformBodyV2(text: string): BodyV2Composite
```

### Adding New Transformers

If you need a new composite type:

1. Add interface to `src/shared/types.ts`
2. Add transformer to `src/shared/transformers.ts`
3. Use in domain handlers

Example:

```typescript
// types.ts
export interface CustomComposite {
  field1: string;
  field2: number;
}

// transformers.ts
export function transformCustom(data: CustomInput): CustomComposite {
  return {
    field1: data.value1,
    field2: data.value2 * 1000, // Example transformation
  };
}
```

---

## 🧪 Testing Strategy

### Test Structure

```typescript
describe('Domain Operations', () => {
  describe('createEntity', () => {
    it('should create with required fields only', async () => {
      // Mock response
      // Call handler
      // Assert success
    });

    it('should create with all optional fields', async () => {
      // Test full object
    });

    it('should handle composite types correctly', async () => {
      // Test transformations
    });
  });

  describe('getEntity', () => {
    it('should retrieve entity by ID', async () => {
      // Test get operation
    });
  });

  describe('listEntities', () => {
    it('should list without filters', async () => {
      // Test basic list
    });

    it('should filter by field', async () => {
      // Test filtering
    });

    it('should search by term', async () => {
      // Test search
    });
  });

  describe('updateEntity', () => {
    it('should update single field', async () => {
      // Test partial update
    });

    it('should update multiple fields', async () => {
      // Test full update
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

---

## 📝 Code Style Guidelines

### TypeScript

- Use explicit types (no `any`)
- Prefer interfaces over types
- Use optional chaining (`?.`)
- Use nullish coalescing (`??`)

### Naming Conventions

- **Files:** kebab-case (`activity-handler.ts`)
- **Functions:** camelCase (`createActivity`)
- **Types:** PascalCase (`CreateActivityInput`)
- **Constants:** UPPER_SNAKE_CASE (`CREATE_ACTIVITY_MUTATION`)

### Comments

```typescript
/**
 * Clear, descriptive JSDoc comment
 *
 * @param data - What this parameter is
 * @returns What this function returns
 */
function example(data: Input): Output {
  // Inline comments for complex logic
  const result = transform(data);
  return result;
}
```

---

## 🚀 Performance Considerations

### GraphQL Query Optimization

- Request only needed fields
- Use fragments for repeated structures
- Batch related queries when possible

### Caching Strategy

Currently no caching implemented. Future consideration:
- In-memory cache for frequently accessed data
- TTL-based invalidation
- Cache warming for common queries

### Rate Limiting

Twenty CRM may have rate limits. Future consideration:
- Request queuing
- Retry with backoff
- Rate limit headers monitoring

---

## 🔍 Debugging

### Enable Debug Logging

```typescript
// In development
console.error('Debug:', { data, query, variables });
```

### Test GraphQL Queries

Use Twenty's GraphQL playground:
- https://your-instance.twenty.com/graphql

### Inspect MCP Traffic

Check Claude Desktop logs:
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows
type %APPDATA%\Claude\logs\mcp*.log
```

---

## 📚 Resources

- [Twenty CRM API Docs](https://twenty.com/developers)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## ❓ Common Issues

### Issue: GraphQL Field Not Found

**Symptom:** Error: "Field 'xyz' doesn't exist on type 'ABC'"

**Solution:**
1. Check Twenty's GraphQL schema documentation
2. Verify field name casing (camelCase vs snake_case)
3. Ensure you're using the correct object type

### Issue: Composite Type Mismatch

**Symptom:** Type error when assigning composite field

**Solution:**
1. Check the transformer returns correct structure
2. Verify GraphQL input type matches Twenty's schema
3. Add transformer to `shared/transformers.ts` if needed

### Issue: Tests Failing

**Symptom:** Mock data doesn't match handler expectations

**Solution:**
1. Ensure mock response structure matches GraphQL schema
2. Check that all required fields are present
3. Verify transformer logic in handlers

---

**Questions?** Open an issue or check existing discussions!

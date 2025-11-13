# Quick Start Guide - Adding New Features

**TL;DR:** Follow this checklist to add a new domain to the Twenty CRM MCP Server.

---

## ⚡ Quick Checklist

### Setup (5 minutes)
- [ ] Create domain folder: `src/domains/[name]/`
- [ ] Create 5 files: `types.ts`, `queries.ts`, `handlers.ts`, `tools.ts`, `index.ts`

### Implementation (2-4 hours)
- [ ] Define types in `types.ts` (inputs, GraphQL, domain model)
- [ ] Write GraphQL queries in `queries.ts` (create, get, list, update)
- [ ] Implement handlers in `handlers.ts` (use base CRUD handler)
- [ ] Define MCP tools in `tools.ts` (4 tools minimum)
- [ ] Export all in `index.ts`

### Integration (30 minutes)
- [ ] Import in `src/index.ts`
- [ ] Add tools to tools list
- [ ] Add cases to switch statement
- [ ] Add testing methods to class

### Testing (1-2 hours)
- [ ] Write unit tests in `src/index.test.ts`
- [ ] Run `npm test` - all tests must pass
- [ ] Test live with MCP (restart Claude Desktop)
- [ ] Verify in Twenty CRM UI

### Documentation (30 minutes)
- [ ] Update `README.md` with new tools
- [ ] Add usage examples
- [ ] Update API reference table
- [ ] Update feature list

### Release
- [ ] Build: `npm run build`
- [ ] Commit with clear message
- [ ] Update version number
- [ ] Create git tag
- [ ] Push to GitHub
- [ ] Create GitHub release

---

## 🎯 File Templates

### `types.ts` Template

```typescript
import { BodyV2Composite } from "../../shared/types.js";

export interface CreateXInput {
  // Required field
  name: string;
  // Optional fields
  description?: string;
}

export interface UpdateXInput {
  id: string;
  name?: string;
  description?: string;
}

export interface ListXParams {
  limit?: number;
  searchTerm?: string;
}

export interface XGraphQLInput {
  name: string;
  bodyV2?: BodyV2Composite;
}

export interface X {
  id: string;
  name: string;
  bodyV2?: BodyV2Composite;
  createdAt: string;
  updatedAt?: string;
}

export interface XEdge {
  node: X;
}

export interface XConnection {
  edges: XEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

### `queries.ts` Template

```typescript
export const CREATE_X_MUTATION = `
  mutation CreateX($input: XCreateInput!) {
    createX(data: $input) {
      id
      name
      createdAt
    }
  }
`;

export const GET_X_QUERY = `
  query GetX($id: UUID!) {
    x(filter: { id: { eq: $id } }) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const LIST_X_QUERY = `
  query ListX($filter: XFilterInput, $limit: Int) {
    xs(filter: $filter, first: $limit) {
      edges {
        node {
          id
          name
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const UPDATE_X_MUTATION = `
  mutation UpdateX($id: UUID!, $input: XUpdateInput!) {
    updateX(id: $id, data: $input) {
      id
      name
      updatedAt
    }
  }
`;
```

### `handlers.ts` Template

```typescript
import { createCRUDHandlers } from "../../shared/base-handler.js";
import { CREATE_X_MUTATION, GET_X_QUERY, LIST_X_QUERY, UPDATE_X_MUTATION } from "./queries.js";
import { CreateXInput, UpdateXInput, ListXParams, X, XGraphQLInput } from "./types.js";

function transformCreateInput(data: CreateXInput): XGraphQLInput {
  return {
    name: data.name,
    // Transform fields as needed
  };
}

function transformUpdateInput(data: UpdateXInput): Partial<XGraphQLInput> {
  const { id, ...updates } = data;
  const input: Partial<XGraphQLInput> = {};

  if (updates.name !== undefined) input.name = updates.name;

  return input;
}

function buildListFilter(params: ListXParams): Record<string, unknown> | null {
  const { searchTerm } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) filter.name = { ilike: `%${searchTerm}%` };

  return Object.keys(filter).length > 0 ? filter : null;
}

const handlers = createCRUDHandlers<CreateXInput, UpdateXInput, X, XGraphQLInput, ListXParams>({
  entityName: "x",
  entityNameCapitalized: "X",
  queries: {
    create: CREATE_X_MUTATION,
    get: GET_X_QUERY,
    list: LIST_X_QUERY,
    update: UPDATE_X_MUTATION,
  },
  transformCreateInput,
  transformUpdateInput,
  buildListFilter,
  formatCreateSuccess: (x) => `✅ Created: ${x.name}`,
});

export const createX = handlers.create;
export const getX = handlers.get;
export const listX = handlers.list;
export const updateX = handlers.update;
```

### `tools.ts` Template

```typescript
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const X_TOOLS: Tool[] = [
  {
    name: "create_x",
    description: "Create a new X in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name (required)" },
      },
      required: ["name"],
    },
  },
  {
    name: "get_x",
    description: "Get X details by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "X ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_x",
    description: "List X with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Number of results (max: 60)" },
        searchTerm: { type: "string", description: "Search by name" },
      },
    },
  },
  {
    name: "update_x",
    description: "Update X information",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "X ID (required)" },
        name: { type: "string", description: "Name" },
      },
      required: ["id"],
    },
  },
];
```

### `index.ts` Template

```typescript
export * from "./types.js";
export * from "./queries.js";
export * from "./handlers.js";
export * from "./tools.js";
```

---

## 🧪 Test Template

```typescript
describe('X Operations', () => {
  describe('createX', () => {
    it('should create X with required fields', async () => {
      const mockResponse = {
        data: {
          createX: {
            id: 'x-123',
            name: 'Test X',
            createdAt: '2025-01-01T00:00:00Z'
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await server.createX({
        name: 'Test X'
      });

      expect(result.content[0].text).toContain('✅ Created');
    });
  });

  describe('getX', () => {
    it('should retrieve X by ID', async () => {
      const mockResponse = {
        data: {
          x: {
            id: 'x-123',
            name: 'Test X',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z'
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await server.getX('x-123');

      expect(result.content[0].text).toContain('X details:');
    });
  });

  describe('listX', () => {
    it('should list X without filters', async () => {
      const mockResponse = {
        data: {
          xs: {
            edges: [
              {
                node: {
                  id: 'x-123',
                  name: 'Test X',
                  createdAt: '2025-01-01T00:00:00Z'
                }
              }
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false
            }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await server.listX({});

      expect(result.content[0].text).toContain('Found 1 xs');
    });
  });

  describe('updateX', () => {
    it('should update X', async () => {
      const mockResponse = {
        data: {
          updateX: {
            id: 'x-123',
            name: 'Updated X',
            updatedAt: '2025-01-02T00:00:00Z'
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await server.updateX({
        id: 'x-123',
        name: 'Updated X'
      });

      expect(result.content[0].text).toContain('Updated x');
    });
  });
});
```

---

## 💡 Pro Tips

### Finding GraphQL Field Names

1. Go to your Twenty instance GraphQL playground: `https://your-instance.twenty.com/graphql`
2. Use the schema explorer (Docs tab)
3. Look for your object type (e.g., `TimelineActivity`)
4. Copy exact field names (case-sensitive!)

### Testing Locally

```bash
# Terminal 1: Watch mode for TypeScript
npm run dev:watch

# Terminal 2: Run tests
npm run test:watch

# Terminal 3: Test with MCP
# Restart Claude Desktop after each code change
```

### Common Transformations

```typescript
// Currency (amount to micros)
amount: transformCurrency(data.amount, data.currency)

// Markdown body
bodyV2: transformBodyV2(data.body)

// Email
emails: transformEmail(data.email)

// Phone
phones: transformPhone(data.phone, data.phoneCountryCode, data.phoneCallingCode)

// Link/URL
linkedinLink: transformLink(data.linkedinUrl, "LinkedIn")

// Address
address: transformAddress({
  addressStreet1: data.addressStreet1,
  addressCity: data.addressCity,
  // ...
})
```

### Debugging GraphQL

```typescript
// Add temporary logging in handlers
console.error('GraphQL Query:', query);
console.error('Variables:', variables);
console.error('Response:', response);
```

### Validation Best Practices

```typescript
// In transformCreateInput
if (!data.name || data.name.trim() === '') {
  throw new Error('Name is required');
}

// Validate enum values
const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
if (data.status && !validStatuses.includes(data.status)) {
  throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
}

// Validate dates
if (data.dueAt && isNaN(Date.parse(data.dueAt))) {
  throw new Error('Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)');
}
```

---

## 🎨 Naming Conventions

### Tool Names
- Pattern: `verb_noun`
- Examples: `create_activity`, `list_tasks`, `update_note`
- Use singular for entity name
- Use lowercase with underscores

### File Names
- Use kebab-case: `activity-handler.ts`
- Match domain name: `src/domains/activity/`

### Function Names
- camelCase: `createActivity`, `listTasks`
- Exported handlers match tool names

### Type Names
- PascalCase: `Activity`, `CreateActivityInput`
- Suffix input types: `...Input`, `...Params`
- Suffix GraphQL types: `...GraphQLInput`

---

## 📋 Pre-commit Checklist

Before committing new features:

- [ ] All TypeScript compiles (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Live MCP test successful
- [ ] README updated
- [ ] No console.logs left in code
- [ ] Comments added for complex logic
- [ ] Error handling in place
- [ ] Input validation added

---

## 🚀 Release Checklist

Before releasing a new version:

- [ ] Version bumped in `package.json`
- [ ] Version bumped in `src/index.ts` (server version)
- [ ] CHANGELOG updated (if exists)
- [ ] README updated with new features
- [ ] All tests passing
- [ ] Build successful
- [ ] Git tag created (`v0.x.0`)
- [ ] GitHub release created with notes
- [ ] npm publish (optional)

---

## 📞 Getting Help

- **Architecture questions:** See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Roadmap details:** See [ROADMAP.md](./ROADMAP.md)
- **Bug reports:** [GitHub Issues](https://github.com/KonstiDoll/twenty-crm-mcp-server/issues)
- **Feature requests:** [GitHub Discussions](https://github.com/KonstiDoll/twenty-crm-mcp-server/discussions)

---

**Ready to build?** Pick a feature from the [ROADMAP.md](./ROADMAP.md) and get started! 🚀

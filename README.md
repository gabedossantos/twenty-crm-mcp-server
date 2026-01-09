<div align="center">

# 🤖 Twenty CRM MCP Server

**Connect [Twenty CRM](https://twenty.com) with Claude and AI Assistants via Model Context Protocol**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![Twenty CRM](https://img.shields.io/badge/Twenty_CRM-Compatible-blue)](https://twenty.com)
[![MCP](https://img.shields.io/badge/MCP-1.0-purple)](https://modelcontextprotocol.io/)

*Manage your CRM data using natural language through Claude, with full support for Twenty's composite fields and GraphQL API.*

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## ✨ Features

- 🚀 **GraphQL-Native** - Built on Twenty's GraphQL API for robust, type-safe operations
- 🔄 **Full CRUD Support** - Create, read, update, and list people, companies, opportunities, tasks, and notes
- 🏗️ **Composite Fields** - Proper handling of nested objects (name, emails, phones, addresses, links)
- 💰 **Currency Support** - Automatic conversion for deal amounts and Annual Recurring Revenue
- 🔍 **Smart Search** - Filter and search across all CRM objects
- 📊 **Sales Pipeline** - Track opportunities with stages, amounts, and close dates
- ✅ **Task Management** - Create, assign, and track tasks with statuses and due dates
- 📝 **Note Operations** - Add and manage notes with rich text support
- 🔗 **Relationship Linking** - Link tasks and notes to people, companies, and opportunities
- 📅 **Timeline Activities** - Track all interactions, events, and changes with full history
- ⭐ **Favorites Management** - Quick access to frequently used records
- ⚡ **Real-time Updates** - Changes sync immediately with your Twenty instance
- 🛡️ **Type-Safe** - Full TypeScript implementation with comprehensive type definitions
- 🧪 **Tested** - Comprehensive unit tests with 74+ test cases
- 📖 **Well-Documented** - Comprehensive guides and examples

## 🎯 What You Can Do

**Manage People:**
```
"Create a contact named Sarah Johnson, email sarah@techco.com, phone +1-555-0100"
"Find all people working at TechCo"
"Update John's job title to Senior Developer"
"List the first 10 contacts in the database"
```

**Manage Companies:**
```
"Add a company called Acme Corp with website acme.com, 50 employees, and ARR of $2M"
"Show me all companies in San Francisco"
"Update TechStartup's address to 123 Main St, Berlin, Germany"
"List all ideal customer profile companies"
```

**Manage Opportunities:**
```
"Create an opportunity called 'Enterprise Deal' for Acme Corp worth €50,000 closing on Dec 31st"
"Show me all opportunities in the MEETING stage"
"Update the Enterprise Deal to PROPOSAL stage with amount €75,000"
"List all opportunities for TechCo"
```

**Manage Tasks:**
```
"Create a task to follow up with Sarah next week with status TODO"
"Show me all IN_PROGRESS tasks"
"Update task to DONE status"
"List all tasks assigned to user-123"
```

**Manage Notes:**
```
"Create a note titled 'Meeting Summary' with the key discussion points"
"Show me the note with ID note-456"
"Update the meeting notes with additional information"
"List all notes about the Enterprise Deal"
```

**Link Tasks & Notes to Records:**
```
"Link task task-123 to person Sarah Johnson"
"Show all tasks linked to Acme Corp"
"Link this note to the Enterprise Deal opportunity"
"Remove the link between task and company"
```

**Track Timeline Activities:**
```
"Create a timeline activity for a call with TechCo"
"Log a meeting event for next Tuesday with Acme Corp"
"Show all timeline activities for Sarah Johnson"
"Update the timeline activity with meeting notes"
```

**Manage Favorites:**
```
"Add Acme Corp to my favorites"
"Show all my favorited companies"
"Add Sarah Johnson to favorites"
"Remove TechCo from favorites"
```

## 🚀 Installation

### Prerequisites

- **Node.js** 18 or higher
- **Twenty CRM** instance (self-hosted or cloud)
- **Claude Desktop** or compatible MCP client

### Option 1: Install via npm (Recommended)

The easiest way to use this server is via npx:

1. **Get your Twenty CRM API key:**
   - Log in to your Twenty CRM instance
   - Navigate to **Settings → API & Webhooks** (under Developers)
   - Click **Generate API Key**
   - Copy the key

2. **Configure Claude Desktop:**

   Edit your `claude_desktop_config.json`:

   **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "twenty-crm": {
         "command": "npx",
         "args": ["-y", "twenty-crm-mcp-server"],
         "env": {
           "TWENTY_API_KEY": "your_api_key_here",
           "TWENTY_BASE_URL": "https://api.twenty.com"
         }
       }
     }
   }
   ```

   **For self-hosted Twenty:**
   ```json
   "TWENTY_BASE_URL": "https://your-twenty-instance.com"
   ```

3. **Restart Claude Desktop**

### Option 2: Install from Source

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KonstiDoll/twenty-crm-mcp-server.git
   cd twenty-crm-mcp-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Get your Twenty CRM API key:**
   - Log in to your Twenty CRM instance
   - Navigate to **Settings → API & Webhooks** (under Developers)
   - Click **Generate API Key**
   - Copy the key

5. **Configure Claude Desktop:**

   Edit your `claude_desktop_config.json`:

   **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "twenty-crm": {
         "command": "node",
         "args": ["/absolute/path/to/twenty-crm-mcp-server/dist/index.js"],
         "env": {
           "TWENTY_API_KEY": "your_api_key_here",
           "TWENTY_BASE_URL": "https://api.twenty.com"
         }
       }
     }
   }
   ```

   **For self-hosted Twenty:**
   ```json
   "TWENTY_BASE_URL": "https://your-twenty-instance.com"
   ```

### Automatic Environment Loading (.env)

The server now loads environment variables from `.env.local` (preferred) and `.env` automatically on startup—no more manual `export` before launching Mist/Claude.

1. Create a `.env.local` file in the project root (same folder as `package.json`).
2. Add any sensitive or machine-specific values:

  ```bash
  TWENTY_API_KEY=sk_live_...
  TWENTY_BASE_URL=https://app.twenty.com
  ATTACHMENT_LOCAL_ROOT=/Volumes/4TB/Twenty/twenty/attachments/workspace-10cf6632-1bb4-439a-acdb-bd3011a1435e/attachment
  ```

3. Restart your MCP client (Mist/Claude). The loader will pull these values into `process.env` before the server registers its tools, so attachment previews and API calls work without re-exporting paths.

> `.env.local` stays git-ignored; use `.env` only for default values you’re comfortable sharing with collaborators.

6. **Restart Claude Desktop**

### HTTP/SSE Mode (Dify & HTTP Clients)

The server still defaults to stdio for Claude/Msty, but you can expose an HTTP SSE endpoint for platforms like Dify by setting `MCP_TRANSPORT=http`. Additional knobs:

- `MCP_HTTP_HOST` – interface to bind (default `127.0.0.1`; use `0.0.0.0` for Docker)
- `MCP_HTTP_PORT` – listening port (default `8088`)
- `MCP_HTTP_PATH` – SSE route (default `/sse`)

**Quick start:**

```bash
MCP_TRANSPORT=http MCP_HTTP_HOST=0.0.0.0 MCP_HTTP_PORT=8088 npm start
```

This boots an HTTP server with:

- `GET /sse` – establishes the SSE stream and emits the POST endpoint
- `POST /sse?sessionId=...` – receives JSON-RPC payloads from the client
- `GET /healthz` – simple health probe for Docker/compose

To wire up Dify:

1. In Dify UI, open **Tools → MCP → Add MCP Server**
2. Choose **SSE** and set the URL to `http://host.docker.internal:8088/sse`
3. Save, then enable the desired tools inside your Agent/Workflow

From inside the Dify container you can verify connectivity with:

```bash
curl -i http://host.docker.internal:8088/sse | head
```

If the curl succeeds, Dify will list all exposed tools automatically. When you omit `MCP_TRANSPORT=http`, the binary continues to launch in stdio mode for Claude Desktop with no configuration changes.

### 🐳 Docker Deployment (Recommended for Production)

For reliable, persistent operation without requiring a terminal session, use Docker:

**Quick Start:**
```bash
cd twenty-crm-mcp-server

# Configure your environment
cat > .env << 'EOF'
TWENTY_API_KEY=your-api-key-here
TWENTY_BASE_URL=http://host.docker.internal:3000
EOF

# Build and start
docker compose up -d --build

# Verify
curl http://localhost:8088/healthz
```

**Benefits:**
- ✅ Auto-restart on failure or system reboot
- ✅ Proper signal handling for graceful shutdowns
- ✅ Health checks for container orchestration
- ✅ Runs as non-root user for security
- ✅ Ready for Cloudflare Tunnel integration

**Cloudflare Tunnel:**

Add a public hostname in your tunnel configuration:
- **Subdomain**: `twenty-mcp.yourdomain.com`
- **Service**: `http://host.docker.internal:8088`

Then in Dify, use: `https://twenty-mcp.yourdomain.com/sse`

📖 See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) for complete setup guide.

## 💬 Usage

Once configured, interact with your CRM using natural language:

### Creating Records

**People:**
```
"Create a person named Max Mustermann with email max@example.com,
phone +49-123-456789, works at Acme Corp as Software Engineer in Berlin,
LinkedIn: linkedin.com/in/maxmustermann"
```

**Companies:**
```
"Create a company called TechStartup GmbH with:
- Website: techstartup.io
- Address: Hauptstraße 123, 10115 Berlin, Germany
- 25 employees
- ARR: €500,000
- Mark as ideal customer profile
- LinkedIn: linkedin.com/company/techstartup"
```

**Opportunities:**
```
"Create an opportunity named 'Q4 Enterprise Deal' for TechStartup:
- Amount: €100,000
- Stage: NEW
- Close date: 2025-12-31
- Point of contact: Max Mustermann"
```

### Querying Data

```
"Show me all people in the CRM"
"List companies with more than 100 employees"
"Find all contacts at Acme Corp"
"Search for people with 'smith' in their name"
"Show all opportunities in MEETING stage"
"List opportunities for TechStartup"
```

### Updating Records

```
"Update Sarah's job title to VP of Engineering"
"Change Acme Corp's employee count to 75"
"Update TechStartup's address city to Munich"
"Move the Enterprise Deal to PROPOSAL stage"
"Update Q4 Enterprise Deal amount to €150,000"
```

## 🛠️ API Reference

### Person Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_person` | Create a new contact | `firstName`, `lastName` |
| `get_person` | Get person by ID | `id` |
| `list_people` | List/search people | - |
| `update_person` | Update person info | `id` |

**Optional Person Fields:**
- `email` - Primary email address
- `phone`, `phoneCountryCode`, `phoneCallingCode` - Phone details
- `jobTitle` - Job title
- `city` - City
- `companyId` - Link to company
- `linkedinUrl`, `xUrl` - Social profiles

### Company Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_company` | Create a new company | `name` |
| `get_company` | Get company by ID | `id` |
| `list_companies` | List/search companies | - |
| `update_company` | Update company info | `id` |

**Optional Company Fields:**
- `domainUrl` - Company website
- `addressStreet1`, `addressStreet2`, `addressCity`, `addressPostcode`, `addressState`, `addressCountry` - Full address
- `employees` - Number of employees
- `annualRecurringRevenue`, `currency` - ARR (auto-converted to micros)
- `linkedinUrl`, `xUrl` - Social profiles
- `idealCustomerProfile` - Boolean flag

### Opportunity Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_opportunity` | Create a new opportunity | `name` |
| `get_opportunity` | Get opportunity by ID | `id` |
| `list_opportunities` | List/search opportunities | - |
| `update_opportunity` | Update opportunity info | `id` |

**Optional Opportunity Fields:**
- `amount`, `currency` - Deal amount (auto-converted to micros)
- `stage` - Opportunity stage (e.g., 'NEW', 'SCREENING', 'MEETING', 'PROPOSAL', 'CUSTOMER')
- `closeDate` - Expected close date (ISO 8601 format: YYYY-MM-DD)
- `companyId` - Link to company
- `pointOfContactId` - Link to person (point of contact)

**List Opportunities Filters:**
- `limit` - Number of results (max: 60, default: 20)
- `searchTerm` - Search by opportunity name
- `companyId` - Filter by company
- `stage` - Filter by stage

### Task Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_task` | Create a new task | `title` |
| `get_task` | Get task by ID | `id` |
| `list_tasks` | List/search tasks | - |
| `update_task` | Update task info | `id` |

**Optional Task Fields:**
- `body` - Task description/body in markdown format
- `status` - Task status: 'TODO', 'IN_PROGRESS', 'DONE' (default: 'TODO')
- `dueAt` - Due date (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ)
- `assigneeId` - ID of the workspace member to assign the task to

**List Tasks Filters:**
- `limit` - Number of results (max: 60, default: 20)
- `searchTerm` - Search by task title
- `status` - Filter by status ('TODO', 'IN_PROGRESS', 'DONE')
- `assigneeId` - Filter by assignee

### Note Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_note` | Create a new note | `title` |
| `get_note` | Get note by ID | `id` |
| `list_notes` | List/search notes | - |
| `update_note` | Update note info | `id` |

**Optional Note Fields:**
- `body` - Note body/content in markdown format

**List Notes Filters:**
- `limit` - Number of results (max: 60, default: 20)
- `searchTerm` - Search by note title

### TaskTarget Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_task_target` | Link a task to a person/company/opportunity | `taskId` |
| `list_task_targets` | List task-record links | - |
| `delete_task_target` | Remove task-record link | `id` |

**TaskTarget Fields:**
- `taskId` - Task ID to link (required)
- `personId` - Person ID to link the task to
- `companyId` - Company ID to link the task to
- `opportunityId` - Opportunity ID to link the task to

**Note:** At least one target (personId, companyId, or opportunityId) must be provided.

**List TaskTargets Filters:**
- `taskId` - Filter by task ID (show all entities linked to this task)
- `personId` - Filter by person ID (show all tasks linked to this person)
- `companyId` - Filter by company ID (show all tasks linked to this company)
- `opportunityId` - Filter by opportunity ID (show all tasks linked to this opportunity)
- `limit` - Number of results (max: 60, default: 20)

### NoteTarget Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_note_target` | Link a note to a person/company/opportunity | `noteId` |
| `list_note_targets` | List note-record links | - |
| `delete_note_target` | Remove note-record link | `id` |

**NoteTarget Fields:**
- `noteId` - Note ID to link (required)
- `personId` - Person ID to link the note to
- `companyId` - Company ID to link the note to
- `opportunityId` - Opportunity ID to link the note to

**Note:** At least one target (personId, companyId, or opportunityId) must be provided.

**List NoteTargets Filters:**
- `noteId` - Filter by note ID (show all entities linked to this note)
- `personId` - Filter by person ID (show all notes linked to this person)
- `companyId` - Filter by company ID (show all notes linked to this company)
- `opportunityId` - Filter by opportunity ID (show all notes linked to this opportunity)
- `limit` - Number of results (max: 60, default: 20)

### Timeline Activity Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_timeline_activity` | Create a timeline activity event | `name` |
| `get_timeline_activity` | Get timeline activity by ID | `id` |
| `list_timeline_activities` | List/search timeline activities | - |
| `update_timeline_activity` | Update timeline activity info | `id` |

**Timeline Activity Fields:**
- `name` - Activity name/title (required)
- `properties` - JSON object with activity details (e.g., {type: 'CALL', notes: 'Discussed pricing'})
- `happensAt` - When the activity occurred (ISO 8601 format)
- `workspaceMemberId` - ID of the workspace member associated with this activity
- `personId` - Person ID to associate with this activity
- `companyId` - Company ID to associate with this activity
- `opportunityId` - Opportunity ID to associate with this activity
- `noteId` - Note ID to associate with this activity
- `taskId` - Task ID to associate with this activity
- `linkedRecordId` - Linked record ID
- `linkedObjectMetadataId` - Linked object metadata ID
- `linkedRecordCachedName` - Cached name of the linked record

**List Timeline Activities Filters:**
- `limit` - Number of results (max: 60, default: 20)
- `searchTerm` - Search by activity name
- `personId` - Filter by person ID
- `companyId` - Filter by company ID
- `opportunityId` - Filter by opportunity ID
- `workspaceMemberId` - Filter by workspace member ID
- `noteId` - Filter by note ID
- `taskId` - Filter by task ID

### Favorite Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `add_favorite` | Add a record to favorites | - |
| `get_favorite` | Get favorite by ID | `id` |
| `list_favorites` | List all favorites | - |
| `remove_favorite` | Remove a record from favorites | `id` |

**Favorite Fields:**
- `personId` - Person ID to add to favorites
- `companyId` - Company ID to add to favorites
- `opportunityId` - Opportunity ID to add to favorites
- `position` - Position in favorites list (optional)

**Note:** At least one target (personId, companyId, or opportunityId) must be provided for `add_favorite`.

**List Favorites Filters:**
- `limit` - Number of results (max: 60, default: 20)
- `personId` - Filter by person ID
- `companyId` - Filter by company ID
- `opportunityId` - Filter by opportunity ID
- `workspaceMemberId` - Filter by workspace member ID

## 📋 Understanding Composite Fields

Twenty CRM uses **composite fields** for related data. This server handles them automatically:

### Name Composite
```javascript
name: {
  firstName: "John",
  lastName: "Doe"
}
```

### Emails Composite
```javascript
emails: {
  primaryEmail: "john@example.com",
  additionalEmails: ["john.doe@gmail.com"]
}
```

### Phones Composite
```javascript
phones: {
  primaryPhoneNumber: "5551234567",
  primaryPhoneCountryCode: "US",
  primaryPhoneCallingCode: "+1",
  additionalPhones: []
}
```

### Address Composite
```javascript
address: {
  addressStreet1: "123 Main St",
  addressStreet2: "Suite 100",
  addressCity: "San Francisco",
  addressPostcode: "94102",
  addressState: "CA",
  addressCountry: "United States"
}
```

### Link Composite (LinkedIn, X, Domain)
```javascript
linkedinLink: {
  primaryLinkUrl: "https://linkedin.com/in/user",
  secondaryLinks: []
}
```

### Currency Composite (ARR)
```javascript
annualRecurringRevenue: {
  amountMicros: 5000000000000,  // $5M stored as micros
  currencyCode: "USD"
}
```

**Note:** You provide simple values (e.g., `email: "john@example.com"`), and the server automatically structures them correctly for Twenty's API.

## 🏗️ Architecture

### Why GraphQL?

This server uses **GraphQL** instead of REST because:

1. **Better for nested objects** - Twenty uses many composite fields
2. **Type safety** - GraphQL schema validation catches errors early
3. **Flexible queries** - Request exactly the fields you need
4. **Clear error messages** - Easier debugging
5. **Future-proof** - Easy to extend with new fields

### Technical Stack

- **MCP SDK** - [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)
- **GraphQL** - Direct integration with Twenty's GraphQL API
- **Node.js** - ES Modules, async/await
- **TypeScript** - Full type safety and IDE support
- **Vitest** - Fast unit testing with 71%+ code coverage
- **Twenty CRM** - Open-source CRM platform

## 🧪 Development & Testing

### TypeScript Support

The server is written in **TypeScript** with comprehensive type definitions for:

- **All API operations** - Person and Company CRUD operations
- **GraphQL requests** - Full typing for queries and mutations
- **Composite fields** - Type-safe nested objects
- **MCP protocol** - Integration with the SDK's type system

**Benefits:**
- 🔒 Type-safe development with autocompletion
- 🐛 Catch errors at compile-time
- 📖 Self-documenting code with IntelliSense
- 🔄 Easy refactoring with confidence

### Building from Source

```bash
# Build the TypeScript code
npm run build

# Start the compiled server
npm start

# Development mode with auto-reload
npm run dev

# Type-check without building
npm run type-check
```

### Running Tests

The project includes **comprehensive unit tests** with 71%+ code coverage:

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Coverage:**
- ✅ GraphQL request handling
- ✅ All Person operations (create, get, list, update)
- ✅ All Company operations (create, get, list, update)
- ✅ All Opportunity operations (create, get, list, update)
- ✅ All Task operations (create, get, list, update)
- ✅ All Note operations (create, get, list, update)
- ✅ Error handling and validation
- ✅ Composite field transformations (name, emails, phones, address, bodyV2)
- ✅ Currency conversion (ARR and opportunity amounts to micros)

### Configuration Files

**TypeScript:**
- `tsconfig.json` - TypeScript compiler configuration
- `src/index.ts` - Main server implementation

**Testing:**
- `vitest.config.ts` - Test configuration
- `src/index.test.ts` - Comprehensive test suite

**Build Output:**
- `dist/` - Compiled JavaScript and type definitions
- `coverage/` - Test coverage reports

## 🐛 Troubleshooting

### Connection Issues

**Error: GraphQL request failed (404)**

- Check `TWENTY_BASE_URL` is correct
- Self-hosted: Use your full domain (e.g., `https://twenty.company.com`)
- Cloud: Use `https://api.twenty.com`
- GraphQL endpoint is automatically set to `${TWENTY_BASE_URL}/graphql`

**Error: GraphQL request failed (401) or (403)**

- Verify API key is correct
- Check API key has proper permissions in Twenty
- Generate a new API key in Settings → API & Webhooks

### Field Validation Errors

**Error: `Field 'xyz' expected type 'ABC'`**

The server handles field transformations automatically. If you see validation errors:

1. Check the field name matches the API Reference
2. Ensure correct data types (string, number, boolean)
3. Review the GraphQL error message for specifics
4. Check the Examples section for correct usage

### Records Not Appearing

**Symptoms:** No error but record doesn't appear in Twenty UI

**Debug Steps:**

1. Check the response - does it include an `id`?
2. Try fetching by ID: `"Get person with ID xyz"`
3. Refresh the Twenty CRM UI
4. Check Claude Desktop logs for hidden errors

## 🔄 Common Workflows

### Onboarding New Clients

```
1. "Create a company called NewCo with domain newco.com"
2. "Create a person named John Smith, email john@newco.com, works at NewCo as CTO"
3. "Update NewCo's details: 10 employees, ARR $250k, mark as ideal customer profile"
```

### Lead Management

```
1. "List all ideal customer profile companies"
2. "Find all contacts at [company name]"
3. "Update [person] with note about last call"
```

### Data Enrichment

```
1. "List people without LinkedIn profiles"
2. "Update [person] LinkedIn: linkedin.com/in/username"
3. "List companies missing employee count"
```

## 🤝 Contributing

We welcome contributions! Here's how to help:

### Reporting Issues

1. Check existing issues first
2. Provide clear reproduction steps
3. Include error messages
4. Share your Twenty version

### Submitting PRs

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test against a real Twenty instance
5. Commit with clear messages
6. Push and create a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/twenty-crm-mcp-server.git
cd twenty-crm-mcp-server

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API key

# Build the TypeScript code
npm run build

# Run tests
npm test

# Test changes in development mode
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Twenty CRM](https://twenty.com) - Outstanding open-source CRM platform
- [Anthropic](https://anthropic.com) - Model Context Protocol specification
- [MCP Community](https://github.com/modelcontextprotocol) - Inspiration and support

## 🔗 Links

- [Twenty CRM](https://twenty.com)
- [Twenty Documentation](https://twenty.com/developers)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
- [GitHub Issues](https://github.com/KonstiDoll/twenty-crm-mcp-server/issues)

---

## 🚀 Next Steps

Ready to extend this server? Here are some ideas:

### Completed Features

- [x] **Opportunity Tracking** - Sales pipeline management ✅ v0.2.0
- [x] **Task Management** - Create, assign, and track tasks ✅ v0.4.0
- [x] **Note Operations** - Add and manage notes ✅ v0.4.0

### Planned Features

- [ ] **Custom Fields** - Support for workspace-specific fields
- [ ] **Batch Operations** - Bulk create/update records
- [ ] **Webhooks** - Real-time notifications
- [ ] **Advanced Filters** - Complex query building
- [ ] **Export/Import** - CSV/JSON data operations
- [ ] **Analytics** - Query insights and metrics
- [ ] **Attachments** - File management

### Want to Contribute?

Pick a feature from the list above or suggest your own!
Open an issue to discuss, then submit a PR.

---

<div align="center">

**Made with ❤️ for the open-source community**

⭐ **Star this repo if you find it useful!**

[Report Bug](https://github.com/KonstiDoll/twenty-crm-mcp-server/issues) · [Request Feature](https://github.com/KonstiDoll/twenty-crm-mcp-server/issues) · [Discussions](https://github.com/KonstiDoll/twenty-crm-mcp-server/discussions)

</div>

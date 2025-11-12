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
- ⚡ **Real-time Updates** - Changes sync immediately with your Twenty instance
- 🛡️ **Type-Safe** - Full TypeScript implementation with comprehensive type definitions
- 🧪 **Tested** - Comprehensive unit tests with 50+ test cases
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

6. **Restart Claude Desktop**

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

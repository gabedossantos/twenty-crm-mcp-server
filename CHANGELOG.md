# Twenty CRM MCP Server - Version History & Changelog

This document tracks all versions, changes, and upgrade notes for the Twenty CRM MCP Server.

---

## Version 0.8.2 (December 25, 2025) - Complete Data Extraction

### 📦 Full Data Preservation
Completely redesigned structured output to preserve ALL LinkedIn data for downstream Dify nodes.

### Structured Output Variables

| Variable | Type | Description |
|----------|------|-------------|
| **Identity** | | |
| `personId` | string | Twenty CRM Person ID |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `fullName` | string | Combined full name |
| `email` | string | Email (empty string if null, never "null") |
| **Professional** | | |
| `jobTitle` | string | Headline/job title |
| `currentCompany` | string | Current company name |
| **Location** | | |
| `location` | string | Full location string |
| `country` | string | Country only |
| `city` | string | City only |
| **URLs** | | |
| `linkedinUrl` | string | LinkedIn profile URL |
| `profilePictureUrl` | string | Profile picture URL |
| `backgroundPictureUrl` | string | Background image URL |
| **Content (Full Rich Text)** | | |
| `about` | string | Full about/summary text |
| `experience` | string | **FULL markdown** with all experience entries, dates, descriptions |
| `education` | string | **FULL markdown** with all education entries, degrees, schools |
| `languages` | string | Languages with proficiency levels |
| `additionalInformation` | string | Projects + Certifications + Featured + Skills combined |
| **Metrics** | | |
| `followerCount` | number | LinkedIn follower count |
| `connectionCount` | number | LinkedIn connection count |
| `linkedinScore` | number | Profile completeness (0-100) |

### Key Improvements
- `experience` and `education` now contain **full formatted markdown** with all entries, not just counts
- Added `currentCompany` as a separate field
- Added `about` (full summary text)
- Added `location`, `country`, `city` as separate fields
- Added `profilePictureUrl` and `backgroundPictureUrl`
- `email` returns empty string when null (not the string "null")
- `additionalInformation` aggregates projects, certifications, featured content, and skills
- Added `formatProjectsMarkdown()` for projects formatting
- Languages now include proficiency levels

---

## Version 0.8.1 (December 25, 2025) - Field Name Fix & Structured Output

### 🔧 Bug Fix: GraphQL Field Names
- Fixed field names to match Twenty CRM's lowercase convention:
  - `followerCount` → `followercount`
  - `connectionCount` → `connectioncount`
  - `linkedinScore` → `linkedinscore`
- This resolves the "Cannot query field" GraphQL errors

### 📊 Structured Output for Dify Nodes
The `import_linkedin_profile` tool now returns **structured JSON data** for use in downstream Dify nodes:

| Variable | Type | Description |
|----------|------|-------------|
| `personId` | string | Twenty CRM Person ID |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `fullName` | string | Combined full name |
| `city` | string | Location |
| `jobTitle` | string | Headline/job title |
| `linkedinUrl` | string | LinkedIn profile URL |
| `intro` | string | About/summary (truncated) |
| `followerCount` | number | Follower count |
| `connectionCount` | number | Connection count |
| `linkedinScore` | number | Profile completeness (0-100) |
| `experienceCount` | number | Number of experience entries |
| `educationCount` | number | Number of education entries |
| `certificationCount` | number | Number of certifications |
| `featuredCount` | number | Number of featured posts |
| `skillCount` | number | Total skills count |
| `languages` | string | Languages spoken |

### Usage in Dify
The output appears as both:
1. **text**: Human-readable markdown summary
2. **Structured JSON block**: Parse with a Code Node for downstream variable access

---

## Version 0.8.0 (December 25, 2025) - LinkedIn Import & Enhanced Fields

### 🔗 LinkedIn Profile Import Tool
New `import_linkedin_profile` tool that accepts raw Apify LinkedIn scraper JSON and automatically:
- Extracts all profile data (name, headline, location, about)
- Formats **experience** as rich Markdown with company, duration, description
- Formats **education** as rich Markdown with school, degree, dates
- Combines **certifications**, **featured posts**, **skills**, **creator topics** into `additionalInformation`
- Calculates a **profile completeness score** (0-100)
- Updates the Person record in a single operation

### New Person Fields
| Field | Type | Description |
|-------|------|-------------|
| `followerCount` | number | LinkedIn follower count |
| `connectionCount` | number | LinkedIn connection count |
| `linkedinScore` | number | Profile completeness score (0-100) |

### Simplified Dify Workflow
The new architecture moves all transformation logic into the MCP server:
- **Before**: Webhook → HTTP Request → Complex Code Node → MCP tools
- **After**: Webhook → HTTP Request → `import_linkedin_profile` → Done

### Technical Details
- New file: `src/domains/person/linkedin-import.ts` - All parsing and formatting logic
- Updated GraphQL queries to include new numeric fields
- All fields support Markdown formatting for rich display in Twenty CRM

---

## Version 0.7.0 (December 25, 2025) - Docker & Production Ready

### 🐳 Docker Support
This release introduces Docker containerization for reliable, persistent operation without requiring a terminal session.

#### New Features
- **Dockerfile**: Multi-stage build for optimized production image (~150MB)
- **docker-compose.yml**: One-command deployment with health checks
- **.dockerignore**: Optimized build context (excludes dev files, node_modules)
- **Health endpoint**: `/healthz` for container orchestration and monitoring
- **Cloudflare Tunnel ready**: Can be integrated with existing tunnel configurations

#### Improvements
- Proper signal handling with `dumb-init` for graceful shutdowns
- Non-root user execution for enhanced security
- JSON logging with rotation (10MB max, 3 files)
- Auto-restart on failure (`unless-stopped` policy)
- Environment-based configuration (no secrets in image)

#### Breaking Changes
None - fully backward compatible with terminal-based usage.

---

## Version 0.6.0 (November 2024) - HTTP/SSE Transport

### Native HTTP/SSE Support
Added built-in HTTP/SSE transport mode for integration with web-based MCP clients like Dify.

#### Features Added
- `MCP_TRANSPORT=http` environment variable for HTTP mode
- `MCP_HTTP_HOST`, `MCP_HTTP_PORT`, `MCP_HTTP_PATH` configuration
- SSE (Server-Sent Events) endpoint at `/sse`
- Session management for SSE connections
- Health check endpoint at `/healthz`

#### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_TRANSPORT` | `stdio` | Transport mode: `stdio` or `http` |
| `MCP_HTTP_HOST` | `127.0.0.1` | HTTP server bind address |
| `MCP_HTTP_PORT` | `8088` | HTTP server port |
| `MCP_HTTP_PATH` | `/sse` | SSE endpoint path |

---

## Version 0.5.0 - Modular Architecture Refactor

### Domain-Driven Design
Complete refactoring to modular, domain-driven architecture.

#### Domains Added
- **person/**: Contact management (CRUD + search)
- **company/**: Company management with composite fields
- **opportunity/**: Sales pipeline with stages and amounts
- **task/**: Task management with statuses and due dates
- **note/**: Note operations with rich text
- **taskTarget/**: Link tasks to records
- **noteTarget/**: Link notes to records
- **activity/**: Timeline activities and events
- **favorite/**: Favorites management
- **attachment/**: File attachments

#### Shared Utilities
- `graphql-client.ts`: Centralized GraphQL client
- `transformers.ts`: Data transformation utilities
- `converters.ts`: Type converters for composite fields
- `base-handler.ts`: Base handler patterns
- `load-env.ts`: Environment configuration loader

---

## Version 0.4.0 - Composite Fields & Currency

### Enhanced Data Types
- Full support for Twenty's composite field types
- Automatic currency conversion for monetary values

#### Composite Fields Supported
- **Name**: `{ firstName, lastName }`
- **Email**: `{ primaryEmail, additionalEmails[] }`
- **Phone**: `{ primaryPhoneNumber, additionalPhones[] }`
- **Address**: `{ addressStreet1, addressStreet2, addressCity, addressState, addressPostcode, addressCountry }`
- **Links**: `{ primaryLinkUrl, primaryLinkLabel, secondaryLinks[] }`
- **Currency**: `{ amountMicros, currencyCode }`

---

## Version 0.3.0 - Task & Note Linking

### Relationship Management
- TaskTarget: Link tasks to people, companies, opportunities
- NoteTarget: Link notes to records
- Bi-directional relationship queries

---

## Version 0.2.0 - Timeline & Favorites

### Timeline Activities
- Create, read, update timeline events
- Activity types: calls, meetings, emails, events
- Full activity history per record

### Favorites
- Add/remove favorites
- List favorites by type
- Quick access to frequently used records

---

## Version 0.1.0 - Initial Release

### Core Features
- MCP server implementation with stdio transport
- GraphQL client for Twenty CRM API
- Basic CRUD for people, companies, opportunities
- Environment-based configuration

---

## Upgrade Guide

### From Terminal to Docker (0.6.x → 0.7.0)

1. **Stop the terminal-based server**:
   ```bash
   # Find and kill the existing process
   lsof -nP -iTCP:8088 -sTCP:LISTEN
   kill -9 <PID>
   ```

2. **Create `.env` file** (if not exists):
   ```bash
   cd /Volumes/2TB/Code/twenty-crm-mcp-server/twenty-crm-mcp-server
   cat > .env << 'EOF'
   TWENTY_API_KEY=your-api-key-here
   TWENTY_BASE_URL=http://host.docker.internal:3000
   EOF
   ```

3. **Build and start Docker container**:
   ```bash
   docker compose up -d --build
   ```

4. **Verify health**:
   ```bash
   curl http://localhost:8088/healthz
   # Expected: ok
   ```

5. **Update Dify configuration** (if using Dify):
   - Server URL remains: `http://host.docker.internal:8088/sse`
   - No changes needed if using Cloudflare tunnel

### Cloudflare Tunnel Integration

See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) for detailed tunnel setup instructions.

---

## Known Issues & Limitations

### Current Limitations
- Single SSE session per server instance (last connection wins)
- No built-in authentication (rely on network security or tunnel auth)
- Twenty API key must be provided via environment variable

### Resolved Issues
- ~~EADDRINUSE on restart~~ → Fixed with `unless-stopped` restart policy
- ~~Orphaned connections~~ → Fixed with proper signal handling
- ~~Memory leaks~~ → Fixed with graceful shutdown

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

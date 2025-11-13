# Post-Implementation Checklist

**Essential:** After implementing any new feature, you MUST update all related documentation. This ensures consistency across the project and helps both users and AI agents understand the new capabilities.

---

## 📋 Complete Checklist

After implementing a new domain or feature, work through this checklist **in order**:

### ✅ 1. README.md (Root)
**File:** `/README.md`

**Updates Required:**

#### A. Features Section
Update the features list (around line 22-33):

```markdown
- 🔄 **Full CRUD Support** - Create, read, update, and list people, companies, opportunities, tasks, notes, and [NEW_FEATURE]
```

Add feature-specific bullet if significant:
```markdown
- 🎯 **[New Feature Name]** - Brief description of what it does
```

#### B. "What You Can Do" Section
Add usage examples (around line 35-75):

```markdown
**Manage [Feature]:**
```
"Create a [object] with [details]"
"Show me all [objects] in [status]"
"Update [object] to [new state]"
"List [objects] for [filter criteria]"
```
```

#### C. API Reference Table
Add new section after existing domains (around line 289):

```markdown
### [Feature] Operations

| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_[feature]` | Create a new [feature] | `field1`, `field2` |
| `get_[feature]` | Get [feature] by ID | `id` |
| `list_[features]` | List/search [features] | - |
| `update_[feature]` | Update [feature] info | `id` |

**Optional [Feature] Fields:**
- `field1` - Description
- `field2` - Description
- `field3` - Description

**List [Features] Filters:**
- `limit` - Number of results (max: 60, default: 20)
- `searchTerm` - Search by [field]
- `status` - Filter by status (if applicable)
```

#### D. Test Coverage Section
Update test statistics (around line 455-464):

```markdown
**Test Coverage:**
- ✅ All [Feature] operations (create, get, list, update)
```

Update test count:
```markdown
- 🧪 **Tested** - Comprehensive unit tests with [NEW_COUNT]+ test cases
```

#### E. Completed Features Section
Move from "Planned Features" to "Completed Features" (around line 575-580):

```markdown
### Completed Features

- [x] **[Feature Name]** - Description ✅ v0.x.0
```

---

### ✅ 2. AI Agent Introduction Guide
**File:** `/docs/AI_AGENT_INTRODUCTION.md`

**Updates Required:**

#### A. Executive Summary
Update tool count (around line 7):

```markdown
You have **[NEW_COUNT] specialized tools** organized into [N] domains:
```

#### B. Your Capabilities Section
Add new domain (around line 130-157):

```markdown
### [N]. [Feature] Management ([X] tools)
- Create, read, update, and list [objects]
- Track [specific capabilities]
- [Key functionality]
```

#### C. Available Tools Reference
Add complete new section after existing domains (around line 647):

```markdown
### [Feature] Operations

#### `mcp__twenty-crm__create_[feature]`
**Purpose:** [What this tool does]

**Required Parameters:**
- `param1` (type): Description

**Optional Parameters:**
- `param2` (type): Description
- `param3` (type): Description

**When to Use:**
- [Use case 1]
- [Use case 2]
- [Use case 3]
- [Use case 4]

**Best Practices:**
- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

**Example:**
```javascript
{
  param1: "value",
  param2: "value",
  param3: "value"
}
```

---

#### `mcp__twenty-crm__get_[feature]`
**Purpose:** Retrieve [feature] details

**Required Parameters:**
- `id` (string): [Feature] unique identifier

**When to Use:**
- [Use case 1]
- [Use case 2]

---

#### `mcp__twenty-crm__list_[features]`
**Purpose:** Search and filter [features]

**Optional Parameters:**
- `limit` (number): Results to return (max 60, default 20)
- `searchTerm` (string): Search by [field]
- `filter1` (string): Filter by [criteria]

**When to Use:**
- "[Example query 1]"
- "[Example query 2]"
- "[Example query 3]"

---

#### `mcp__twenty-crm__update_[feature]`
**Purpose:** Update [feature] information

**Required Parameters:**
- `id` (string): [Feature] ID

**Optional Parameters:**
- All fields from `create_[feature]` (except ID)

**When to Use:**
- [Use case 1]
- [Use case 2]
- [Use case 3]
```

#### D. Data Structures Section
If new composite types were added, document them (around line 650-790):

```markdown
#### [New Composite] Type
**What you send:**
```javascript
{ field: "value" }
```

**What Twenty stores:**
```javascript
{
  composite: {
    field: "value",
    metadata: "additional"
  }
}
```
```

#### E. Common Workflows Section
Add workflow examples (around line 823-1018):

```markdown
### Workflow [N]: [Workflow Name]

**Scenario:** [Business scenario description]

**Your Approach:**
1. **[Step 1]:**
   ```
   User: "[Example request]"
   You: [Action to take]
   ```

2. **[Step 2]:**
   ```
   [Example interaction]
   ```

**Complete Flow:**
```
tool_1 (params)
→ tool_2 (params)
→ tool_3 (params)
```
```

#### F. Use Case Examples Section
Add complete conversation examples (around line 1252-1485):

```markdown
### Example [N]: [Use Case Title]

**Conversation:**
```
User: [User request]

You: [Your response]
[Tool calls]

[Detailed back-and-forth conversation]

You: [Final summary]
```

**Tools Used:**
1. `tool_name` (parameters used)
2. `tool_name` (parameters used)
3. `tool_name` (parameters used)
```

---

### ✅ 3. Package Version
**File:** `/package.json`

Update version number (line 3):

```json
{
  "version": "0.x.0",
}
```

---

### ✅ 4. Server Version
**File:** `/src/index.ts`

Update server version (around line 85):

```typescript
this.server = new Server(
  {
    name: "twenty-crm",
    version: "0.x.0",  // <-- Update this
  },
```

---

### ✅ 5. Development Roadmap
**File:** `/dev/ROADMAP.md`

#### A. Update Current State
Update the "Current State" table (around line 11):

```markdown
| **[Feature]** | X | ✅ Complete | v0.x.0 |

**Total:** [NEW_COUNT] tools
```

#### B. Move from Planned to Completed
Move feature from planned section to completed (around line 613-628):

```markdown
### Completed Features

- [x] **[Feature Name]** - Description ✅ v0.x.0
```

Remove from planned features.

#### C. Update Success Metrics
If this completes a version milestone, update metrics for that version.

---

### ✅ 6. Git Commit
Create a descriptive commit:

```bash
git add .
git commit -m "Add [Feature] Management - v0.x.0

Implement complete CRUD operations for [Feature]

## New Features

### [Feature] Management (X new tools)
- create_[feature]: [Description]
- get_[feature]: [Description]
- list_[features]: [Description]
- update_[feature]: [Description]

## Technical Changes

- Added [composite types] to shared/types.ts
- Added [transformers] to shared/transformers.ts
- Created modular [feature] domain (src/domains/[feature]/)
- Updated main server with X new MCP tools
- Added comprehensive test coverage ([N] new tests)
- Updated documentation (README, AI guide, roadmap)
- Bumped version to 0.x.0

## Test Results
✅ All [TOTAL] tests passing
✅ Live MCP integration verified
✅ [Features] working as expected"
```

---

### ✅ 7. Git Tag
Create version tag:

```bash
git tag -a v0.x.0 -m "Release v0.x.0 - [Feature] Management

Complete CRUD operations for [Feature]
- X new MCP tools
- [TOTAL] total tools across [N] domains
- Full test coverage
- Production ready and verified"
```

---

### ✅ 8. GitHub Release
Create GitHub release:

```bash
gh release create v0.x.0 --title "v0.x.0 - [Feature] Management" --notes "..."
```

Include comprehensive release notes (see QUICK_START.md for template).

---

## 🔍 Verification Checklist

Before considering documentation complete, verify:

- [ ] README.md mentions new feature in at least 3 places
- [ ] README.md has usage examples for new tools
- [ ] README.md API reference table is updated
- [ ] AI_AGENT_INTRODUCTION.md has complete tool documentation
- [ ] AI_AGENT_INTRODUCTION.md has workflow examples
- [ ] AI_AGENT_INTRODUCTION.md has conversation examples
- [ ] package.json version is bumped
- [ ] src/index.ts server version matches package.json
- [ ] ROADMAP.md reflects completed status
- [ ] Test count is accurate in all documents
- [ ] Tool count is accurate in all documents
- [ ] Git commit includes all documentation changes
- [ ] Git tag created with correct version

---

## 📝 Documentation Quality Standards

### README.md
- **Usage examples:** At least 3 per domain
- **API reference:** Complete parameter documentation
- **Clear descriptions:** Non-technical users can understand

### AI_AGENT_INTRODUCTION.md
- **Complete tool docs:** All parameters documented with examples
- **When to use:** Clear guidance for AI on tool selection
- **Workflows:** End-to-end scenarios showing tool orchestration
- **Conversation examples:** Realistic multi-turn interactions
- **Business context:** Why this feature matters to users

### Consistency
- Tool counts match across all docs
- Version numbers are consistent
- Feature descriptions are aligned
- Examples don't contradict each other

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This:

1. **Skip AI guide updates**
   - AI agents won't know about new features
   - Leads to user frustration

2. **Update only README**
   - Incomplete documentation
   - AI agents and users get different info

3. **Generic examples**
   - "Create a thing" is not helpful
   - Use realistic, business-focused examples

4. **Forget version bumps**
   - package.json and src/index.ts must match
   - Breaking changes require major version bump

5. **Miss composite types**
   - If you added new types, document them
   - Show both input format and storage format

6. **Incomplete test counts**
   - Update test counts in all places
   - Verify by running `npm test`

---

## ✅ Do This:

1. **Follow this checklist in order**
   - Start with README
   - Then AI guide
   - Then versions and roadmap
   - Then commit

2. **Use realistic examples**
   - Real business scenarios
   - Actual use cases
   - Complete conversations

3. **Test your documentation**
   - Read it as a new user
   - Verify examples work
   - Check for consistency

4. **Keep AI guide comprehensive**
   - This is crucial for MCP usage
   - AI needs detailed guidance
   - Show tool orchestration

---

## 🎯 Example: Full Documentation Update

Here's an example of updating docs for a hypothetical "Activity Timeline" feature:

### README.md Updates

```markdown
## ✨ Features
- 📊 **Activity Timeline** - Track all interactions and history

## 🎯 What You Can Do

**Manage Activities:**
```
"Show me all activities for Acme Corp in the last month"
"Log a phone call with Sarah"
"List customer interactions"
```

### Activity Operations
| Tool | Description | Required Fields |
|------|-------------|----------------|
| `create_activity` | Log an interaction | `title` |
| `get_activity` | Get activity by ID | `id` |
| `list_activities` | List/filter activities | - |
| `update_activity` | Update activity info | `id` |

### Completed Features
- [x] **Activity Timeline** - Complete interaction tracking ✅ v0.5.0
```

### AI_AGENT_INTRODUCTION.md Updates

```markdown
You have **24 specialized tools** organized into 6 domains:

### 6. Activity Timeline Management (4 tools)
- Create, read, update, and list activities
- Track customer interactions and history
- Link activities to accounts and contacts

### Activity Operations

#### `mcp__twenty-crm__create_activity`
**Purpose:** Log a customer interaction or event

**Required Parameters:**
- `title` (string): Activity title

**Optional Parameters:**
- `body` (string): Activity details (markdown)
- `type` (string): Activity type ("call", "email", "meeting")
- `happenedAt` (string): When activity occurred (ISO 8601)
- `linkedRecordId` (string): Link to person/company/opportunity

**When to Use:**
- After phone calls with customers
- Recording meeting summaries
- Logging email sent/received
- Tracking any customer interaction

**Example:**
```javascript
{
  title: "Discovery call with Sarah at Acme Corp",
  body: "Discussed their requirements for Q4. Next step: Send proposal.",
  type: "call",
  happenedAt: "2025-11-15T14:30:00Z",
  linkedRecordId: "company-uuid-123"
}
```
```

---

## 💡 Pro Tips

1. **Do docs first, then code**
   - Write documentation as you plan
   - Use docs to validate your design
   - Easier than retrofitting later

2. **User perspective**
   - Write for someone who's never used this feature
   - Include "why" not just "how"
   - Business value is important

3. **AI needs examples**
   - AI learns from examples
   - Show multi-tool workflows
   - Demonstrate tool orchestration

4. **Keep it updated**
   - Documentation ages fast
   - Update on every feature addition
   - Quarterly review for accuracy

5. **Test the examples**
   - Verify examples actually work
   - Use real MCP testing
   - Get user feedback

---

## 🔗 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Implementation details
- [QUICK_START.md](./QUICK_START.md) - Development workflow
- [ROADMAP.md](./ROADMAP.md) - Feature planning

---

**Remember:** Documentation is not optional. It's a critical part of feature delivery.

**Quality documentation = Better user experience = More adoption** 📚✨

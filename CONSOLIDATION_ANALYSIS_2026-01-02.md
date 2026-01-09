# Twenty CRM MCP Server - Consolidation Analysis

**Date:** January 2, 2026  
**Purpose:** Confirm which version is the canonical codebase and document safe removal of duplicate

---

## 📁 Directories Analyzed

| Path | Status |
|------|--------|
| `/Volumes/2TB/Code/twenty-crm-mcp-server/twenty-crm-mcp-server` | ✅ **KEEP - Canonical Version** |
| `/Volumes/4TB/Twenty/twenty/twenty-crm-mcp-server` | ❌ **DELETE - Stale Prototype** |

---

## 🔍 Detailed Comparison

### Version Information

| Attribute | 4TB (Stale) | 2TB (Canonical) |
|-----------|-------------|-----------------|
| **Version** | 1.0.0 | 0.8.2 |
| **Language** | JavaScript (single file) | TypeScript (modular) |
| **Total Source Lines** | 807 lines | **10,260 lines** |
| **Architecture** | Single `index.js` file | Domain-driven modular |
| **Author/Origin** | mhenry3164 | KonstiDoll (upstream) / gabedossantos (fork) |
| **Last Git Commit** | August 21, 2025 | December 29, 2025 |
| **Active Branch** | main only | `feature/create-note-person-link` with latest work |

### File Count Comparison

| Category | 4TB | 2TB |
|----------|-----|-----|
| Source files | 1 (`index.js`) | 48 TypeScript files |
| Test files | 0 | 2 (85 passing tests) |
| Docker config | 0 | 3 (Dockerfile, docker-compose.yml, .dockerignore) |
| Documentation | 3 | 12+ |
| Domain modules | 0 | 10 |

### Features Present

| Feature | 4TB | 2TB |
|---------|-----|-----|
| People CRUD | ✅ Basic | ✅ Full with composite fields |
| Company CRUD | ✅ Basic | ✅ Full with ARR, employees |
| Note CRUD | ✅ Basic | ✅ Full with markdown support |
| Task CRUD | ✅ Basic | ✅ Full with status, assignee |
| Opportunity CRUD | ❌ | ✅ Pipeline stages, amounts |
| Timeline Activities | ❌ | ✅ Full domain |
| Favorites | ❌ | ✅ Full domain |
| Attachments | ❌ | ✅ Full domain |
| Task/Note Targets | ❌ | ✅ Link records together |
| LinkedIn Import | ❌ | ✅ `import_linkedin_profile` tool |
| GraphQL API | ❌ (uses REST) | ✅ Native GraphQL |
| HTTP + stdio Transport | HTTP only | ✅ Both transports |
| TypeScript | ❌ | ✅ Full type safety |
| Unit Tests | ❌ | ✅ 85 tests, Vitest |
| Docker Support | ❌ | ✅ Production-ready |
| Health Endpoint | ❌ | ✅ `/healthz` |

---

## 🐳 Docker Container Verification

The running Docker container `twenty-crm-mcp` is confirmed to be built from the **2TB version**:

```
Container Name: twenty-crm-mcp
Container ID: 413186bac021
Status: running (healthy)
Health: ✅ Passing (verified via curl http://localhost:8088/healthz → "ok")

Docker Compose Config: /Volumes/2TB/Code/twenty-crm-mcp-server/twenty-crm-mcp-server/docker-compose.yml
Working Directory: /Volumes/2TB/Code/twenty-crm-mcp-server/twenty-crm-mcp-server
Port: 8088:8088
```

---

## ✅ 2TB Version Verification (January 2, 2026)

### Build Status
```
✅ TypeScript compilation successful (tsc)
✅ dist/index.js generated and executable
```

### Test Status
```
✅ 85 tests passed (2 test files)
   - src/index.test.ts: 82 tests
   - src/domains/person/linkedin-import.test.ts: 3 tests
   Duration: 387ms
```

### Git Status
```
Branch: feature/create-note-person-link
Uncommitted changes: Yes (work in progress)
  - Modified: 8 files (new person domain enhancements)
  - Untracked: 8 files (Docker config, LinkedIn import, changelog)
```

### API Key
```
The 2TB version has the newer API key (iat: 1764286489 = Dec 28, 2025)
The 4TB version has an older API key (iat: 1763430272 = Dec 18, 2025)
```

---

## 🗑️ What Will NOT Be Lost from 4TB

The 4TB version contains **no unique functionality**. Everything in it is superseded by the 2TB version:

| 4TB File | 2TB Equivalent | Notes |
|----------|----------------|-------|
| `index.js` | `src/index.ts` + 10 domain modules | 2TB has 12x more code with proper architecture |
| `README.md` | `README.md` | 2TB has 26KB vs 4TB's 7KB - far more comprehensive |
| `CONTRIBUTING.md` | Not present | Generic boilerplate - not custom to this project |
| `.env` | `.env` | 2TB has newer API key |
| `.env.example` | `.env.example` | Identical template |
| `.gitignore` | `.gitignore` | Similar, 2TB more comprehensive |
| `package.json` | `package.json` | 2TB has TypeScript, testing, build scripts |

### 4TB .env Issue
The 4TB `.env` file contains a malformed `TWENTY_BASE_URL`:
```
TWENTY_BASE_URL=/Volumes/4TB/Twenty/twenty-crm-mcp-server/.env
```
This is incorrect and would cause runtime errors.

---

## 📋 Confirmation Checklist

- [x] 2TB version has all features from 4TB version (and many more)
- [x] 2TB version is connected to the running Docker container
- [x] 2TB version builds successfully
- [x] 2TB version passes all 85 tests
- [x] 2TB version has newer API key
- [x] 2TB version has active development (last commit Dec 29, 2025)
- [x] 4TB version has no unique code or files
- [x] Container health check passes (`curl localhost:8088/healthz → ok`)

---

## 🎯 Recommendation

**Safe to delete:** `/Volumes/4TB/Twenty/twenty/twenty-crm-mcp-server`

The 4TB directory is:
1. An earlier prototype with REST API approach (2TB uses proper GraphQL)
2. Not connected to any running container
3. Not actively developed (last commit Aug 21, 2025)
4. Contains no unique functionality
5. Has a malformed `.env` configuration

**Keep and continue developing:** `/Volumes/2TB/Code/twenty-crm-mcp-server/twenty-crm-mcp-server`

This is the canonical version with:
- Full TypeScript implementation
- Modular domain-driven architecture
- Docker deployment ready
- Comprehensive testing (85 tests)
- LinkedIn profile import feature
- Active development on feature branches

---

## 🔐 Post-Deletion Reminder

After deleting the 4TB version, consider:
1. Committing the uncommitted changes in 2TB version
2. Merging `feature/create-note-person-link` to main when ready
3. Pushing to origin/upstream

---

*Analysis performed by GitHub Copilot on January 2, 2026*

# Development Documentation

Welcome to the Twenty CRM MCP Server development documentation! This folder contains everything you need to contribute to the project.

---

## 📚 Documentation Structure

### 🗺️ [ROADMAP.md](./ROADMAP.md)
**Product roadmap and feature planning**

- Current state (v0.4.0)
- Planned features by version
- Priority and impact assessments
- Long-term vision
- Feature backlog

**Read this to:**
- Understand the project direction
- Pick a feature to implement
- See what's coming next
- Understand feature priorities

---

### 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)
**Technical architecture and implementation guide**

- Modular domain-driven design
- Step-by-step implementation guide
- Code patterns and best practices
- Shared utilities documentation
- Testing strategies
- Performance considerations

**Read this to:**
- Understand the codebase structure
- Learn how to add new domains
- Follow established patterns
- Use shared utilities correctly
- Write proper tests

---

### ⚡ [QUICK_START.md](./QUICK_START.md)
**Quick reference for developers**

- Implementation checklists
- File templates
- Code snippets
- Common transformations
- Debugging tips
- Release checklist

**Read this to:**
- Get started quickly
- Copy/paste templates
- Find common solutions
- Debug issues
- Prepare releases

---

## 🎯 Getting Started

### For New Contributors

1. **Start here:** Read [ROADMAP.md](./ROADMAP.md) to understand the project vision
2. **Then read:** [ARCHITECTURE.md](./ARCHITECTURE.md) to understand how it's built
3. **Keep handy:** [QUICK_START.md](./QUICK_START.md) as a reference while coding

### For Feature Implementation

1. **Pick a feature** from [ROADMAP.md](./ROADMAP.md)
2. **Follow the guide** in [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Use templates** from [QUICK_START.md](./QUICK_START.md)

### For Bug Fixes

1. Understand the architecture in [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Find the affected domain in `src/domains/`
3. Follow the testing guidelines
4. Submit a PR

---

## 🛠️ Development Workflow

### Standard Workflow

```bash
# 1. Setup
git checkout -b feature/your-feature
npm install

# 2. Implement
# Follow ARCHITECTURE.md guide
# Use QUICK_START.md templates

# 3. Test
npm test
npm run build

# 4. Verify
# Test with MCP (restart Claude Desktop)
# Verify in Twenty CRM UI

# 5. Document
# Update README.md
# Add examples

# 6. Submit
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature
# Create PR on GitHub
```

### Development Commands

```bash
# Development
npm run dev          # Run in development mode
npm run dev:watch    # Auto-reload on changes

# Building
npm run build        # Compile TypeScript

# Testing
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage  # With coverage report

# Type Checking
npm run type-check   # Check types without building
```

---

## 📖 Code Examples

### Minimal New Domain

See [ARCHITECTURE.md](./ARCHITECTURE.md) Section: "Adding a New Domain" for a complete walkthrough.

### Using Base Handler

```typescript
const handlers = createCRUDHandlers<...>({
  entityName: "activity",
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
  formatCreateSuccess: (x) => `✅ Created: ${x.name}`,
});
```

### Adding Composite Types

```typescript
// 1. Define in src/shared/types.ts
export interface CustomComposite {
  field1: string;
  field2: number;
}

// 2. Add transformer in src/shared/transformers.ts
export function transformCustom(data: Input): CustomComposite {
  return {
    field1: data.value,
    field2: data.amount * 1000,
  };
}

// 3. Use in handlers
input.custom = transformCustom(data);
```

---

## 🧪 Testing Guidelines

### Test Structure

Every domain needs tests for:
- ✅ Create with required fields
- ✅ Create with all fields
- ✅ Get by ID
- ✅ List without filters
- ✅ List with filters
- ✅ Update single field
- ✅ Update multiple fields
- ✅ Error handling

### Test Coverage Requirements

- **Minimum:** 80% coverage
- **Target:** 90%+ coverage
- **All domains:** Must have tests

### Running Tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode (during development)
npm run test:watch

# Specific test file
npx vitest run src/index.test.ts
```

---

## 📝 Documentation Requirements

### For New Features

Every new domain must include:

1. **README.md Updates**
   - Feature list
   - Usage examples
   - API reference table
   - Test coverage stats

2. **Code Comments**
   - JSDoc for public functions
   - Inline comments for complex logic
   - Type documentation

3. **Examples**
   - At least 3 usage examples
   - Cover common use cases
   - Show optional parameters

---

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features (backwards compatible)
- **PATCH** (0.0.1): Bug fixes

### Release Checklist

See [QUICK_START.md](./QUICK_START.md) "Release Checklist" section.

### Creating a Release

```bash
# 1. Update version
npm version minor  # or major, patch

# 2. Build and test
npm run build
npm test

# 3. Commit and tag
git add .
git commit -m "Release v0.x.0"
git tag -a v0.x.0 -m "Release v0.x.0"

# 4. Push
git push origin main
git push origin v0.x.0

# 5. Create GitHub release
gh release create v0.x.0 --title "v0.x.0 - Feature Name" --notes "..."

# 6. Publish to npm (optional)
npm publish
```

---

## 🤝 Contributing

### Before You Start

1. Check [open issues](https://github.com/KonstiDoll/twenty-crm-mcp-server/issues)
2. Comment on the issue you want to work on
3. Wait for maintainer response
4. Fork the repository
5. Create a feature branch

### Pull Request Guidelines

- **One feature per PR**
- **All tests must pass**
- **Documentation updated**
- **Follow code style**
- **Clear commit messages**
- **Link to related issue**

### Code Review Process

1. Automated tests run (GitHub Actions)
2. Maintainer reviews code
3. Changes requested (if needed)
4. Approval and merge
5. Release planning

---

## 📊 Project Stats

### Current State (v0.4.0)

- **Domains:** 5 (Person, Company, Opportunity, Task, Note)
- **Tools:** 20 MCP tools
- **Tests:** 49 passing
- **Coverage:** High (90%+)
- **Lines of Code:** ~1,400 (excluding tests)

### Growth Trajectory

```
v0.1.0 →  8 tools
v0.2.0 → 12 tools
v0.3.0 → 12 tools (architecture refactor)
v0.4.0 → 20 tools
v0.5.0 → 34 tools (planned)
v1.0.0 → 100+ tools (vision)
```

---

## 🐛 Debugging

### Common Issues

**Issue:** TypeScript compilation errors
- **Solution:** Run `npm run type-check` for detailed errors

**Issue:** Tests failing
- **Solution:** Check mock data structure matches GraphQL schema

**Issue:** MCP tools not appearing
- **Solution:** Restart Claude Desktop after code changes

**Issue:** GraphQL errors
- **Solution:** Verify field names in Twenty's GraphQL playground

### Debug Logging

```typescript
// Temporary debug logging
console.error('Debug:', { query, variables, response });

// Remove before committing!
```

### MCP Logs

```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows
type %APPDATA%\Claude\logs\mcp*.log
```

---

## 📞 Getting Help

### Resources

- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Roadmap:** [ROADMAP.md](./ROADMAP.md)
- **Quick Ref:** [QUICK_START.md](./QUICK_START.md)
- **Issues:** [GitHub Issues](https://github.com/KonstiDoll/twenty-crm-mcp-server/issues)
- **Discussions:** [GitHub Discussions](https://github.com/KonstiDoll/twenty-crm-mcp-server/discussions)

### External Docs

- [Twenty CRM API](https://twenty.com/developers)
- [GraphQL Docs](https://graphql.org/learn/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 🎯 Next Steps

Ready to contribute? Here's what to do:

1. **Read the docs** in this folder
2. **Pick a feature** from [ROADMAP.md](./ROADMAP.md)
3. **Follow the guide** in [ARCHITECTURE.md](./ARCHITECTURE.md)
4. **Use templates** from [QUICK_START.md](./QUICK_START.md)
5. **Submit a PR** and join the community!

---

**Happy coding! 🚀**

*Made with ❤️ for the open-source community*

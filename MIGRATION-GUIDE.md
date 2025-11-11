# Migration Guide: JavaScript → TypeScript

## Quick Summary

**Old (twenty-mcp-clean.js):** ✅ Working but no type safety
**New (TypeScript):** ✅ Working with full type safety and testing

## What Changed?

### 1. Type Safety
- **Old:** Plain JavaScript, no compile-time checks
- **New:** Full TypeScript with comprehensive type definitions

### 2. Testing
- **Old:** No tests
- **New:** 22 unit tests with 71%+ code coverage

### 3. Build System
- **Old:** Direct JavaScript execution
- **New:** TypeScript compilation to `dist/` directory

### 4. Developer Experience
- **Old:** Basic IDE support
- **New:** Full IntelliSense, autocompletion, and type checking

## How to Migrate

### Step 1: Pull Latest Changes

```bash
git pull
npm install
```

### Step 2: Build the TypeScript Code

```bash
npm run build
```

This compiles `src/index.ts` → `dist/index.js`

### Step 3: Update Claude Desktop Config

**Old:**
```json
{
  "mcpServers": {
    "twenty-crm": {
      "command": "node",
      "args": ["/path/to/twenty-crm-mcp-server/twenty-mcp-clean.js"],
      "env": {
        "TWENTY_API_KEY": "your_key",
        "TWENTY_BASE_URL": "https://api.twenty.com"
      }
    }
  }
}
```

**New:**
```json
{
  "mcpServers": {
    "twenty-crm": {
      "command": "node",
      "args": ["/path/to/twenty-crm-mcp-server/dist/index.js"],
      "env": {
        "TWENTY_API_KEY": "your_key",
        "TWENTY_BASE_URL": "https://api.twenty.com"
      }
    }
  }
}
```

**Note:** Only the path changes to `dist/index.js`! Environment variables stay the same.

### Step 4: Restart Claude Desktop

### Step 5: Test Basic Operations

Try these commands in Claude:
```
"Create a test person named Test User with email test@example.com"
"List all people"
"Create a test company called Test Corp"
```

If these work, you're good to go!

## What's New in TypeScript Version?

### Type Definitions

All operations now have proper TypeScript types:

```typescript
interface CreatePersonInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  // ... all fields are typed
}
```

### Comprehensive Testing

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
- ✅ All Person CRUD operations
- ✅ All Company CRUD operations
- ✅ Error handling and validation
- ✅ Composite field transformations
- ✅ Currency conversion (ARR to micros)

### Development Scripts

```bash
# Build TypeScript
npm run build

# Run compiled code
npm start

# Development mode with auto-reload
npm run dev

# Type-check without building
npm run type-check
```

## Functionality Comparison

| Feature | JavaScript | TypeScript |
|---------|-----------|-----------|
| Create Person | ✅ Works | ✅ Works + Types |
| Create Company | ✅ Works | ✅ Works + Types |
| List People | ✅ Works | ✅ Works + Types |
| List Companies | ✅ Works | ✅ Works + Types |
| Update Person | ✅ Works | ✅ Works + Types |
| Update Company | ✅ Works | ✅ Works + Types |
| Get by ID | ✅ Works | ✅ Works + Types |
| Search/Filter | ✅ Full support | ✅ Full support + Types |
| Error Messages | ✅ Clear | ✅ Clear + Typed |
| Field Validation | ✅ Proper | ✅ Proper + Typed |
| **Type Safety** | ❌ None | ✅ Full |
| **Testing** | ❌ None | ✅ 71%+ coverage |
| **IDE Support** | ⚠️ Basic | ✅ Full IntelliSense |

## Project Structure

**Before:**
```
twenty-crm-mcp-server/
├── twenty-mcp-clean.js  (main file)
├── package.json
└── README.md
```

**After:**
```
twenty-crm-mcp-server/
├── src/
│   ├── index.ts         (TypeScript source)
│   └── index.test.ts    (comprehensive tests)
├── dist/                (compiled JavaScript)
│   ├── index.js
│   └── index.d.ts       (type definitions)
├── tsconfig.json        (TypeScript config)
├── vitest.config.ts     (test config)
├── package.json
└── README.md
```

## Common Issues After Migration

### "Cannot find module 'dist/index.js'"
**Solution:** Run `npm run build` to compile TypeScript first.

### Build fails with TypeScript errors
**Solution:**
1. Make sure you have the latest dependencies: `npm install`
2. Check Node.js version: `node --version` (should be ≥18)

### Tests fail
**Solution:**
1. Run `npm install` to ensure dev dependencies are installed
2. Check that vitest is installed: `npm list vitest`

### GraphQL endpoint not found
**Solution:** Check `TWENTY_BASE_URL` is correct:
- Self-hosted: `https://your-domain.com`
- Cloud: `https://api.twenty.com`

### Authentication failed
**Solution:** Regenerate your API key in Twenty Settings → API & Webhooks

## For Contributors

If you're contributing to the project:

1. **Edit TypeScript files** in `src/`, not JavaScript files
2. **Write tests** for new features in `src/index.test.ts`
3. **Run type-check** before committing: `npm run type-check`
4. **Run tests** before committing: `npm test`
5. **Build** to ensure it compiles: `npm run build`

### Development Workflow

```bash
# 1. Make changes to src/index.ts
# 2. Run in dev mode (with auto-reload)
npm run dev

# 3. Run tests
npm test

# 4. Type-check
npm run type-check

# 5. Build for production
npm run build
```

## Benefits of TypeScript Version

1. **Type Safety** - Catch errors at compile-time, not runtime
2. **Better IDE Support** - Full autocompletion and IntelliSense
3. **Self-Documenting** - Types serve as inline documentation
4. **Refactoring Confidence** - TypeScript catches breaking changes
5. **Testing** - Comprehensive test suite ensures reliability
6. **Maintainability** - Easier to understand and modify code

## Need Help?

1. Check the updated [README.md](README.md) for detailed usage
2. Review test files in `src/index.test.ts` for examples
3. Run `npm run type-check` to see type errors
4. Open an issue with:
   - What you tried
   - Error message
   - Expected vs actual behavior

---

**The TypeScript version is now the recommended and only supported version.**

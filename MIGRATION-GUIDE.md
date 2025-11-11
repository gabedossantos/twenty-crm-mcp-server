# Migration Guide: v1 → v2

## Quick Summary

**v1 (index.js):** ❌ Broken - Uses wrong field structures
**v2 (twenty-mcp-clean.js):** ✅ Working - Uses correct GraphQL API

## What Changed?

### 1. API Approach
- **v1:** REST API with incorrect field mapping
- **v2:** GraphQL API with correct nested structures

### 2. Person Creation
**v1 (Broken):**
```javascript
// This would FAIL
POST /rest/people
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**v2 (Working):**
```graphql
mutation {
  createPerson(data: {
    name: {
      firstName: "John"
      lastName: "Doe"
    }
    emails: {
      primaryEmail: "john@example.com"
    }
    phones: {
      primaryPhoneNumber: "1234567890"
      primaryPhoneCallingCode: "+1"
    }
  })
}
```

### 3. Company Creation
**v1 (Broken):**
```javascript
// This would FAIL
POST /rest/companies
{
  "name": "Acme Corp",
  "domainName": "acme.com",  // Wrong! Should be object
  "annualRecurringRevenue": 5000000  // Wrong! Should be micros + currency
}
```

**v2 (Working):**
```graphql
mutation {
  createCompany(data: {
    name: "Acme Corp"
    domainName: {
      primaryLinkUrl: "https://acme.com"
    }
    annualRecurringRevenue: {
      amountMicros: 5000000000000
      currencyCode: "USD"
    }
  })
}
```

## How to Migrate

### Step 1: Update Claude Desktop Config

**Old:**
```json
{
  "mcpServers": {
    "twenty-crm": {
      "command": "node",
      "args": ["/path/to/twenty-crm-mcp-server/index.js"],
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
      "args": ["/path/to/twenty-crm-mcp-server/twenty-mcp-clean.js"],
      "env": {
        "TWENTY_API_KEY": "your_key",
        "TWENTY_BASE_URL": "https://api.twenty.com"
      }
    }
  }
}
```

**Note:** Only the filename changes! Environment variables stay the same.

### Step 2: Restart Claude Desktop

### Step 3: Test Basic Operations

Try these commands in Claude:
```
"Create a test person named Test User with email test@example.com"
"List all people"
"Create a test company called Test Corp"
```

If these work, you're good to go!

## Functionality Comparison

| Feature | v1 | v2 |
|---------|----|----|
| Create Person | ❌ Broken | ✅ Works |
| Create Company | ❌ Broken | ✅ Works |
| List People | ⚠️ Works but pagination broken | ✅ Works correctly |
| List Companies | ⚠️ Works but pagination broken | ✅ Works correctly |
| Update Person | ❌ Broken | ✅ Works |
| Update Company | ❌ Broken | ✅ Works |
| Get by ID | ✅ Works | ✅ Works |
| Search/Filter | ⚠️ Limited | ✅ Full support |
| Error Messages | ❌ Cryptic | ✅ Clear |
| Field Validation | ❌ Missing | ✅ Proper validation |

## What if I Need the Old Server?

You can still run it:
```bash
npm run start:legacy
```

Or in Claude config:
```json
"args": ["/path/to/index.js"]
```

**But we don't recommend it** - it has fundamental API mismatches.

## Common Issues After Migration

### "GraphQL endpoint not found"
**Solution:** Check `TWENTY_BASE_URL` is correct:
- Self-hosted: `https://your-domain.com`
- Cloud: `https://api.twenty.com`

### "Authentication failed"
**Solution:** Regenerate your API key in Twenty Settings → API & Webhooks

### "Field validation error"
**Solution:** This is normal! v2 validates fields properly. Check the error message for what field needs correction.

## Need Help?

1. Check `README-NEW.md` for detailed usage
2. Test GraphQL queries in Twenty's API Playground (Settings → Playground)
3. Open an issue with:
   - What you tried
   - Error message
   - Expected vs actual behavior

## Rollback Plan

If you need to rollback:
1. Change Claude config back to `index.js`
2. Restart Claude Desktop
3. Report the issue so we can fix it!

---

**Remember:** The old server (v1) will likely be deprecated once v2 is tested and stable.

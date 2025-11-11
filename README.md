# Twenty CRM MCP Server v2.0 (Clean Implementation)

**A clean, GraphQL-based Model Context Protocol server for Twenty CRM**

This is a complete rewrite of the Twenty CRM MCP server with:
- ✅ **Correct API structure** based on actual Twenty CRM schema
- ✅ **GraphQL instead of REST** for easier handling of nested objects
- ✅ **Proper composite field support** (name, emails, phones, links)
- ✅ **Clean, maintainable code** with proper error handling

## 🔥 Key Improvements Over v1

### Fixed Issues:
1. **Person Creation** - Now uses correct nested structure:
   ```javascript
   // ❌ OLD (broken)
   { firstName: "John", lastName: "Doe", email: "john@example.com" }

   // ✅ NEW (correct)
   {
     name: { firstName: "John", lastName: "Doe" },
     emails: { primaryEmail: "john@example.com" }
   }
   ```

2. **Company Creation** - Properly handles links and currency:
   ```javascript
   // ❌ OLD (broken)
   { domainName: "example.com", annualRecurringRevenue: 5000000 }

   // ✅ NEW (correct)
   {
     domainName: { primaryLinkUrl: "https://example.com" },
     annualRecurringRevenue: { amountMicros: 5000000000000, currencyCode: "USD" }
   }
   ```

3. **GraphQL instead of REST** - Much easier to work with nested objects

## 🚀 Installation

### 1. Prerequisites
- Node.js 18 or higher
- A Twenty CRM instance (self-hosted or cloud)
- Twenty CRM API key

### 2. Get Your API Key

#### For Self-Hosted Twenty:
1. Log in to your Twenty CRM instance
2. Navigate to Settings → API & Webhooks (under Developers)
3. Generate a new API key

#### For Twenty Cloud:
Same steps on https://app.twenty.com

### 3. Configure Claude Desktop

Edit your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "twenty-crm": {
      "command": "node",
      "args": ["/path/to/twenty-crm-mcp-server/twenty-mcp-clean.js"],
      "env": {
        "TWENTY_API_KEY": "your_api_key_here",
        "TWENTY_BASE_URL": "https://your-twenty-instance.com"
      }
    }
  }
}
```

**Important URLs:**
- Self-hosted: Use your domain (e.g., `https://twenty.scenerii.com`)
- Cloud: Use `https://api.twenty.com`

### 4. Restart Claude Desktop

## 💬 Usage Examples

### Create a Person
```
"Create a new person named John Doe with email john@example.com and phone +1 555-0100"
```

The server will automatically structure it as:
```json
{
  "name": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "emails": {
    "primaryEmail": "john@example.com"
  },
  "phones": {
    "primaryPhoneNumber": "5550100",
    "primaryPhoneCallingCode": "+1",
    "primaryPhoneCountryCode": "US"
  }
}
```

### List People
```
"Show me all people in my CRM"
"Find all people working at Acme Corp"
"Search for people with 'smith' in their name"
```

### Create a Company
```
"Create a company called Acme Corp with website acme.com and 50 employees"
```

### Advanced Examples
```
"Create a person named Sarah Johnson, email sarah@techco.com, works at TechCo as Senior Developer, LinkedIn: linkedin.com/in/sarahj"

"Create a company TechStartup with domain techstartup.io, 25 employees, ARR of $2M, and mark it as ideal customer profile"
```

## 🛠️ Available Tools

### Person Operations
- **create_person** - Create a new person with all details
- **get_person** - Get person by ID
- **list_people** - List/search people with filters
- **update_person** - Update person information

### Company Operations
- **create_company** - Create a new company with all details
- **get_company** - Get company by ID
- **list_companies** - List/search companies
- **update_company** - Update company information

## 📋 Field Mapping Reference

### Person Fields
| Input Parameter | GraphQL Structure | Example |
|----------------|-------------------|---------|
| `firstName`, `lastName` | `name: { firstName, lastName }` | "John", "Doe" |
| `email` | `emails: { primaryEmail }` | "john@example.com" |
| `phone` | `phones: { primaryPhoneNumber }` | "5551234567" |
| `phoneCountryCode` | `phones: { primaryPhoneCountryCode }` | "US" |
| `phoneCallingCode` | `phones: { primaryPhoneCallingCode }` | "+1" |
| `linkedinUrl` | `linkedinLink: { primaryLinkUrl }` | "https://linkedin.com/in/user" |
| `xUrl` | `xLink: { primaryLinkUrl }` | "https://x.com/user" |
| `jobTitle` | `jobTitle` | "Software Engineer" |
| `city` | `city` | "San Francisco" |
| `companyId` | `companyId` | UUID |

### Company Fields
| Input Parameter | GraphQL Structure | Example |
|----------------|-------------------|---------|
| `name` | `name` | "Acme Corp" |
| `domainUrl` | `domainName: { primaryLinkUrl }` | "https://acme.com" |
| `linkedinUrl` | `linkedinLink: { primaryLinkUrl }` | "https://linkedin.com/company/acme" |
| `xUrl` | `xLink: { primaryLinkUrl }` | "https://x.com/acmecorp" |
| `annualRecurringRevenue` | `annualRecurringRevenue: { amountMicros, currencyCode }` | 5000000 → stored as micros |
| `currency` | Part of ARR object | "USD", "EUR" |
| `employees` | `employees` | 50 |
| `address` | `address` | "123 Main St" |
| `idealCustomerProfile` | `idealCustomerProfile` | true/false |

## 🔍 Technical Details

### Why GraphQL?
Twenty CRM uses **composite fields** (nested objects) extensively. GraphQL makes it much easier to work with these compared to REST:

**REST Challenges:**
- Complex nested objects in request body
- Harder to validate
- More prone to schema mismatches

**GraphQL Benefits:**
- Clear type system
- Better error messages
- Easier to handle nested structures
- Auto-completion in API playground

### Composite Fields Explained

Twenty CRM uses composite fields for related data:

**Name Composite:**
```javascript
name: {
  firstName: "John",
  lastName: "Doe"
}
```

**Emails Composite:**
```javascript
emails: {
  primaryEmail: "john@example.com",
  additionalEmails: ["john.doe@gmail.com"]
}
```

**Phones Composite:**
```javascript
phones: {
  primaryPhoneNumber: "5551234567",
  primaryPhoneCountryCode: "US",
  primaryPhoneCallingCode: "+1",
  additionalPhones: []
}
```

**Link Composite (LinkedIn, X, Domain):**
```javascript
linkedinLink: {
  primaryLinkLabel: "",
  primaryLinkUrl: "https://linkedin.com/in/user",
  additionalLinks: []
}
```

**Currency Composite (ARR):**
```javascript
annualRecurringRevenue: {
  amountMicros: 5000000000000,  // $5M in micros
  currencyCode: "USD"
}
```

## 🐛 Troubleshooting

### GraphQL Endpoint Not Found
**Error:** `GraphQL request failed (404)`

**Solution:** Check your `TWENTY_BASE_URL`:
- Self-hosted: Should be your full domain (e.g., `https://twenty.scenerii.com`)
- Cloud: Should be `https://api.twenty.com`
- GraphQL endpoint is automatically set to `${TWENTY_BASE_URL}/graphql`

### Authentication Error
**Error:** `GraphQL request failed (401)` or `(403)`

**Solutions:**
1. Verify your API key is correct
2. Check that the API key has proper permissions
3. Generate a new API key in Settings → API & Webhooks

### Field Validation Errors
**Error:** `GraphQL errors: Field 'xyz' expected type 'ABC'`

**Solution:** The server handles most field transformations automatically. If you see this:
1. Check the Field Mapping Reference above
2. Ensure you're providing the correct data types
3. Review the GraphQL error message for specifics

### Person/Company Not Creating
**Symptoms:** No error but record doesn't appear

**Debug Steps:**
1. Check the response - does it include an `id`?
2. Try getting the record by ID: `get_person` or `get_company`
3. Check Twenty CRM UI to see if it appears there
4. Look at the full error message in Claude Desktop logs

## 🔄 Migration from Old Server

If you were using the old `index.js`:

1. **Update your config** to point to `twenty-mcp-clean.js`
2. **Keep the same env vars** (`TWENTY_API_KEY`, `TWENTY_BASE_URL`)
3. **No data migration needed** - this just changes how you interact with the API
4. **Test basic operations** before fully switching over

## 🤝 Contributing

Found a bug? Have a suggestion?

1. Test the GraphQL query directly in Twenty's API Playground (Settings → Playground)
2. Document the issue with:
   - Expected behavior
   - Actual behavior
   - GraphQL query/mutation that failed
   - Error message
3. Open an issue or submit a PR

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

- [Twenty CRM](https://twenty.com) - The excellent open-source CRM
- [Anthropic](https://anthropic.com) - Model Context Protocol
- Built based on actual Twenty CRM API schema analysis

---

**Version:** 2.0.0
**Last Updated:** 2025-01-11
**Status:** ✅ Production Ready (tested against real Twenty instance)

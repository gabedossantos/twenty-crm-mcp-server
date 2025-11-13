# Future Enhancements

This document tracks ideas and improvements for future versions of the Twenty CRM MCP Server.

---

## UX Enhancement: Convenience Parameters for Task/Note Relationships

**Status:** Documented for future consideration
**Priority:** Low (current explicit approach works well)
**Version Target:** v0.6.0 or later

### Current Implementation ✅

Tasks and notes use explicit relationship linking via junction tables (correct approach):

```javascript
// Step 1: Create task
create_task({ title: "Follow up on pricing" })
// Returns: { id: "task-123", ... }

// Step 2: Link to entities
create_task_target({
  taskId: "task-123",
  companyId: "acme-corp",
  personId: "sarah-123"
})
```

**Why this is correct:**
- Matches Twenty CRM's actual API structure
- Tasks/Notes don't have direct personId/companyId/opportunityId fields
- Relationships are stored in separate `taskTargets`/`noteTargets` junction tables
- Supports many-to-many relationships (one task → multiple entities)
- Explicit and clear about what's happening

### Future Convenience Enhancement 💡

**Idea:** Add optional convenience parameters to create_task/create_note that auto-create relationships:

```javascript
// Proposed: Single operation from user perspective
create_task({
  title: "Follow up on pricing",
  // Convenience parameters (optional):
  companyId: "acme-corp",
  personId: "sarah-123"
})

// Behind the scenes:
// 1. Creates task
// 2. Automatically creates taskTarget(s) if relationship params provided
// 3. Returns task with relationships confirmed
```

**Benefits:**
- Simpler UX for common case (task related to one entity)
- Still uses proper junction tables under the hood
- Maintains flexibility - users can still use explicit tools for complex scenarios
- Reduces from 2 operations to 1 for most workflows

**Implementation Notes:**

```typescript
interface CreateTaskInput {
  title: string;
  body?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  dueAt?: string;
  assigneeId?: string;

  // New optional convenience parameters:
  personId?: string;
  companyId?: string;
  opportunityId?: string;
}

async function createTask(client, data) {
  // 1. Create the task
  const task = await createTaskMutation(client, data);

  // 2. Auto-create relationships if provided
  const relationships = [];
  if (data.personId) relationships.push({ taskId: task.id, personId: data.personId });
  if (data.companyId) relationships.push({ taskId: task.id, companyId: data.companyId });
  if (data.opportunityId) relationships.push({ taskId: task.id, opportunityId: data.opportunityId });

  if (relationships.length > 0) {
    await Promise.all(
      relationships.map(rel => createTaskTarget(client, rel))
    );
  }

  return task;
}
```

**Testing Requirements:**
- Test with no relationships (should work as before)
- Test with one relationship
- Test with multiple relationships
- Test error handling if relationship creation fails
- Update all existing tests to ensure backwards compatibility

**Documentation Updates Needed:**
- README: Show both approaches (convenience vs explicit)
- AI guide: Explain when to use each approach
- Examples: Add common scenarios

### Decision Rationale

**Why not implement now:**
1. Current explicit approach is architecturally correct
2. AI agents can understand the two-step process
3. No user complaints or confusion reported
4. Allows time to validate the pattern with real usage
5. Can gather feedback on preferred workflow

**When to implement:**
- After v0.5.0 usage data is collected
- If users frequently request this pattern
- If we see AI agents struggling with the two-step flow
- As part of a broader UX improvement release

### Alternative Approaches Considered

**A. Batch creation tool:**
```javascript
create_task_with_relationships({
  task: { title: "Follow up" },
  relationships: [
    { companyId: "acme" },
    { personId: "sarah" }
  ]
})
```
*Verdict:* More complex API, less intuitive

**B. Smart defaults:**
```javascript
// If only one ID provided, auto-link
create_task({
  title: "Call Sarah",
  personId: "sarah-123"  // Auto-creates taskTarget
})
```
*Verdict:* "Magic" behavior might be confusing

**C. Transaction-style:**
```javascript
begin_task()
  .create({ title: "Follow up" })
  .linkTo({ companyId: "acme" })
  .linkTo({ personId: "sarah" })
  .commit()
```
*Verdict:* Not possible with MCP tool model

### Related Issues

- Consider same pattern for Activities (currently support direct relationships)
- Evaluate if other junction table relationships need this treatment
- Review consistency across all relationship types

---

## Other Future Enhancements

(Add other enhancement ideas here as they come up)

# Bug Fix Prompt — v1

You are fixing a bug in the affexaiFactory monorepo.

## Process

1. **Reproduce**: Write a failing test that reproduces the bug
2. **Identify root cause**: Trace the error from the surface to the source
3. **Fix**: Make the minimal change that fixes the bug
4. **Verify**: Run the failing test — it should now pass
5. **Check side effects**: Run `pnpm build && pnpm test` to ensure no regressions
6. **Document**: Add a changeset with `pnpm changeset` describing the fix

## Rules

- Do NOT refactor unrelated code while fixing a bug
- Do NOT add new dependencies for a bug fix unless absolutely necessary
- Always write a test for the bug FIRST (TDD approach)
- Check if the same bug exists in other packages (copy-paste patterns)

## Output

After fixing, provide:
1. Root cause summary (1-2 sentences)
2. Files changed
3. Test that verifies the fix
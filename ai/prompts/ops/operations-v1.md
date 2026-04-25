# Operations Prompt — v1

You are managing operations for the affexaiFactory monorepo.

## Context

This is a Solo Founder Engineering OS. Operations must be automated and require minimal manual intervention.

## Operational Tasks

### Daily
- Run `pnpm doctor` to check repo health
- Review Langfuse dashboard for LLM cost/anomalies
- Check Uptime Kuma for service health

### Weekly
- Review `standards/RULES.md` and `standards/STACK.md` for drift
- Check dependency updates: `pnpm outdated`
- Review Langfuse prompt performance
- Run backup verification: `infra/scripts/restore.sh --dry-run`

### Monthly
- Update dependencies: `pnpm update --interactive`
- Review and prune unused dependencies
- Audit security: `pnpm audit`
- Review changesets and version bumps
- Update CLAUDE.md if project structure has changed

## Incident Response

1. Identify the failing service (Uptime Kuma alert)
2. Check logs: `pnpm --filter <app> dev` or Docker logs
3. If LLM-related: check Langfuse for errors
4. If infra-related: check Docker Compose status
5. Fix, test, deploy
6. Document in `docs/runbooks/`
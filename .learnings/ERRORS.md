# Errors

Command failures and integration errors.

---

## [ERR-20260714-002] npm-install-cache-permission

**Logged**: 2026-07-14T17:36:11+08:00
**Priority**: medium
**Status**: resolved
**Area**: config

### Summary

Dependency installation could not write to the user-level npm cache.

### Error

```text
EACCES: permission denied, mkdir '~/.npm/_cacache/content-v2/...'
```

### Context

- Command: `npm install`
- Registry: configured npm mirror
- The failure occurred in the existing user-level cache, outside this repository.

### Suggested Fix

Use a repository-local npm cache instead of modifying or deleting the user's global cache.

### Metadata

- Reproducible: yes
- Related Files: `.gitignore`

### Resolution

- **Resolved**: 2026-07-14T17:37:00+08:00
- **Notes**: Install with `npm install --cache .npm-cache`; ignore `.npm-cache/` in Git.

---

## [ERR-20260714-001] npm-workspaces-typecheck

**Logged**: 2026-07-14T17:30:05+08:00
**Priority**: low
**Status**: resolved
**Area**: config

### Summary

The root workspace typecheck command fails before the first workspace package exists.

### Error

```text
npm error No workspaces found!
```

### Context

- Command: `npm run typecheck`
- Environment: npm 10.8.2 with `workspaces: ["packages/*"]`
- The `packages` directory had no package manifests yet.

### Suggested Fix

Use the root TypeScript compiler check during initial scaffolding, then use the workspace command after creating the first package.

### Metadata

- Reproducible: yes
- Related Files: `package.json`, `tsconfig.base.json`

### Resolution

- **Resolved**: 2026-07-14T17:31:00+08:00
- **Notes**: Initial verification uses `npx tsc -p tsconfig.base.json --noEmit`; later tasks create real workspaces.

---

# Errors

Command failures and integration errors.

---

## [ERR-20260714-005] resolver-test-options-type

**Logged**: 2026-07-14T18:40:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tests

### Summary

A shared React Hook Form resolver-options fixture erased schema-specific field names.

### Error

```text
ResolverOptions<Record<string, unknown>> is not assignable to schema-specific ResolverOptions
```

### Context

- Runtime resolver tests passed.
- Strict type checking correctly rejected a broad `Record<string, unknown>` fixture.

### Suggested Fix

Make the fixture factory generic and instantiate it with `z.input<typeof schema>`.

### Metadata

- Reproducible: yes
- Related Files: `packages/zod-react-hook-form/test/resolver.test.ts`

### Resolution

- **Resolved**: 2026-07-14T18:41:00+08:00
- **Notes**: Added a generic `resolverOptions<TFieldValues>()` helper.

---

## [ERR-20260714-004] eslint-unused-rest-fields

**Logged**: 2026-07-14T17:43:00+08:00
**Priority**: low
**Status**: resolved
**Area**: backend

### Summary

ESLint rejected destructured Zod issue metadata fields used only to build a rest object.

### Error

```text
@typescript-eslint/no-unused-vars
```

### Context

- The implementation removed `code`, `message`, and `path` through destructuring.
- The configured lint rules do not ignore underscore-prefixed bindings.

### Suggested Fix

Build the parameter object by explicitly filtering metadata keys.

### Metadata

- Reproducible: yes
- Related Files: `packages/zod-core/src/errors.ts`

### Resolution

- **Resolved**: 2026-07-14T17:44:00+08:00
- **Notes**: Replaced unused destructuring bindings with `Object.entries` filtering.

---

## [ERR-20260714-003] vitest-workspace-root

**Logged**: 2026-07-14T17:41:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tests

### Summary

Vitest did not discover root-configured tests when launched from an npm workspace directory.

### Error

```text
No test files found
```

### Context

- Command: `npm test -w @gancao/zod-core`
- npm runs the package script with the workspace directory as the current directory.

### Suggested Fix

Set Vitest's root explicitly to the monorepo root and pass the package test path.

### Metadata

- Reproducible: yes
- Related Files: `packages/zod-core/package.json`, `vitest.config.ts`

### Resolution

- **Resolved**: 2026-07-14T17:42:00+08:00
- **Notes**: The package test script now uses `vitest run --root ../.. packages/zod-core/test`.

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

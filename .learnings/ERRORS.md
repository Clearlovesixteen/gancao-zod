# Errors

Command failures and integration errors.

---

## [ERR-20260714-010] npm-audit-fix-esbuild

**Logged**: 2026-07-14T18:57:00+08:00
**Priority**: medium
**Status**: resolved
**Area**: infra

### Summary

`npm audit fix` could not upgrade a vulnerable development-only esbuild version because upstream tool ranges remained on 0.27.x.

### Error

```text
esbuild 0.27.3 - 0.28.0: low severity; fix available
```

### Context

- `tsup@8.5.1` declares `esbuild: ^0.27.0`.
- The first fixed release reported by npm is `0.28.1`.
- Production dependency audit already reported zero vulnerabilities.

### Suggested Fix

Use a root override for the fixed esbuild release and verify all development workflows.

### Metadata

- Reproducible: yes
- Related Files: `package.json`, `package-lock.json`

### Resolution

- **Resolved**: 2026-07-14T18:58:00+08:00
- **Notes**: Added `overrides.esbuild = 0.28.1`; full tests and builds verify compatibility.

---

## [ERR-20260714-009] npm-mirror-audit-endpoint

**Logged**: 2026-07-14T18:54:00+08:00
**Priority**: low
**Status**: resolved
**Area**: infra

### Summary

The configured npm mirror does not implement npm's security audit endpoint.

### Error

```text
404 Not Found: /-/npm/v1/security/audits/quick
```

### Context

- Command: `npm audit --omit=dev`
- Registry: `https://registry.npmmirror.com`

### Suggested Fix

Run security audits against the official npm registry without changing global npm configuration.

### Metadata

- Reproducible: yes
- Related Files: `package-lock.json`

### Resolution

- **Resolved**: 2026-07-14T18:55:00+08:00
- **Notes**: Audit rerun with `--registry https://registry.npmjs.org`.

---

## [ERR-20260714-008] yaml-validator-dependency

**Logged**: 2026-07-14T18:53:00+08:00
**Priority**: low
**Status**: resolved
**Area**: infra

### Summary

The workflow validation command assumed the transitive `yaml` package was importable from the project root.

### Error

```text
ERR_MODULE_NOT_FOUND: Cannot find package 'yaml'
```

### Context

- The project does not directly depend on a YAML parser.
- Adding a production or development dependency only for this one-time check is unnecessary.

### Suggested Fix

Use an available system YAML parser for local syntax validation.

### Metadata

- Reproducible: yes
- Related Files: `.github/workflows/ci.yml`, `.github/workflows/release.yml`

### Resolution

- **Resolved**: 2026-07-14T18:54:00+08:00
- **Notes**: Validate both workflow files with Ruby's standard YAML library.

---

## [ERR-20260714-007] nest-decorator-test-placeholder

**Logged**: 2026-07-14T18:45:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tests

### Summary

A placeholder controller parameter in a metadata test violated the unused-variable lint rule.

### Error

```text
@typescript-eslint/no-unused-vars
```

### Context

- The parameter decorator is invoked manually with parameter index zero.
- The controller method does not need a declared runtime parameter for this metadata assertion.

### Suggested Fix

Remove the unused placeholder parameter from the test controller method.

### Metadata

- Reproducible: yes
- Related Files: `packages/zod-nestjs/test/pipe.test.ts`

### Resolution

- **Resolved**: 2026-07-14T18:46:00+08:00
- **Notes**: The test method is now parameterless.

---

## [ERR-20260714-006] express-next-function-mock

**Logged**: 2026-07-14T18:42:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tests

### Summary

Vitest's generic mock could not represent all Express 5 `NextFunction` overloads.

### Error

```text
Mock<NextFunction> is not assignable to NextFunction
```

### Context

- Express 5 supports error values plus the special `"route"` and `"router"` arguments.
- The runtime behavior was already passing.

### Suggested Fix

Keep an untyped Vitest mock for assertions and cast only the function passed to middleware.

### Metadata

- Reproducible: yes
- Related Files: `packages/zod-express/test/middleware.test.ts`

### Resolution

- **Resolved**: 2026-07-14T18:43:00+08:00
- **Notes**: Split `nextMock` from its Express-facing `NextFunction` view.

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

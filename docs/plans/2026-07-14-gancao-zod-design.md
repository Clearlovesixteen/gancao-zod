# Gancao Zod Toolkit Design

## Goal

Build a private TypeScript monorepo published under the `@gancao` GitHub Packages scope. It standardizes Zod validation results and error messages across React, Express, and NestJS applications.

## Packages

- `@gancao/zod-core`: framework-independent validation, error normalization, locale registration, and synchronous/asynchronous validators.
- `@gancao/zod-presets`: reusable schemas for identifiers, email, phone numbers, pagination, dates, and environment values.
- `@gancao/zod-react-hook-form`: a resolver that maps normalized errors to React Hook Form field errors.
- `@gancao/zod-express`: request validation middleware for body, query, and params.
- `@gancao/zod-nestjs`: a validation pipe and decorators that convert normalized errors to NestJS HTTP exceptions.

Zod and all framework packages are peer dependencies. The core package has no Node.js-only runtime dependency, so it can run in browsers and servers.

## Core API

Validation returns a discriminated union and does not throw:

```ts
type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };
```

Each error contains a stable code, localized message, structured path, dotted field name, and optional parameters. The public API includes `validate`, `validateAsync`, `createValidator`, `registerLocale`, and `setDefaultLocale`.

Framework adapters only translate boundary behavior. NestJS and Express may interrupt an HTTP request according to their framework contracts, while the core result remains non-throwing.

## Build And Release

The repository uses npm workspaces, TypeScript, tsup, Vitest, ESLint, and Changesets. Packages emit ESM, CommonJS, and declaration files. GitHub Actions verifies pull requests and publishes versioned packages to `https://npm.pkg.github.com` after a Changesets release PR is merged.

The first release uses fixed versions for all packages. Package manifests declare `publishConfig.access` as `restricted` and associate packages with the GitHub repository.

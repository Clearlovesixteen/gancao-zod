# Gancao Zod Toolkit

Private TypeScript validation packages for Gancao React, Express, and NestJS applications. The toolkit keeps Zod schemas composable while providing one stable validation result and error format across application boundaries.

## Packages

| Package | Purpose |
| --- | --- |
| `@clearlovesixteen/zod-core` | Validation results, normalized errors, locales, and validator factories |
| `@clearlovesixteen/zod-presets` | IDs, contact details, pagination, ISO dates, and environment values |
| `@clearlovesixteen/zod-react-hook-form` | React Hook Form resolver |
| `@clearlovesixteen/zod-express` | Express body, query, and params middleware |
| `@clearlovesixteen/zod-nestjs` | NestJS validation pipe and parameter decorators |

## Install From GitHub Packages

Create a GitHub token with `read:packages`, then add this configuration to the consuming project's `.npmrc`:

```ini
@clearlovesixteen:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

Export the token and install only the packages the application needs:

```bash
export GITHUB_PACKAGES_TOKEN=github_pat_xxx
npm install zod @clearlovesixteen/zod-core
```

Framework packages declare their frameworks as peer dependencies. For example:

```bash
npm install zod react-hook-form @clearlovesixteen/zod-react-hook-form
npm install zod express @clearlovesixteen/zod-express
npm install zod @nestjs/common @clearlovesixteen/zod-nestjs
```

## Core Validation

```ts
import { validate, z } from "@clearlovesixteen/zod-core";

const userSchema = z.object({
  name: z.string().trim(),
  age: z.coerce.number().int().positive(),
});

const result = validate(userSchema, { name: "  Ada  ", age: "36" });

if (result.success) {
  console.log(result.data); // { name: "Ada", age: 36 }
} else {
  console.log(result.errors);
}
```

Errors have a stable shape:

```ts
interface ValidationError {
  code: string;
  message: string;
  path: Array<string | number>;
  field: string;
  params?: Record<string, unknown>;
}
```

Use `validateAsync` for asynchronous refinements and `createValidator` for a reusable schema validator.

## Locales

Built-in locale names are `zh-CN` and `en-US`. The default is `zh-CN`.

```ts
import { registerLocale, setDefaultLocale } from "@clearlovesixteen/zod-core";

registerLocale("gancao", {
  invalid_type: () => "The value has the wrong type",
});

setDefaultLocale("gancao");
```

Schema-level custom refinement messages are preserved.

## Framework Examples

React Hook Form:

```ts
import { gancaoZodResolver } from "@clearlovesixteen/zod-react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({ email: z.email() });
const form = useForm({ resolver: gancaoZodResolver(schema) });
```

Express:

```ts
import { validateRequest } from "@clearlovesixteen/zod-express";
import { z } from "zod";

app.post(
  "/users/:id",
  validateRequest({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({ age: z.coerce.number().int() }),
  }),
  (request, response) => response.json(request.validated),
);
```

Validation failures are passed to `next` as `RequestValidationError`. Express 5 exposes `request.query` through a getter, so transformed query data is available through `request.validated.query`.

NestJS:

```ts
import { ZodBody, ZodParam } from "@clearlovesixteen/zod-nestjs";
import { z } from "zod";

const paramsSchema = z.object({ id: z.string().min(1) });
const bodySchema = z.object({ age: z.coerce.number().int() });

@Post(":id")
create(
  @ZodParam(paramsSchema) params: z.output<typeof paramsSchema>,
  @ZodBody(bodySchema) body: z.output<typeof bodySchema>,
) {
  return { params, body };
}
```

## Development

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

Create a changeset for user-facing package changes:

```bash
npm run changeset
```

Merging changesets into `main` updates the Changesets release pull request. Merging that release pull request publishes the packages to GitHub Packages with the repository `GITHUB_TOKEN`.


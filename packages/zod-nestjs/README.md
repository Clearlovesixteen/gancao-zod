# @clearlovesixteen/zod-nestjs

NestJS validation pipe and parameter decorators backed by `@clearlovesixteen/zod-core`.

```ts
import { ZodBody, ZodParam, ZodQuery } from "@clearlovesixteen/zod-nestjs";
import { z } from "zod";

const bodySchema = z.object({ age: z.coerce.number().int() });

create(@ZodBody(bodySchema) body: z.output<typeof bodySchema>) {
  return body;
}
```

Use `GancaoValidationPipe` directly when a decorator is not appropriate. Validation options support locale selection and a custom exception factory.


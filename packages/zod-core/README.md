# @clearlovesixteen/zod-core

Framework-independent Zod validation with normalized, localized result objects.

```ts
import { createValidator, z } from "@clearlovesixteen/zod-core";

const validateUser = createValidator(
  z.object({ id: z.string().min(1), age: z.coerce.number().int() }),
  { locale: "zh-CN" },
);

const result = validateUser({ id: "user-1", age: "36" });
```

Exports include `validate`, `validateAsync`, `createValidator`, locale registration, issue normalization, all public result types, and Zod's `z` namespace.


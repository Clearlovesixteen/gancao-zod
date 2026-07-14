# @gancao/zod-presets

Composable Zod schemas for common application inputs.

```ts
import {
  emailSchema,
  paginationSchema,
  phoneSchema,
  uuidSchema,
} from "@gancao/zod-presets";

paginationSchema.parse({ page: "2", pageSize: "50" });
emailSchema.parse("  TEAM@GANCAO.COM  ");
```

The package also exports ISO date, environment boolean/number, ID, page, and page-size schemas.


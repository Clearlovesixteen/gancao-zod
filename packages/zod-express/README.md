# @gancao/zod-express

Express middleware for validating body, query, and route params.

```ts
import { validateRequest } from "@gancao/zod-express";
import { z } from "zod";

app.get(
  "/users",
  validateRequest({ query: z.object({ page: z.coerce.number().int().min(1) }) }),
  (request, response) => response.json(request.validated?.query),
);
```

Successful parsed values are stored in `request.validated`. Body and params are also replaced with parsed values. Failures call `next` with `RequestValidationError` unless an `onError` callback is configured.


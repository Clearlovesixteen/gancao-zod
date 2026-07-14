# @clearlovesixteen/zod-react-hook-form

React Hook Form resolver backed by `@clearlovesixteen/zod-core`.

```ts
import { gancaoZodResolver } from "@clearlovesixteen/zod-react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({ email: z.email() });

const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
  resolver: gancaoZodResolver(schema),
});
```

Nested Zod paths are converted to nested React Hook Form field errors.


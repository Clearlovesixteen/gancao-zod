import type { FieldValues, ResolverOptions } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { gancaoZodResolver } from "../src/index.js";

function resolverOptions<TFieldValues extends FieldValues>(): ResolverOptions<TFieldValues> {
  return {
    criteriaMode: "firstError",
    fields: {},
    shouldUseNativeValidation: false,
  };
}

describe("gancaoZodResolver", () => {
  it("returns parsed and transformed values", async () => {
    const schema = z.object({
      name: z.string().trim(),
      age: z.coerce.number().int(),
    });
    const resolver = gancaoZodResolver(schema);

    const result = await resolver(
      { name: "  Ada  ", age: "36" },
      undefined,
      resolverOptions<z.input<typeof schema>>(),
    );

    expect(result).toEqual({
      values: { name: "Ada", age: 36 },
      errors: {},
    });
  });

  it("maps normalized nested errors to form fields", async () => {
    const schema = z.object({
      users: z.array(z.object({ email: z.email() })),
    });
    const resolver = gancaoZodResolver(schema, { locale: "zh-CN" });

    const result = await resolver(
      { users: [{ email: "invalid" }] },
      undefined,
      resolverOptions<z.input<typeof schema>>(),
    );

    expect(result.values).toEqual({});
    expect(result.errors).toEqual({
      users: {
        0: {
          email: {
            type: "invalid_format",
            message: "格式不正确",
          },
        },
      },
    });
  });
});

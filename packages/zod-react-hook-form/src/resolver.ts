import { validateAsync } from "@gancao/zod-core";
import type { ValidationError, ValidationOptions } from "@gancao/zod-core";
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
} from "react-hook-form";
import type { z } from "zod";

const unsafePathSegments = new Set(["__proto__", "constructor", "prototype"]);

function fieldError(error: ValidationError): FieldError {
  return {
    type: error.code,
    message: error.message,
  };
}

function toNestedErrors<TFieldValues extends FieldValues>(
  errors: ValidationError[],
): FieldErrors<TFieldValues> {
  const result: Record<string, unknown> = {};

  for (const error of errors) {
    const path = error.path.length > 0 ? error.path.map(String) : ["root"];
    let current = result;

    for (let index = 0; index < path.length; index += 1) {
      const rawSegment = path[index] ?? "root";
      const segment = unsafePathSegments.has(rawSegment) ? "root" : rawSegment;
      const isLeaf = index === path.length - 1;

      if (isLeaf) {
        current[segment] ??= fieldError(error);
        continue;
      }

      const existing = current[segment];
      if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
        current[segment] = {};
      }
      current = current[segment] as Record<string, unknown>;
    }
  }

  return result as FieldErrors<TFieldValues>;
}

export function gancaoZodResolver<
  TInput extends FieldValues,
  TContext = unknown,
  TOutput = TInput,
>(
  schema: z.ZodType<TOutput, TInput>,
  validationOptions: ValidationOptions = {},
): Resolver<TInput, TContext, TOutput> {
  return async (values) => {
    const result = await validateAsync(schema, values, validationOptions);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    return {
      values: {},
      errors: toNestedErrors<TInput>(result.errors),
    };
  };
}

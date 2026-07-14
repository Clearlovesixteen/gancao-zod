import type { z } from "zod";

import { normalizeIssues } from "./errors.js";
import type { ValidationOptions, ValidationResult } from "./types.js";

export function validate<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
  options: ValidationOptions = {},
): ValidationResult<z.output<TSchema>> {
  const result = schema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: normalizeIssues(result.error.issues, options.locale),
  };
}

export async function validateAsync<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
  options: ValidationOptions = {},
): Promise<ValidationResult<z.output<TSchema>>> {
  const result = await schema.safeParseAsync(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: normalizeIssues(result.error.issues, options.locale),
  };
}

export function createValidator<TSchema extends z.ZodType>(
  schema: TSchema,
  defaults: ValidationOptions = {},
) {
  return (
    input: unknown,
    options: ValidationOptions = {},
  ): ValidationResult<z.output<TSchema>> =>
    validate(schema, input, { ...defaults, ...options });
}

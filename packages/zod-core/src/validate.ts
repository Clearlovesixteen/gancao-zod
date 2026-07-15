import type { z } from 'zod';

import { normalizeIssues } from './errors.js';
import type { ValidationOptions, ValidationResult } from './types.js';

/** 同步执行 Schema，并返回不抛异常的可辨识结果。 */
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

/** 执行包含异步 refinement 或 transform 的 Schema。 */
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

/** 将 Schema 和默认配置封装成可复用的同步校验器。 */
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

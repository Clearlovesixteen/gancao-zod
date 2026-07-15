import { validateAsync } from '@clearlovesixteen/zod-core';
import type {
  ValidationError,
  ValidationOptions,
} from '@clearlovesixteen/zod-core';
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  MultipleFieldErrors,
  Resolver,
} from 'react-hook-form';
import type { z } from 'zod';

const unsafePathSegments = new Set(['__proto__', 'constructor', 'prototype']);

function fieldError(error: ValidationError): FieldError {
  return {
    type: error.code,
    message: error.message,
  };
}

function appendFieldError(
  current: FieldError | undefined,
  error: ValidationError,
  collectAll: boolean,
): FieldError {
  const next = current ?? fieldError(error);
  if (!collectAll) return next;

  const types: MultipleFieldErrors = next.types ?? {};
  const previous = types[error.code];

  if (previous === undefined) {
    types[error.code] = error.message;
  } else if (Array.isArray(previous)) {
    if (!previous.includes(error.message)) previous.push(error.message);
  } else if (typeof previous === 'string' && previous !== error.message) {
    types[error.code] = [previous, error.message];
  } else if (typeof previous !== 'string') {
    types[error.code] = error.message;
  }

  next.types = types;
  return next;
}

function toNestedErrors<TFieldValues extends FieldValues>(
  errors: ValidationError[],
  collectAll: boolean,
): FieldErrors<TFieldValues> {
  const result: Record<string, unknown> = {};

  for (const error of errors) {
    const path = error.path.length > 0 ? error.path.map(String) : ['root'];
    let current = result;

    for (let index = 0; index < path.length; index += 1) {
      const rawSegment = path[index] ?? 'root';
      // 避免错误路径修改 Object 原型，危险字段统一放到 root。
      const segment = unsafePathSegments.has(rawSegment) ? 'root' : rawSegment;
      const isLeaf = index === path.length - 1;

      if (isLeaf) {
        current[segment] = appendFieldError(
          current[segment] as FieldError | undefined,
          error,
          collectAll,
        );
        continue;
      }

      const existing = current[segment];
      if (
        !existing ||
        typeof existing !== 'object' ||
        Array.isArray(existing)
      ) {
        current[segment] = {};
      }
      current = current[segment] as Record<string, unknown>;
    }
  }

  return result as FieldErrors<TFieldValues>;
}

/**
 * 创建 Gancao Zod Resolver。
 *
 * 成功时返回 Zod 转换后的输出；失败时将错误路径转换为 RHF 嵌套结构。
 */
export function gancaoZodResolver<
  TInput extends FieldValues,
  TContext = unknown,
  TOutput = TInput,
>(
  schema: z.ZodType<TOutput, TInput>,
  validationOptions: ValidationOptions = {},
): Resolver<TInput, TContext, TOutput> {
  return async (values, _context, resolverOptions) => {
    const result = await validateAsync(schema, values, validationOptions);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    return {
      values: {},
      errors: toNestedErrors<TInput>(
        result.errors,
        resolverOptions.criteriaMode === 'all',
      ),
    };
  };
}

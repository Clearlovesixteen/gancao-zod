import { Body, Param, Query } from '@nestjs/common';
import type { z } from 'zod';

import { GancaoValidationPipe } from './pipe.js';
import type { NestValidationOptions } from './pipe.js';

/** 校验并转换请求 body。 */
export function ZodBody<TSchema extends z.ZodType>(
  schema: TSchema,
  options: NestValidationOptions = {},
): ParameterDecorator {
  return Body(new GancaoValidationPipe(schema, options));
}

/** 校验并转换请求 query。 */
export function ZodQuery<TSchema extends z.ZodType>(
  schema: TSchema,
  options: NestValidationOptions = {},
): ParameterDecorator {
  return Query(new GancaoValidationPipe(schema, options));
}

/** 校验整个 params 对象或指定名称的路由参数。 */
export function ZodParam<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: NestValidationOptions,
): ParameterDecorator;
export function ZodParam<TSchema extends z.ZodType>(
  name: string,
  schema: TSchema,
  options?: NestValidationOptions,
): ParameterDecorator;
export function ZodParam<TSchema extends z.ZodType>(
  nameOrSchema: string | TSchema,
  schemaOrOptions: TSchema | NestValidationOptions = {},
  maybeOptions: NestValidationOptions = {},
): ParameterDecorator {
  if (typeof nameOrSchema === 'string') {
    return Param(
      nameOrSchema,
      new GancaoValidationPipe(schemaOrOptions as TSchema, maybeOptions),
    );
  }

  return Param(
    new GancaoValidationPipe(
      nameOrSchema,
      schemaOrOptions as NestValidationOptions,
    ),
  );
}

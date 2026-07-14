import { Body, Param, Query } from "@nestjs/common";
import type { z } from "zod";

import { GancaoValidationPipe } from "./pipe.js";
import type { NestValidationOptions } from "./pipe.js";

export function ZodBody<TSchema extends z.ZodType>(
  schema: TSchema,
  options: NestValidationOptions = {},
): ParameterDecorator {
  return Body(new GancaoValidationPipe(schema, options));
}

export function ZodQuery<TSchema extends z.ZodType>(
  schema: TSchema,
  options: NestValidationOptions = {},
): ParameterDecorator {
  return Query(new GancaoValidationPipe(schema, options));
}

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
  if (typeof nameOrSchema === "string") {
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

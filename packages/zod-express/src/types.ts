import type { ValidationError } from "@clearlovesixteen/zod-core";
import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

export interface RequestSchemas {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

export type InferValidatedRequest<TSchemas extends RequestSchemas> = {
  [TSource in keyof TSchemas]: TSchemas[TSource] extends z.ZodType
    ? z.output<TSchemas[TSource]>
    : never;
};

export interface ValidatedRequestData {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

export interface RequestValidationErrors {
  body?: ValidationError[];
  query?: ValidationError[];
  params?: ValidationError[];
}

export interface RequestValidationFailure {
  success: false;
  errors: RequestValidationErrors;
}

export type RequestValidationErrorHandler = (
  failure: RequestValidationFailure,
  request: Request,
  response: Response,
  next: NextFunction,
) => void | Promise<void>;

export interface RequestValidationOptions {
  locale?: string;
  onError?: RequestValidationErrorHandler;
}

export type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;

declare module "express-serve-static-core" {
  interface Request {
    validated?: ValidatedRequestData;
  }
}

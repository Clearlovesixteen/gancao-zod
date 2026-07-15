import type { ValidationError } from '@clearlovesixteen/zod-core';
import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';

/** 可校验的 Express 请求数据源。 */
export interface RequestSchemas {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

/** 根据请求 Schema 推导转换后的数据类型。 */
export type InferValidatedRequest<TSchemas extends RequestSchemas> = {
  [TSource in keyof TSchemas]: TSchemas[TSource] extends z.ZodType
    ? z.output<TSchemas[TSource]>
    : never;
};

/** 挂载到 request.validated 的校验结果。 */
export interface ValidatedRequestData {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

/** 按请求数据源分组的错误。 */
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

/** Express 请求校验配置。 */
export interface RequestValidationOptions {
  /** 本次请求使用的错误消息语言。 */
  locale?: string;
  /** 自定义失败处理器；未提供时将错误传给 next。 */
  onError?: RequestValidationErrorHandler;
}

export type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;

declare module 'express-serve-static-core' {
  interface Request {
    /** Schema 转换后的 body、query 和 params。 */
    validated?: ValidatedRequestData;
  }
}

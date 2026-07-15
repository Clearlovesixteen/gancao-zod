import type { RequestValidationFailure } from './types.js';

/** Express 请求校验失败，由统一错误中间件负责转换为响应。 */
export class RequestValidationError extends Error {
  readonly statusCode = 400;

  constructor(readonly failure: RequestValidationFailure) {
    super('Request validation failed');
    this.name = 'RequestValidationError';
  }
}

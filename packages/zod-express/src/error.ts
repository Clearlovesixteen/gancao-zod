import type { RequestValidationFailure } from "./types.js";

export class RequestValidationError extends Error {
  readonly statusCode = 400;

  constructor(readonly failure: RequestValidationFailure) {
    super("Request validation failed");
    this.name = "RequestValidationError";
  }
}

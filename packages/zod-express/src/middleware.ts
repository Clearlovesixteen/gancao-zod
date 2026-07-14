import { validateAsync } from "@gancao/zod-core";
import type { ValidationOptions } from "@gancao/zod-core";

import { RequestValidationError } from "./error.js";
import type {
  AsyncRequestHandler,
  InferValidatedRequest,
  RequestSchemas,
  RequestValidationErrors,
  RequestValidationFailure,
  RequestValidationOptions,
  ValidatedRequestData,
} from "./types.js";

const requestSources = ["body", "query", "params"] as const;

export function validateRequest<TSchemas extends RequestSchemas>(
  schemas: TSchemas,
  options: RequestValidationOptions = {},
): AsyncRequestHandler {
  return async (request, response, next) => {
    const parsed: ValidatedRequestData = {};
    const errors: RequestValidationErrors = {};
    const validationOptions: ValidationOptions = options.locale
      ? { locale: options.locale }
      : {};

    for (const source of requestSources) {
      const schema = schemas[source];
      if (!schema) continue;

      const result = await validateAsync(
        schema,
        request[source],
        validationOptions,
      );

      if (result.success) {
        parsed[source] = result.data;
      } else {
        errors[source] = result.errors;
      }
    }

    if (Object.keys(errors).length > 0) {
      const failure: RequestValidationFailure = { success: false, errors };
      if (options.onError) {
        await options.onError(failure, request, response, next);
      } else {
        next(new RequestValidationError(failure));
      }
      return;
    }

    request.validated = parsed as InferValidatedRequest<TSchemas>;
    if ("body" in parsed) request.body = parsed.body;
    if ("params" in parsed) request.params = parsed.params as typeof request.params;
    next();
  };
}

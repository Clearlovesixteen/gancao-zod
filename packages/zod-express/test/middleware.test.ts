import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { RequestValidationError, validateRequest } from '../src/index.js';

function response(): Response {
  return {} as Response;
}

describe('validateRequest', () => {
  it('parses request sources and exposes transformed values', async () => {
    const request = {
      body: { age: '36' },
      query: { page: '2' },
      params: { id: '  user-1  ' },
    } as unknown as Request;
    const nextMock = vi.fn();
    const next = nextMock as unknown as NextFunction;
    const middleware = validateRequest({
      body: z.object({ age: z.coerce.number().int() }),
      query: z.object({ page: z.coerce.number().int().min(1) }),
      params: z.object({ id: z.string().trim().min(1) }),
    });

    await middleware(request, response(), next);

    expect(request.validated).toEqual({
      body: { age: 36 },
      query: { page: 2 },
      params: { id: 'user-1' },
    });
    expect(request.body).toEqual({ age: 36 });
    expect(request.params).toEqual({ id: 'user-1' });
    expect(nextMock).toHaveBeenCalledWith();
  });

  it('passes normalized failures to Express error middleware', async () => {
    const request = {
      body: { age: 'invalid' },
      query: {},
      params: {},
    } as unknown as Request;
    const nextMock = vi.fn();
    const next = nextMock as unknown as NextFunction;
    const middleware = validateRequest({
      body: z.object({ age: z.coerce.number() }),
    });

    await middleware(request, response(), next);

    const error = nextMock.mock.calls[0]?.[0];
    expect(error).toBeInstanceOf(RequestValidationError);
    expect(error).toMatchObject({
      statusCode: 400,
      failure: {
        success: false,
        errors: {
          body: [
            expect.objectContaining({
              code: 'invalid_type',
              field: 'age',
            }),
          ],
        },
      },
    });
    expect(request.validated).toBeUndefined();
  });

  it('supports a custom failure handler', async () => {
    const request = { body: {}, query: {}, params: {} } as unknown as Request;
    const nextMock = vi.fn();
    const next = nextMock as unknown as NextFunction;
    const onError = vi.fn();
    const middleware = validateRequest(
      { body: z.object({ name: z.string() }) },
      { onError },
    );

    await middleware(request, response(), next);

    expect(onError).toHaveBeenCalledOnce();
    expect(onError.mock.calls[0]?.[0]).toMatchObject({
      success: false,
      errors: { body: [expect.objectContaining({ field: 'name' })] },
    });
    expect(nextMock).not.toHaveBeenCalled();
  });
});

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createValidator, validate, validateAsync } from '../src/index.js';

describe('validate', () => {
  it('returns parsed and transformed data', () => {
    const schema = z.object({
      name: z.string().trim(),
      age: z.coerce.number().int().positive(),
    });

    const result = validate(schema, { name: '  Ada  ', age: '36' });

    expect(result).toEqual({
      success: true,
      data: { name: 'Ada', age: 36 },
    });
  });

  it('normalizes nested issue paths', () => {
    const schema = z.object({
      users: z.array(z.object({ email: z.email() })),
    });

    const result = validate(schema, { users: [{ email: 'not-an-email' }] });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errors[0]).toMatchObject({
      code: 'invalid_format',
      path: ['users', 0, 'email'],
      field: 'users.0.email',
    });
  });

  it('preserves an explicit custom refinement message', () => {
    const schema = z.string().refine((value) => value === 'gancao', {
      message: '必须使用内部标识',
    });

    const result = validate(schema, 'other');

    expect(result).toEqual({
      success: false,
      errors: [
        expect.objectContaining({
          code: 'custom',
          message: '必须使用内部标识',
          path: [],
          field: '',
        }),
      ],
    });
  });
});

describe('validateAsync', () => {
  it('supports asynchronous refinements', async () => {
    const schema = z.string().refine(async (value) => value === 'available', {
      message: '名称已存在',
    });

    await expect(validateAsync(schema, 'taken')).resolves.toEqual({
      success: false,
      errors: [expect.objectContaining({ message: '名称已存在' })],
    });
  });
});

describe('createValidator', () => {
  it('creates a reusable validator with default options', () => {
    const validateId = createValidator(z.uuid(), { locale: 'en-US' });

    const result = validateId('invalid');

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]?.message).toBe('Invalid format');
  });
});

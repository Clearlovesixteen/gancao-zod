import { describe, expect, it } from 'vitest';

import {
  emailSchema,
  envBooleanSchema,
  envNumberSchema,
  idSchema,
  isoDateSchema,
  isoDateTimeSchema,
  paginationSchema,
  phoneSchema,
  uuidSchema,
} from '../src/index.js';

describe('identity presets', () => {
  it.each(['user-1', '42', 'gancao'])('accepts non-empty ID %s', (value) => {
    expect(idSchema.parse(value)).toBe(value);
  });

  it('trims IDs and rejects empty values', () => {
    expect(idSchema.parse('  user-1  ')).toBe('user-1');
    expect(idSchema.safeParse('   ').success).toBe(false);
  });

  it('validates UUID values', () => {
    expect(
      uuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success,
    ).toBe(true);
    expect(uuidSchema.safeParse('user-1').success).toBe(false);
  });
});

describe('contact presets', () => {
  it('normalizes email addresses', () => {
    expect(emailSchema.parse('  TEAM@GANCAO.COM  ')).toBe('team@gancao.com');
  });

  it.each(['13800138000', '19912345678'])(
    'accepts Chinese mobile %s',
    (value) => {
      expect(phoneSchema.parse(value)).toBe(value);
    },
  );

  it.each(['12800138000', '1380013800', '+8613800138000'])(
    'rejects invalid mobile %s',
    (value) => {
      expect(phoneSchema.safeParse(value).success).toBe(false);
    },
  );
});

describe('pagination presets', () => {
  it('provides defaults and coerces URL query values', () => {
    expect(paginationSchema.parse({})).toEqual({ page: 1, pageSize: 20 });
    expect(paginationSchema.parse({ page: '2', pageSize: '50' })).toEqual({
      page: 2,
      pageSize: 50,
    });
  });

  it.each([{ page: 0 }, { page: 1.5 }, { pageSize: 101 }, { pageSize: 0 }])(
    'rejects invalid pagination %#',
    (value) => {
      expect(paginationSchema.safeParse(value).success).toBe(false);
    },
  );
});

describe('date presets', () => {
  it('validates calendar dates', () => {
    expect(isoDateSchema.safeParse('2026-07-14').success).toBe(true);
    expect(isoDateSchema.safeParse('2026-02-30').success).toBe(false);
  });

  it('validates ISO date times with offsets', () => {
    expect(isoDateTimeSchema.safeParse('2026-07-14T09:30:00Z').success).toBe(
      true,
    );
    expect(isoDateTimeSchema.safeParse('2026-07-14 09:30:00').success).toBe(
      false,
    );
  });
});

describe('environment presets', () => {
  it.each([
    ['true', true],
    ['1', true],
    ['false', false],
    ['0', false],
    [true, true],
  ])('parses boolean environment value %s', (input, expected) => {
    expect(envBooleanSchema.parse(input)).toBe(expected);
  });

  it('rejects ambiguous boolean strings', () => {
    expect(envBooleanSchema.safeParse('yes').success).toBe(false);
  });

  it('parses finite numeric environment values', () => {
    expect(envNumberSchema.parse('42.5')).toBe(42.5);
    expect(envNumberSchema.safeParse('NaN').success).toBe(false);
    expect(envNumberSchema.safeParse('Infinity').success).toBe(false);
  });
});

import { z } from 'zod';

function normalizeBoolean(value: unknown): unknown {
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return value;
}

function normalizeNumber(value: unknown): unknown {
  if (typeof value !== 'string' || value.trim() === '') return value;
  return Number(value);
}

/** 环境变量布尔值，仅接受 true、false、1、0 和对应布尔值。 */
export const envBooleanSchema = z.preprocess(normalizeBoolean, z.boolean());

/** 将非空环境变量字符串转换为有限数字。 */
export const envNumberSchema = z.preprocess(
  normalizeNumber,
  z.number().finite(),
);

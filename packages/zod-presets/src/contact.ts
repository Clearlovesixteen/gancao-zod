import { z } from 'zod';

/** 邮箱：去除首尾空格、转小写后校验格式。 */
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

/** 中国大陆 11 位手机号。 */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^1[3-9]\d{9}$/);

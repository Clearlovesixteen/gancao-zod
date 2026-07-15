import { z } from 'zod';

/** 去除首尾空格后的非空业务 ID。 */
export const idSchema = z.string().trim().min(1);

/** UUID 字符串。 */
export const uuidSchema = z.uuid();

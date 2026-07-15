import { z } from 'zod';

/** ISO 8601 日期，格式为 YYYY-MM-DD。 */
export const isoDateSchema = z.iso.date();

/** 带时区偏移的 ISO 8601 日期时间。 */
export const isoDateTimeSchema = z.iso.datetime({ offset: true });

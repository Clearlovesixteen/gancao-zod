import { z } from 'zod';

/** 页码：正整数，默认 1。 */
export const pageSchema = z.coerce.number().int().min(1).default(1);

/** 每页条数：1 到 100 的整数，默认 20。 */
export const pageSizeSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(100)
  .default(20);

/** 标准分页查询参数。 */
export const paginationSchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
});

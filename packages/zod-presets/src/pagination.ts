import { z } from "zod";

export const pageSchema = z.coerce.number().int().min(1).default(1);

export const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(20);

export const paginationSchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
});

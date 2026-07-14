import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const phoneSchema = z.string().trim().regex(/^1[3-9]\d{9}$/);

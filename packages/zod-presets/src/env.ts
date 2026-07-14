import { z } from "zod";

function normalizeBoolean(value: unknown): unknown {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return value;
}

function normalizeNumber(value: unknown): unknown {
  if (typeof value !== "string" || value.trim() === "") return value;
  return Number(value);
}

export const envBooleanSchema = z.preprocess(normalizeBoolean, z.boolean());

export const envNumberSchema = z.preprocess(
  normalizeNumber,
  z.number().finite(),
);

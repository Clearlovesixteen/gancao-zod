import type { z } from "zod";

export type ValidationPath = Array<string | number>;

export interface ValidationError {
  code: string;
  message: string;
  path: ValidationPath;
  field: string;
  params?: Record<string, unknown>;
}

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  errors: ValidationError[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export interface ValidationOptions {
  locale?: string;
  context?: string;
}

export type MessageFormatter = (issue: z.ZodIssue) => string;

export type LocaleDictionary = Partial<Record<string, MessageFormatter>>;

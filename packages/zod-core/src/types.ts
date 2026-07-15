import type { z } from 'zod';

export type ValidationPath = Array<string | number>;

/** 归一化后的单条校验错误，可直接用于接口响应和表单展示。 */
export interface ValidationError {
  /** Zod issue code。 */
  code: string;
  /** 根据 locale 格式化后的错误消息。 */
  message: string;
  /** 保留数组下标的原始字段路径。 */
  path: ValidationPath;
  /** 使用点号拼接的字段路径，根级错误为空字符串。 */
  field: string;
  /** Zod issue 中除 code、message、path 外的附加信息。 */
  params?: Record<string, unknown>;
}

/** 校验成功结果。 */
export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

/** 校验失败结果。 */
export interface ValidationFailure {
  success: false;
  errors: ValidationError[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/** 单次校验配置。 */
export interface ValidationOptions {
  /** 本次校验使用的语言，默认使用全局 locale。 */
  locale?: string;
}

export type MessageFormatter = (issue: z.ZodIssue) => string;

export type LocaleDictionary = Partial<Record<string, MessageFormatter>>;

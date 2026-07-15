import type { z } from 'zod';

import { formatIssueMessage } from './locale.js';
import type { ValidationError, ValidationPath } from './types.js';

function normalizePath(path: PropertyKey[]): ValidationPath {
  // Symbol 不能直接出现在 JSON 中，转换为稳定字符串后再对外返回。
  return path.map((segment) =>
    typeof segment === 'symbol'
      ? (segment.description ?? segment.toString())
      : segment,
  );
}

function issueParams(issue: z.ZodIssue): Record<string, unknown> | undefined {
  const params = Object.fromEntries(
    Object.entries(issue).filter(
      ([key]) => key !== 'code' && key !== 'message' && key !== 'path',
    ),
  );
  return Object.keys(params).length > 0 ? params : undefined;
}

/** 将单条 Zod issue 转换为统一错误结构。 */
export function normalizeIssue(
  issue: z.ZodIssue,
  locale?: string,
): ValidationError {
  const path = normalizePath(issue.path);
  const params = issueParams(issue);
  const error: ValidationError = {
    code: issue.code,
    message: formatIssueMessage(issue, locale),
    path,
    field: path.join('.'),
  };

  if (params) {
    error.params = params;
  }

  return error;
}

/** 批量转换 Zod issues，并保持原始错误顺序。 */
export function normalizeIssues(
  issues: z.ZodIssue[],
  locale?: string,
): ValidationError[] {
  return issues.map((issue) => normalizeIssue(issue, locale));
}

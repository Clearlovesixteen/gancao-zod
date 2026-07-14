import type { z } from "zod";

import type { LocaleDictionary } from "./types.js";

const zhCN: LocaleDictionary = {
  invalid_type: () => "类型不正确",
  invalid_format: () => "格式不正确",
  too_small: () => "值小于允许的最小范围",
  too_big: () => "值大于允许的最大范围",
  not_multiple_of: () => "值不是允许的倍数",
  unrecognized_keys: () => "包含未识别的字段",
  invalid_union: () => "值不符合任一允许的类型",
  invalid_key: () => "键名不正确",
  invalid_element: () => "集合元素不正确",
  custom: (issue) => issue.message || "校验失败",
};

const enUS: LocaleDictionary = {
  invalid_type: () => "Invalid type",
  invalid_format: () => "Invalid format",
  too_small: () => "Value is below the allowed minimum",
  too_big: () => "Value exceeds the allowed maximum",
  not_multiple_of: () => "Value is not an allowed multiple",
  unrecognized_keys: () => "Unrecognized fields are present",
  invalid_union: () => "Value does not match any allowed type",
  invalid_key: () => "Invalid key",
  invalid_element: () => "Invalid collection element",
  custom: (issue) => issue.message || "Validation failed",
};

const locales = new Map<string, LocaleDictionary>([
  ["zh-CN", zhCN],
  ["en-US", enUS],
]);

let defaultLocale = "zh-CN";

export function registerLocale(
  locale: string,
  dictionary: LocaleDictionary,
): void {
  locales.set(locale, { ...dictionary });
}

export function setDefaultLocale(locale: string): void {
  defaultLocale = locale;
}

export function getDefaultLocale(): string {
  return defaultLocale;
}

export function formatIssueMessage(issue: z.ZodIssue, locale?: string): string {
  if (issue.code === "custom" && issue.message) {
    return issue.message;
  }

  const selectedLocale = locale ?? defaultLocale;
  const formatter =
    locales.get(selectedLocale)?.[issue.code] ??
    locales.get(defaultLocale)?.[issue.code];

  return formatter?.(issue) ?? issue.message;
}

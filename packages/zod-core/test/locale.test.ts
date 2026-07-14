import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";

import {
  registerLocale,
  setDefaultLocale,
  validate,
} from "../src/index.js";

describe("validation locales", () => {
  beforeEach(() => {
    setDefaultLocale("zh-CN");
  });

  it("uses the default Chinese message dictionary", () => {
    const result = validate(z.object({ count: z.number() }), { count: "1" });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]?.message).toBe("类型不正确");
  });

  it("supports registering a project locale", () => {
    registerLocale("gancao-test", {
      invalid_type: () => "custom invalid type",
    });

    const result = validate(z.number(), "1", { locale: "gancao-test" });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]?.message).toBe("custom invalid type");
  });

  it("falls back to the default locale for missing messages", () => {
    registerLocale("partial", {});

    const result = validate(z.string().min(3), "a", { locale: "partial" });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]?.message).toBe("值小于允许的最小范围");
  });
});

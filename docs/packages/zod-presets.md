# `@clearlovesixteen/zod-presets`

面向常见应用输入的可组合 Zod Schema。所有预设都是普通 Zod Schema，可以继续调用 `.optional()`、`.array()`、`.transform()` 或放入对象 Schema。

## 安装

```bash
npm install zod @clearlovesixteen/zod-presets
```

## 身份标识

```ts
import { idSchema, uuidSchema } from "@clearlovesixteen/zod-presets";

idSchema.parse("  user-1  ");
// "user-1"

uuidSchema.parse("550e8400-e29b-41d4-a716-446655440000");
```

`idSchema` 接收 trim 后的非空字符串；`uuidSchema` 使用 Zod UUID 格式校验。

## 联系方式

```ts
import { emailSchema, phoneSchema } from "@clearlovesixteen/zod-presets";

emailSchema.parse("  TEAM@GANCAO.COM  ");
// "team@gancao.com"

phoneSchema.parse("13800138000");
```

`phoneSchema` 面向中国大陆 11 位手机号，不接收 `+86` 前缀。

## 分页

```ts
import { paginationSchema } from "@clearlovesixteen/zod-presets";

paginationSchema.parse({});
// { page: 1, pageSize: 20 }

paginationSchema.parse({ page: "2", pageSize: "50" });
// { page: 2, pageSize: 50 }
```

| Schema | 规则 |
| --- | --- |
| `pageSchema` | 整数，最小 1，默认 1 |
| `pageSizeSchema` | 整数，范围 1 到 100，默认 20 |
| `paginationSchema` | `{ page, pageSize }` 对象 |

## 日期

```ts
isoDateSchema.parse("2026-07-14");
isoDateTimeSchema.parse("2026-07-14T09:30:00Z");
```

`isoDateTimeSchema` 要求 ISO datetime 包含时区偏移，普通的 `2026-07-14 09:30:00` 不会通过。

## 环境变量

```ts
import {
  envBooleanSchema,
  envNumberSchema,
} from "@clearlovesixteen/zod-presets";

envBooleanSchema.parse("true"); // true
envBooleanSchema.parse("0"); // false
envNumberSchema.parse("42.5"); // 42.5
```

布尔预设仅接受 `true`、`false`、`1`、`0` 及对应 boolean，避免把 `yes` 等含糊值静默转换。数字预设拒绝空字符串、`NaN` 和无限值。

## 组合配置 Schema

```ts
const envSchema = z.object({
  PORT: envNumberSchema.default(3000),
  ENABLE_CACHE: envBooleanSchema.default(false),
  ADMIN_EMAIL: emailSchema,
});

export const env = envSchema.parse(process.env);
```

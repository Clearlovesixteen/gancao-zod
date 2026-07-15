# `@clearlovesixteen/zod-core`

框架无关的校验核心，负责执行 Zod Schema、返回可辨识结果、归一化 issue 和选择语言消息。

## 安装

```bash
npm install zod @clearlovesixteen/zod-core
```

## `validate`

用于同步 Schema，返回 `ValidationResult<z.output<TSchema>>`。

```ts
import { validate, z } from "@clearlovesixteen/zod-core";

const schema = z.object({
  id: z.string().trim().min(1),
  age: z.coerce.number().int(),
});

const result = validate(schema, { id: " user-1 ", age: "36" });
```

可为单次校验指定 locale：

```ts
validate(schema, input, { locale: "en-US" });
```

## `validateAsync`

用于包含异步 refinement 或 transform 的 Schema。

```ts
const schema = z.string().refine(async (value) => {
  return await isAvailable(value);
}, { message: "名称已存在" });

const result = await validateAsync(schema, "gancao");
```

## `createValidator`

将 Schema 和默认选项封装成可复用函数。调用时提供的选项会覆盖默认选项。

```ts
import { createValidator, z } from "@clearlovesixteen/zod-core";

const validateId = createValidator(z.uuid(), { locale: "zh-CN" });

validateId("550e8400-e29b-41d4-a716-446655440000");
validateId("invalid", { locale: "en-US" });
```

## 语言管理

```ts
import {
  getDefaultLocale,
  registerLocale,
  setDefaultLocale,
} from "@clearlovesixteen/zod-core";

registerLocale("product-zh", {
  invalid_type: () => "字段类型不符合产品协议",
});

setDefaultLocale("product-zh");
console.log(getDefaultLocale()); // "product-zh"
```

语言字典是 `Partial<Record<string, MessageFormatter>>`。没有定义的 issue code 会回退到默认语言字典。

## Issue 归一化

需要处理已有 `ZodIssue` 时，可以直接使用：

```ts
normalizeIssue(issue, "zh-CN");
normalizeIssues(error.issues, "zh-CN");
```

通常业务代码应优先使用 `validate`，只有在接入已有 Zod 流程时才需要直接调用归一化函数。

## 导出内容

| 导出 | 类型 | 说明 |
| --- | --- | --- |
| `validate` | 函数 | 同步校验 |
| `validateAsync` | 函数 | 异步校验 |
| `createValidator` | 函数 | 创建复用校验器 |
| `normalizeIssue(s)` | 函数 | 转换 Zod issue |
| `registerLocale` | 函数 | 注册语言字典 |
| `setDefaultLocale` | 函数 | 设置默认语言 |
| `getDefaultLocale` | 函数 | 读取默认语言 |
| `formatIssueMessage` | 函数 | 格式化单条消息 |
| `z` | 命名空间 | Zod 的 `z` |

完整类型列表见 [API 参考](/api/#zod-core)。

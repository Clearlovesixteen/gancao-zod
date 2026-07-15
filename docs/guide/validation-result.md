# 校验结果

所有核心校验都返回可辨识联合类型 `ValidationResult<T>`。

```ts
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

interface ValidationSuccess<T> {
  success: true;
  data: T;
}

interface ValidationFailure {
  success: false;
  errors: ValidationError[];
}
```

## 成功结果

`data` 是 Zod 解析和转换后的输出，而不是原始输入。

```ts
const schema = z.object({
  page: z.coerce.number().int(),
  name: z.string().trim(),
});

validate(schema, { page: "2", name: "  Ada  " });
// { success: true, data: { page: 2, name: "Ada" } }
```

## 失败结果

每个 Zod issue 都会被转换为稳定的 `ValidationError`：

```ts
interface ValidationError {
  code: string;
  message: string;
  path: Array<string | number>;
  field: string;
  params?: Record<string, unknown>;
}
```

| 字段 | 说明 |
| --- | --- |
| `code` | Zod issue code，例如 `invalid_type`、`too_small` |
| `message` | 根据 locale 格式化后的消息 |
| `path` | 保留数组下标的结构化路径 |
| `field` | 使用 `.` 连接的扁平字段路径 |
| `params` | 除 code、message、path 外的原始 issue 参数 |

嵌套数组错误示例：

```json
{
  "code": "invalid_format",
  "message": "格式不正确",
  "path": ["users", 0, "email"],
  "field": "users.0.email",
  "params": { "format": "email" }
}
```

`path` 适合构建嵌套表单错误，`field` 适合日志、接口响应和简单字段映射。

## 同步与异步

同步 Schema 使用 `validate`。包含异步 refinement 时使用 `validateAsync`：

```ts
const uniqueNameSchema = z.string().refine(
  async (name) => !(await nameExists(name)),
  { message: "名称已存在" },
);

const result = await validateAsync(uniqueNameSchema, "gancao");
```

Schema 中显式定义的自定义消息会被保留，不会被语言包覆盖。

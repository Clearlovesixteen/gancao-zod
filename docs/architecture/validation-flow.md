# 校验数据流

一次校验会依次经过输入收集、Zod 解析、结果归一化和框架映射。

<ArchitectureMap />

## 成功路径

```text
unknown input
    │
    ▼
schema.safeParse / safeParseAsync
    │ success
    ▼
z.output<TSchema>
    │
    ├── core:  { success: true, data }
    ├── RHF:   { values: data, errors: {} }
    ├── Express: request.validated + parsed body/params
    └── NestJS: controller parameter
```

Zod 的转换发生在 Schema 解析阶段，所以后续框架拿到的是输出类型。例如字符串 `"2"` 经过 `z.coerce.number()` 后会成为数字 `2`。

## 失败路径

```text
ZodIssue[]
    │
    ▼ normalizeIssues
ValidationError[]
    │
    ├── RHF:   嵌套 FieldErrors
    ├── Express: RequestValidationError
    └── NestJS: BadRequestException / exceptionFactory
```

核心层逐条处理 issue：

1. 将 `PropertyKey[]` 路径转换为 `Array<string | number>`。
2. 根据 locale 选择消息格式化器。
3. 生成点分隔的 `field`。
4. 将其余 issue 信息保存到 `params`。
5. 保留 refinement 显式提供的自定义消息。

## 框架映射差异

| 边界 | 成功数据 | 失败数据 |
| --- | --- | --- |
| Core | `ValidationSuccess<T>` | `ValidationFailure` |
| React Hook Form | `values` | 嵌套 `FieldErrors` |
| Express | `request.validated` | `RequestValidationError.failure` |
| NestJS | 参数值 | `BadRequestException` 响应体 |

虽然框架最终承载方式不同，但错误来源始终是同一个 `ValidationError[]`。

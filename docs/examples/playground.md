# 前端校验实验室

下面的实验室直接调用 `gancaoZodResolver`、`zod-core` 和 `zod-presets`。运行结果与 React Hook Form 实际收到的 `ResolverResult` 一致，不是静态演示数据。

<ValidationPlayground />

## 可以验证什么

| 场景 | 观察重点 |
| --- | --- |
| 资料转换 | `trim`、邮箱小写化、`coerce.number()` 和手机号预设 |
| 全部错误 | `firstError` 与 `criteriaMode: "all"` 的结果差异 |
| 嵌套字段 | `members.0.email` 如何转换为 RHF 嵌套错误对象 |
| 异步规则 | 异步 refinement 如何通过同一个 resolver 返回字段错误 |

切换 `zh-CN` 和 `en-US` 可以观察内置 Zod issue 的语言变化。Schema 主动提供的业务消息会保持原文，不会被语言包覆盖。

## 对应 React 写法

```tsx
const form = useForm<FormInput, unknown, FormOutput>({
  resolver: gancaoZodResolver(schema, { locale: "zh-CN" }),
  criteriaMode: "all",
});
```

完整组件见 [React Hook Form 完整示例](/examples/react-hook-form)。

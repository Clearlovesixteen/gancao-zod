# React Hook Form 最佳实践

## 明确输入与输出类型

存在 `coerce`、`transform` 或 `default` 时，不要只写 `z.infer`：

```tsx
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

const form = useForm<FormInput, unknown, FormOutput>({
  resolver: gancaoZodResolver(schema),
});
```

字段注册和 `defaultValues` 使用输入类型，`handleSubmit` 接收输出类型。

## 错误收集模式

默认使用第一条错误，界面更简洁：

```tsx
useForm({ resolver: gancaoZodResolver(schema) });
```

密码规则、批量编辑或需要展示完整检查结果时使用：

```tsx
useForm({
  resolver: gancaoZodResolver(schema),
  criteriaMode: "all",
});
```

首条消息仍位于 `error.message`，全部消息位于 `error.types`。

## 动态字段数组

数组错误会按 Zod path 转换为 RHF 嵌套结构：

```tsx
form.formState.errors.members?.[index]?.email?.message
```

使用 `useFieldArray` 返回的 `field.id` 作为 React key，不要使用数组下标作为 key。

## 跨字段校验

使用 `superRefine`，并把错误定位到用户需要修改的字段：

```ts
schema.superRefine((value, context) => {
  if (value.password === value.confirmPassword) return;

  context.addIssue({
    code: "custom",
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });
});
```

## 异步校验

Gancao resolver 始终使用异步解析，可以直接运行异步 refinement。高频输入场景仍应在 UI 层控制触发时机，避免每次按键都请求服务端。

## 服务端错误

客户端 Schema 负责可本地判断的规则。服务端返回的唯一性、权限和并发冲突应通过 `setError` 写回表单，不要为了复用 UI 而伪造客户端 refinement。

```tsx
form.setError("email", {
  type: "server",
  message: "该邮箱当前无法使用",
});
```

完整实现见 [React Hook Form 示例](/examples/react-hook-form)。

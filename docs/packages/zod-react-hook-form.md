# `@clearlovesixteen/zod-react-hook-form`

把统一校验结果映射为 React Hook Form 的 `Resolver` 返回值。

## 安装

```bash
npm install zod react-hook-form @clearlovesixteen/zod-react-hook-form
```

## 基础用法

```tsx
import { gancaoZodResolver } from "@clearlovesixteen/zod-react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1),
  age: z.coerce.number().int().positive(),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

function UserForm() {
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: gancaoZodResolver(schema),
  });

  return (
    <form onSubmit={form.handleSubmit((data) => console.log(data))}>
      <input {...form.register("name")} />
      <span>{form.formState.errors.name?.message}</span>

      <input {...form.register("age")} />
      <span>{form.formState.errors.age?.message}</span>

      <button type="submit">提交</button>
    </form>
  );
}
```

成功时 `handleSubmit` 收到 `FormOutput`，因此经过 `z.coerce.number()` 的 `age` 已经是数字。

## 指定语言

```ts
useForm({
  resolver: gancaoZodResolver(schema, { locale: "en-US" }),
});
```

## 嵌套错误

Zod 路径会转换为 React Hook Form 的嵌套 `FieldErrors`：

```ts
const schema = z.object({
  users: z.array(z.object({ email: z.email() })),
});
```

`users[0].email` 校验失败时：

```ts
form.formState.errors.users?.[0]?.email
// { type: "invalid_format", message: "格式不正确" }
```

根级错误会映射到 `root`。`__proto__`、`constructor` 和 `prototype` 等不安全路径片段也会被安全地映射到 `root`。

## Resolver 行为

| 状态 | `values` | `errors` |
| --- | --- | --- |
| 成功 | Zod 转换后的输出 | `{}` |
| 失败 | `{}` | 嵌套字段错误 |

当前 resolver 使用异步校验，因此同步和异步 refinement 都可以使用。

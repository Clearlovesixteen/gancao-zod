# 交互式校验

下面的演练场直接调用 `@clearlovesixteen/zod-core`。编辑输入 JSON，观察 Zod 转换后的成功数据，或统一格式的中文错误。

<ValidationPlayground />

## 当前 Schema

```ts
const userSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  age: z.coerce.number().int().positive(),
});
```

可以重点观察：

- `name` 会移除首尾空格。
- `email` 会转换为小写并校验格式。
- `age` 会从字符串转换为正整数。
- 失败结果不会抛出异常，而是返回 `ValidationError[]`。

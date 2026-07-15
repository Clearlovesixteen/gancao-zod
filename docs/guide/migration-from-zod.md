# 从原生 Zod 迁移

迁移不需要重写 Schema。Gancao Zod 使用的仍然是普通 Zod 4 Schema，建议先替换应用边界，再逐步整理公共预设。

## 迁移 `safeParse`

迁移前：

```ts
const result = schema.safeParse(input);

if (!result.success) {
  return result.error.issues.map((issue) => ({
    message: issue.message,
    path: issue.path.join("."),
  }));
}
```

迁移后：

```ts
const result = validate(schema, input);

if (!result.success) {
  return result.errors;
}
```

Schema、`z.input`、`z.output`、transform 和 refinement 均保持不变。变化只发生在失败结果协议。

## 迁移官方 `zodResolver`

迁移前：

```tsx
import { zodResolver } from "@hookform/resolvers/zod";

useForm({ resolver: zodResolver(schema) });
```

迁移后：

```tsx
import { gancaoZodResolver } from "@clearlovesixteen/zod-react-hook-form";

useForm({ resolver: gancaoZodResolver(schema) });
```

[React Hook Form Resolvers 官方文档](https://github.com/react-hook-form/resolvers#resolver-comparison)显示，`zodResolver` 已经支持 Zod 类型推导和 `firstError | all`，也是通用项目的首选。Gancao resolver 的价值是让表单复用团队统一的中文消息、错误代码和安全路径映射，并与 API 层错误结构保持一致。

| 能力 | 官方 `zodResolver` | Gancao resolver |
| --- | --- | --- |
| Zod 4 类型推导 | 支持 | 支持 |
| `criteriaMode` | `firstError` / `all` | `firstError` / `all` |
| 同步模式与 raw values | 支持 | 暂不支持 |
| 团队语言字典 | 依赖 Schema/Zod 配置 | 与 `zod-core` 共用 |
| 统一 `ValidationError` | 不负责 | 支持 |
| 前后端错误协议一致 | 需要项目自行实现 | 内置适配 |

::: tip 保留官方 resolver 的场景
只需要把 Zod 接入单个表单，且不需要团队错误协议时，继续使用官方 `zodResolver` 更直接。
:::

## 推荐迁移顺序

1. 选择一个字段类型较完整、风险可控的表单作为试点。
2. 保留原 Schema，只替换 resolver 和错误展示。
3. 使用 `z.input` 与 `z.output` 修正 transform 前后的类型。
4. 把重复出现且语义稳定的格式规则迁入 `zod-presets`。
5. 验证接口提交数据、嵌套字段和异步规则后再扩大范围。

迁移可以按页面进行，不要求全仓库一次完成。回滚时换回原 resolver 即可，Schema 不需要恢复。

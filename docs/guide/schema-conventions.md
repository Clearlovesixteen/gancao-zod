# Schema 编写规范

这套约定用于减少前端项目之间的命名和行为差异。它不是新的 Schema 语言，所有规则仍使用 Zod 表达。

## 文件与命名

- Schema 使用 `xxxSchema`，不要使用含义模糊的 `validator`、`rules`。
- 输入类型使用 `XxxInput`，转换后类型使用 `XxxOutput` 或明确的领域名称。
- 页面专属 Schema 放在页面模块内，跨项目稳定复用的格式规则才进入 `zod-presets`。
- Schema 与表单字段应保持同一层级，避免提交前重新组装另一套隐式结构。

```ts
export const createUserSchema = z.object({
  name: z.string().trim().min(1),
  age: z.coerce.number().int().positive(),
});

export type CreateUserInput = z.input<typeof createUserSchema>;
export type CreateUserOutput = z.output<typeof createUserSchema>;
```

## 转换规则

- 可以使用 `trim`、`toLowerCase`、`coerce`、`default` 和 `transform` 处理稳定的数据转换。
- 不在 transform 中发送请求、写缓存或修改外部状态。
- 空字符串、`null` 和 `undefined` 的语义必须由 Schema 明确表达。
- 金额、日期和标识符应先确定接口协议，再选择转换方式。

## 错误消息

- Zod 内置 issue 优先使用语言字典，不在每个页面重复写“格式不正确”。
- 业务 refinement 必须提供用户可执行的中文消息。
- 跨字段错误使用 `path` 定位到实际展示错误的字段。
- 错误消息不泄露账号是否存在、权限详情或其他敏感状态。

## 公共 presets 的准入条件

一个 Schema 进入 `zod-presets` 前应同时满足：

1. 至少两个项目存在相同规则。
2. 输入与输出语义稳定，不依赖单个接口。
3. 默认值不会因业务线而变化。
4. 名称能够准确说明适用范围。
5. 有边界测试和使用文档。

::: warning 不要过早公共化
“订单状态”“活动类型”“用户角色”等业务枚举应留在业务项目。它们看起来重复，但通常由不同服务端协议负责。
:::

## Review 检查项

- 是否区分 `z.input` 和 `z.output`。
- 是否重复实现了已有 preset。
- 是否包含隐藏副作用。
- 是否为数组、嵌套对象和空值补充测试。
- 是否能从字段名判断错误路径。
- 是否把业务规则错误地放进通用包。

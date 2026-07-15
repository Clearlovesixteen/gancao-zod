# 为什么封装 Zod

先给出结论：**Gancao Zod 不替代 Zod，也没有重新设计 Schema 语法。**

Zod 仍然负责定义 Schema、推导 TypeScript 类型、解析输入和执行数据转换。Gancao Zod 增加的是应用层约定：把 Zod 的解析结果变成团队可以跨框架复用的结果协议、错误结构和接入方式。

## 职责边界

| 能力 | 原生 Zod | Gancao Zod |
| --- | --- | --- |
| 定义 Schema | 核心能力 | 直接复用，不新增语法 |
| 类型推导 | `z.input`、`z.output`、`z.infer` | 完整保留 |
| 解析与转换 | `parse`、`safeParse`、transform、coerce | 内部调用并传递输出 |
| 失败结果 | `ZodError` 和 `ZodIssue[]` | 稳定的 `ValidationError[]` |
| 中文错误 | 可通过 Zod locale 或 error map 配置 | 内置 `zh-CN`，支持业务语言包 |
| 字段路径 | `PropertyKey[]` | `path` 加点分隔 `field` |
| React Hook Form | 需要 resolver | 提供统一 resolver |
| Express | 需要自行编写中间件 | 提供 body、query、params 中间件 |
| NestJS | 需要自行编写 Pipe 和装饰器 | 提供 Pipe 与参数装饰器 |
| 常用字段 | 由项目自行定义 | 提供分页、联系方式、日期和环境变量预设 |

可以把两者理解为：

```text
Zod          = Schema 引擎和解析器
Gancao Zod   = Zod + 团队结果协议 + 框架适配层
```

## 原生 `safeParse` 已经很好，为什么还要封装

Zod 的 `safeParse` 本身已经返回可辨识联合类型，因此 Gancao Zod 并不是为了“避免 try/catch”才存在。

```ts
const result = userSchema.safeParse(input);

if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error.issues);
}
```

问题通常出现在 `safeParse` 之后。一个团队往往还需要决定：

- HTTP API 应该返回什么错误结构。
- 数组字段路径如何映射到前端表单。
- Express 的 body、query 和 params 如何统一校验。
- NestJS 应该抛出什么异常响应。
- 中文和英文错误在哪里配置。
- 不同仓库是否使用同一套分页、手机号和环境变量规则。

如果每个应用分别实现这些逻辑，即使都使用 Zod，最终仍可能得到不同的错误协议。

## 封装解决了什么

### 1. 建立稳定的结果协议

原生失败结果包含 `ZodError`。它非常适合在 Zod 内部继续处理，但不一定适合作为跨服务、跨框架的公开协议。

Gancao Zod 将其转换为普通、可序列化的数据：

```ts
interface ValidationError {
  code: string;
  message: string;
  path: Array<string | number>;
  field: string;
  params?: Record<string, unknown>;
}
```

React 表单、HTTP 响应、日志和单元测试都可以依赖同一组字段，而不需要理解完整的 `ZodError` 对象。

### 2. 减少重复的框架胶水

不封装时，每个项目都可能重复编写 resolver、中间件、Pipe、异常格式化和类型声明扩展。

适配包把这些重复逻辑集中维护：

```text
React Hook Form ─┐
Express          ├─> zod-core ─> Zod Schema
NestJS           ┘
```

修复一次嵌套路径、语言回退或错误映射问题，所有接入方都能通过升级包获得修复。

### 3. 统一语言和业务消息

核心包默认提供 `zh-CN` 和 `en-US`，还允许注册业务语言包。Schema 中显式定义的 refinement 消息会原样保留。

```ts
registerLocale("product-zh", {
  invalid_type: () => "字段类型不符合产品协议",
});

validate(schema, input, { locale: "product-zh" });
```

语言策略不必散落在每个 API、表单和控制器中。

### 4. 保证转换后的数据进入业务层

Zod 的 trim、coerce、default 和 transform 仍由原生 Zod 执行。封装层负责确保输出继续传给框架下游：

- React Hook Form 的提交数据使用 `z.output<TSchema>`。
- Express 将转换后的值放入 `request.validated`。
- NestJS Pipe 将转换后的值交给控制器参数。

因此封装没有削弱 Zod 的输入、输出类型差异。

### 5. 沉淀团队公共规则

`zod-presets` 统一 ID、邮箱、手机号、分页、ISO 日期和环境变量规则。它们仍是普通 Zod Schema，可以自由组合，而不是隐藏在框架代码里。

## 使用前后对比

只使用 Zod 时，应用通常需要自行决定错误协议：

```ts
const result = schema.safeParse(input);

if (!result.success) {
  const errors = result.error.issues.map((issue) => ({
    code: issue.code,
    message: translate(issue),
    path: issue.path,
    field: issue.path.join("."),
  }));

  return response.status(400).json({ success: false, errors });
}
```

使用 Gancao Zod 后，协议由核心包统一：

```ts
const result = validate(schema, input, { locale: "zh-CN" });

if (!result.success) {
  return response.status(400).json(result);
}
```

框架适配包还会进一步省去调用和映射代码。

## 封装的成本

封装并不是没有代价：

- 项目多了一层依赖和版本管理。
- 工具包需要跟随 Zod 的主要版本变化持续维护。
- 归一化结果不是完整的 `ZodError` 实例，不能直接调用其专用方法。
- 团队需要接受统一错误协议，否则封装带来的收益有限。

因此这里采用的是薄封装：公开 `z`、保留标准 Zod Schema、保留 issue 参数，并允许项目在需要时直接使用原生 Zod。

## 什么时候应该使用

以下情况比较适合：

- 多个 TypeScript 应用需要共享校验规则。
- React、Express、NestJS 同时存在。
- API 错误格式需要保持长期稳定。
- 希望统一中文消息和字段路径。
- 团队正在重复编写 resolver、中间件或 Pipe。

## 什么时候直接使用 Zod 更简单

以下情况可以只使用原生 Zod：

- 项目很小，只有一个输入边界。
- `safeParse` 的结果已经满足使用需求。
- 业务必须直接操作完整 `ZodError`。
- 不需要统一框架接入、语言和公共预设。

::: tip 选择原则
先使用 Zod 定义正确的 Schema。只有当“跨应用的一致性”和“重复接入代码”成为真实问题时，再引入 Gancao Zod。封装应该减少团队复杂度，而不是为了封装而封装。
:::

# 快速开始

Gancao Zod 是一组围绕 Zod 4 构建的 TypeScript 包。它的核心目标不是增加另一套 Schema 语法，而是让同一份 Zod Schema 在浏览器、HTTP 服务和 NestJS 控制器中产生一致的结果。

如果你正在判断项目是否真的需要这一层封装，请先阅读[为什么封装 Zod](/guide/why-gancao-zod)。其中包含与原生 `safeParse` 的直接对比、适用场景和引入成本。

## 选择需要的包

| 使用场景 | 安装包 |
| --- | --- |
| 框架无关的校验和错误归一化 | `@clearlovesixteen/zod-core` |
| ID、邮箱、手机号、分页、日期和环境变量 | `@clearlovesixteen/zod-presets` |
| React Hook Form | `@clearlovesixteen/zod-react-hook-form` |
| Express 5 | `@clearlovesixteen/zod-express` |
| NestJS 11 | `@clearlovesixteen/zod-nestjs` |

所有包都将 `zod` 声明为 peer dependency。框架适配包还会声明对应框架为 peer dependency，因此使用方能够控制具体版本。

## 定义 Schema

可以从 `@clearlovesixteen/zod-core` 直接导入 `z`，也可以从 `zod` 导入。两种方式使用的是同一个 Zod API。

```ts
import { z } from "@clearlovesixteen/zod-core";

export const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  age: z.coerce.number().int().min(18),
});

export type CreateUserInput = z.input<typeof createUserSchema>;
export type CreateUser = z.output<typeof createUserSchema>;
```

输入类型允许 `age` 接收字符串，输出类型则保证 `age` 已经是数字。这种输入与输出的差异会被所有适配包保留。

## 执行校验

```ts
import { validate } from "@clearlovesixteen/zod-core";

const result = validate(createUserSchema, {
  name: "  Ada  ",
  email: "ADA@EXAMPLE.COM",
  age: "36",
});

if (!result.success) {
  console.error(result.errors);
  return;
}

console.log(result.data);
// { name: "Ada", email: "ada@example.com", age: 36 }
```

::: tip 类型收窄
只需要判断 `result.success`，TypeScript 就会把结果收窄为 `ValidationSuccess<T>` 或 `ValidationFailure`，不需要捕获异常。
:::

## 继续学习

- [为什么封装 Zod](/guide/why-gancao-zod)：了解与原生 Zod 的职责边界。
- [安装与认证](/guide/installation)：配置 GitHub Packages。
- [校验结果](/guide/validation-result)：理解成功、失败和类型推导。
- [错误处理](/guide/error-handling)：统一接口与表单错误。
- [从原生 Zod 迁移](/guide/migration-from-zod)：按页面渐进接入。
- [Schema 编写规范](/guide/schema-conventions)：统一团队命名和边界。
- [React Hook Form 最佳实践](/guide/react-hook-form-best-practices)：输入输出类型、字段数组和异步规则。
- [前端校验实验室](/examples/playground)：在线观察 resolver 的真实结果。
- [包文档](/packages/zod-core)：查看每个包的完整用法。

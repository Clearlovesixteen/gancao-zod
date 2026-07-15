# Gancao Zod 工具包

面向 Gancao React、Express 和 NestJS 应用的私有 TypeScript 数据校验包。本工具包在保持 Zod Schema 可组合性的同时，为不同应用边界提供统一、稳定的校验结果和错误格式。

**[在线技术文档与使用指南](https://clearlovesixteen.github.io/gancao-zod/)**

## 与原生 Zod 的区别

Gancao Zod **不是 Zod 的替代品或分支**。Schema 定义、类型推导、解析和数据转换仍由 Zod 完成；本工具包在其上增加团队级的结果协议、中文错误、常用预设，以及 React Hook Form、Express 和 NestJS 的统一适配。

原生 Zod 的 `safeParse` 已经可以安全校验数据，但失败结果携带 `ZodError`，不同应用通常还需要分别完成错误格式化、路径转换、语言处理和框架映射。Gancao Zod 将这些重复工作集中为稳定的 `ValidationResult<T>` 和 `ValidationError[]`，让前后端及不同框架共享相同的错误结构。

适合多应用、多框架或需要稳定接口错误协议的项目；单一小型项目如果直接使用 `safeParse` 已经足够，则不必增加这一层。完整说明见[为什么封装 Zod](https://clearlovesixteen.github.io/gancao-zod/guide/why-gancao-zod)。

## 包说明

| 包 | 用途 |
| --- | --- |
| `@clearlovesixteen/zod-core` | 校验结果、标准化错误、多语言支持和校验器工厂 |
| `@clearlovesixteen/zod-presets` | ID、联系方式、分页参数、ISO 日期和环境变量等预设 Schema |
| `@clearlovesixteen/zod-react-hook-form` | React Hook Form resolver |
| `@clearlovesixteen/zod-express` | Express body、query 和 params 校验中间件 |
| `@clearlovesixteen/zod-nestjs` | NestJS 校验管道和参数装饰器 |

## 从 GitHub Packages 安装

创建一个具有 `read:packages` 权限的 GitHub Token，然后在使用方项目的 `.npmrc` 中添加以下配置：

```ini
@clearlovesixteen:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

设置 Token 环境变量，并按需安装应用所需的包：

```bash
export GITHUB_PACKAGES_TOKEN=github_pat_xxx
npm install zod @clearlovesixteen/zod-core
```

各框架适配包将对应框架声明为 peer dependency。例如：

```bash
npm install zod react-hook-form @clearlovesixteen/zod-react-hook-form
npm install zod express @clearlovesixteen/zod-express
npm install zod @nestjs/common @clearlovesixteen/zod-nestjs
```

## 核心校验

```ts
import { validate, z } from "@clearlovesixteen/zod-core";

const userSchema = z.object({
  name: z.string().trim(),
  age: z.coerce.number().int().positive(),
});

const result = validate(userSchema, { name: "  Ada  ", age: "36" });

if (result.success) {
  console.log(result.data); // { name: "Ada", age: 36 }
} else {
  console.log(result.errors);
}
```

校验错误具有统一、稳定的数据结构：

```ts
interface ValidationError {
  code: string;
  message: string;
  path: Array<string | number>;
  field: string;
  params?: Record<string, unknown>;
}
```

异步 refinement 请使用 `validateAsync`；需要复用 Schema 校验器时，请使用 `createValidator`。

## 多语言

内置语言为 `zh-CN` 和 `en-US`，默认使用 `zh-CN`。

```ts
import { registerLocale, setDefaultLocale } from "@clearlovesixteen/zod-core";

registerLocale("gancao", {
  invalid_type: () => "值的类型不正确",
});

setDefaultLocale("gancao");
```

Schema 层级定义的自定义 refinement 错误消息会被保留。

## 框架使用示例

### React Hook Form

```ts
import { gancaoZodResolver } from "@clearlovesixteen/zod-react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({ email: z.email() });
const form = useForm({ resolver: gancaoZodResolver(schema) });
```

### Express

```ts
import { validateRequest } from "@clearlovesixteen/zod-express";
import { z } from "zod";

app.post(
  "/users/:id",
  validateRequest({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({ age: z.coerce.number().int() }),
  }),
  (request, response) => response.json(request.validated),
);
```

校验失败时，会将 `RequestValidationError` 传给 `next`。Express 5 通过 getter 暴露 `request.query`，因此转换后的 query 数据应通过 `request.validated.query` 获取。

### NestJS

```ts
import { ZodBody, ZodParam } from "@clearlovesixteen/zod-nestjs";
import { z } from "zod";

const paramsSchema = z.object({ id: z.string().min(1) });
const bodySchema = z.object({ age: z.coerce.number().int() });

@Post(":id")
create(
  @ZodParam(paramsSchema) params: z.output<typeof paramsSchema>,
  @ZodBody(bodySchema) body: z.output<typeof bodySchema>,
) {
  return { params, body };
}
```

## 本地开发

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run test:coverage
npm run check:packages
npm run audit:production
```

`check:packages` 会检查每个 workspace 的发布内容，并分别验证 ESM、CommonJS 和 TypeScript 使用方式。CI 同时要求运行时代码覆盖率达到既定阈值，且生产依赖不存在已知漏洞。

当包的变更会影响使用方时，请创建 changeset：

```bash
npm run changeset
```

将 changeset 合并到 `main` 后，Changesets 会更新发布 Pull Request。合并该发布 Pull Request 后，工作流会使用仓库的 `GITHUB_TOKEN` 将包发布到 GitHub Packages。

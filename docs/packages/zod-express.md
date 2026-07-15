# `@clearlovesixteen/zod-express`

校验 Express 请求的 `body`、`query` 和 `params`，并将转换后的值暴露到 `request.validated`。

## 安装

```bash
npm install zod express @clearlovesixteen/zod-express
```

## 校验请求

```ts
import { validateRequest } from "@clearlovesixteen/zod-express";
import { z } from "zod";

const schemas = {
  params: z.object({ id: z.string().trim().min(1) }),
  query: z.object({ includePosts: z.stringbool().default(false) }),
  body: z.object({ age: z.coerce.number().int().positive() }),
};

app.post(
  "/users/:id",
  validateRequest(schemas),
  (request, response) => {
    response.json(request.validated);
  },
);
```

成功后：

```ts
request.validated
// {
//   params: { id: "user-1" },
//   query: { includePosts: false },
//   body: { age: 36 }
// }
```

body 和 params 会被替换为转换后的值。Express 5 的 `request.query` 由 getter 暴露，因此转换后的 query 请从 `request.validated.query` 获取。

## 请求类型推导

```ts
import type { InferValidatedRequest } from "@clearlovesixteen/zod-express";

type Validated = InferValidatedRequest<typeof schemas>;

const validated = request.validated as Validated;
validated.body.age; // number
```

## 默认错误处理

任一来源失败时，中间件会调用：

```ts
next(new RequestValidationError(failure));
```

可以在全局错误中间件中统一响应：

```ts
import { RequestValidationError } from "@clearlovesixteen/zod-express";

app.use((error, _request, response, next) => {
  if (error instanceof RequestValidationError) {
    response.status(error.statusCode).json(error.failure);
    return;
  }

  next(error);
});
```

## 自定义失败处理

```ts
validateRequest(schemas, {
  locale: "zh-CN",
  onError: async (failure, request, response) => {
    await auditValidationFailure(request, failure);
    response.status(422).json(failure);
  },
});
```

配置 `onError` 后，由回调负责结束响应或继续中间件链；默认的 `RequestValidationError` 不再创建。

## 错误按来源分组

```ts
interface RequestValidationFailure {
  success: false;
  errors: {
    body?: ValidationError[];
    query?: ValidationError[];
    params?: ValidationError[];
  };
}
```

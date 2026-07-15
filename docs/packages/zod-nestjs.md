# `@clearlovesixteen/zod-nestjs`

为 NestJS 提供校验 Pipe 和参数装饰器，成功时返回 Zod 输出类型，失败时抛出包含统一错误数组的 HTTP 异常。

## 安装

```bash
npm install zod @nestjs/common @clearlovesixteen/zod-nestjs
```

## 参数装饰器

```ts
import {
  ZodBody,
  ZodParam,
  ZodQuery,
} from "@clearlovesixteen/zod-nestjs";
import { z } from "zod";

const paramsSchema = z.object({ id: z.string().trim().min(1) });
const querySchema = z.object({ page: z.coerce.number().int().min(1) });
const bodySchema = z.object({ age: z.coerce.number().int().positive() });

@Post(":id")
create(
  @ZodParam(paramsSchema) params: z.output<typeof paramsSchema>,
  @ZodQuery(querySchema) query: z.output<typeof querySchema>,
  @ZodBody(bodySchema) body: z.output<typeof bodySchema>,
) {
  return { params, query, body };
}
```

单个路由参数可以传入参数名：

```ts
findOne(@ZodParam("id", z.uuid()) id: string) {
  return this.users.findOne(id);
}
```

## 直接使用 Pipe

```ts
import { GancaoValidationPipe } from "@clearlovesixteen/zod-nestjs";

@Post()
create(
  @Body(new GancaoValidationPipe(bodySchema))
  body: z.output<typeof bodySchema>,
) {
  return body;
}
```

## 默认异常

校验失败时抛出 `BadRequestException`，响应体为：

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_format",
      "message": "格式不正确",
      "path": ["email"],
      "field": "email"
    }
  ]
}
```

## 自定义异常工厂

```ts
import { UnprocessableEntityException } from "@nestjs/common";

const pipe = new GancaoValidationPipe(schema, {
  locale: "zh-CN",
  exceptionFactory: (errors, metadata) =>
    new UnprocessableEntityException({
      source: metadata.type,
      errors,
    }),
});
```

`exceptionFactory` 会收到统一错误数组和 NestJS `ArgumentMetadata`，可以接入现有异常协议。

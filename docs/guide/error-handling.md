# 错误处理

统一错误结构的价值在于让 API、日志、表单和测试使用同一套字段语义。

## HTTP 接口响应

建议保留 `success` 和结构化错误数组，不要只返回拼接后的文本：

```ts
app.use((error, _request, response, next) => {
  if (!(error instanceof RequestValidationError)) {
    next(error);
    return;
  }

  response.status(error.statusCode).json(error.failure);
});
```

响应示例：

```json
{
  "success": false,
  "errors": {
    "body": [
      {
        "code": "invalid_type",
        "message": "类型不正确",
        "path": ["age"],
        "field": "age"
      }
    ]
  }
}
```

## 多语言

内置 `zh-CN` 和 `en-US`。可以为单次校验指定语言：

```ts
validate(schema, input, { locale: "en-US" });
```

也可以设置进程默认语言：

```ts
import { setDefaultLocale } from "@clearlovesixteen/zod-core";

setDefaultLocale("en-US");
```

注册业务语言包时，只需提供需要覆盖的 code；缺失项会回退到默认语言：

```ts
import { registerLocale } from "@clearlovesixteen/zod-core";

registerLocale("product-zh", {
  invalid_type: () => "字段类型与产品协议不一致",
  custom: (issue) => issue.message || "业务规则校验失败",
});
```

## 日志与监控

日志中建议记录 `code`、`field` 和请求上下文，不要把包含敏感输入的完整请求体直接写入日志。

```ts
logger.warn("request_validation_failed", {
  route: request.route.path,
  errors: error.failure.errors.body?.map(({ code, field }) => ({
    code,
    field,
  })),
});
```

## 安全边界

- 对客户端返回可操作的字段错误，不返回堆栈。
- 对未知异常继续交给框架的统一异常处理器。
- 对密码、Token 和身份证件等字段，只记录路径和错误代码。
- 业务 refinement 消息应避免泄露“用户名是否存在”等敏感状态。

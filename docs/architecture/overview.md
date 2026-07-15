# 技术架构

Gancao Zod 采用小型 monorepo 组织。`zod-core` 是唯一的结果协议层，其他包只负责把框架输入与输出连接到核心校验。

<ArchitectureMap />

## 包依赖关系

```text
                         ┌──────────────────────────────┐
                         │ @clearlovesixteen/zod-core   │
                         │ validate · locale · errors   │
                         └──────────────┬───────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 │                      │                      │
      ┌──────────▼──────────┐ ┌─────────▼─────────┐ ┌─────────▼─────────┐
      │ zod-react-hook-form │ │    zod-express    │ │    zod-nestjs    │
      │ Resolver adapter    │ │ Middleware adapter│ │ Pipe + decorators│
      └─────────────────────┘ └───────────────────┘ └───────────────────┘

      ┌──────────────────────────────┐
      │ @clearlovesixteen/zod-presets│  独立、可组合的 Zod Schema
      └──────────────────────────────┘
```

## 设计原则

### Schema 是唯一规则来源

框架适配层不重复实现字段规则。解析、转换、默认值和 refinement 全部由 Zod Schema 定义。

### 核心协议与框架解耦

`ValidationResult<T>` 和 `ValidationError` 不依赖 React、Express 或 NestJS，因此可以跨前后端复用，也可以直接用于单元测试。

### 转换后的数据继续向下游流动

成功结果使用 `z.output<TSchema>`。Express 会将转换后的 body 和 params 写回请求；NestJS 管道直接返回转换值；React Hook Form resolver 将其放入 `values`。

### 错误保留机器信息

语言消息之外还保留 `code`、结构化 `path`、扁平 `field` 和 issue 参数，调用方可以渲染文本，也可以做统计和自动化处理。

## 模块职责

| 模块 | 负责 | 不负责 |
| --- | --- | --- |
| `zod-core` | 执行 Schema、归一化错误、语言选择 | HTTP 状态码、表单状态 |
| `zod-presets` | 常见输入 Schema | 业务实体 Schema |
| `zod-react-hook-form` | Resolver 结果映射 | 表单 UI 与提交逻辑 |
| `zod-express` | 请求源校验与中间件错误 | 全局错误响应格式 |
| `zod-nestjs` | Pipe、装饰器与异常工厂 | 控制器业务逻辑 |

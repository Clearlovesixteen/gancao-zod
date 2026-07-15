---
layout: home

hero:
  name: Gancao Zod
  text: 一套结果格式，<br>贯穿所有应用边界
  tagline: 保留 Zod 的组合能力，<br>为 React、Express 与 NestJS 提供<br>统一的类型推导、数据转换和中文错误结构。
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/getting-started
    - theme: alt
      text: 前端实验室
      link: /examples/playground

features:
  - title: 稳定结果模型
    details: 成功返回类型安全的 data，失败返回可序列化的 ValidationError[]，不再让框架决定错误形状。
  - title: 五个可组合包
    details: 核心校验、常用预设、React Hook Form resolver、Express 中间件和 NestJS 管道按需安装。
  - title: 默认中文错误
    details: 内置 zh-CN 与 en-US，可注册业务语言包，同时保留 Schema 自定义 refinement 消息。
  - title: 输入即转换
    details: Zod 的 trim、coerce、default 和 transform 结果会完整传递到表单、请求对象或控制器参数。
---

## 从任意边界到统一结果

Gancao Zod 不替代 Zod。它把 Schema 作为唯一规则来源，在不同框架之间建立稳定的结果协议。

Zod 负责描述和解析数据，Gancao Zod 负责将解析结果转换为团队统一的应用协议。详细对比请阅读[为什么要封装 Zod](/guide/why-gancao-zod)。

<ArchitectureMap />

## 两分钟完成第一次校验

```bash
npm install zod @clearlovesixteen/zod-core
```

```ts
import { validate, z } from "@clearlovesixteen/zod-core";

const userSchema = z.object({
  name: z.string().trim().min(1),
  age: z.coerce.number().int().positive(),
});

const result = validate(userSchema, { name: "  Ada  ", age: "36" });

if (result.success) {
  result.data; // { name: "Ada", age: 36 }
} else {
  result.errors; // ValidationError[]
}
```

下一步阅读[快速开始](/guide/getting-started)，或者直接进入[前端校验实验室](/examples/playground)观察 React Hook Form resolver 的真实输出。

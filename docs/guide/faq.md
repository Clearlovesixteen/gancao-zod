# 常见问题

## 这是 Zod 的替代品吗？

不是。Schema、类型推导、解析、transform 和 refinement 都由 Zod 完成。Gancao Zod 只负责团队级结果协议、语言消息、预设和框架适配。

## 为什么不直接使用官方 `zodResolver`？

官方 resolver 对大多数项目已经足够，并且提供同步模式和 raw values。只有当团队需要与 API 共用错误协议、统一语言和预设规则时，Gancao resolver 才提供额外价值。详细比较见[迁移指南](/guide/migration-from-zod)。

## 可以混用吗？

可以。不同页面可以选择不同 resolver，同一份 Schema 不需要修改。建议以项目或业务模块为单位保持一致，避免同一个模块出现两套错误展示规则。

## 会影响 Zod 的类型推导吗？

不会。核心函数返回 `z.output<TSchema>`，React Hook Form 适配器分别保留 `z.input` 和 `z.output`。

## 为什么 resolver 总是异步？

这样同步和异步 refinement 可以使用同一个入口，团队不需要在接入时判断 Schema 模式。只需要同步模式或 raw values 时，官方 `zodResolver` 更合适。

## 是否应该把所有业务 Schema 放进 presets？

不应该。presets 只接收跨项目稳定的格式规则。业务枚举、接口状态和页面流程应由各业务项目维护。

## 如何覆盖中文消息？

使用 `registerLocale` 注册项目字典，再通过 `setDefaultLocale` 或单次校验的 `locale` 选择。Schema 中明确提供的 custom message 优先级最高。

## 能否逐页迁移？

可以。Gancao Zod 不改变 Schema，resolver 和 `validate` 都可以按应用边界逐步替换。

## 哪些项目不建议接入？

只有一两个简单表单、没有跨应用错误协议、直接使用 `safeParse` 已经足够的项目，不必增加这一层。

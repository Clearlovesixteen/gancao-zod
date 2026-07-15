# React Hook Form 完整示例

这个示例不是独立于仓库的文档片段。源代码保存在 `examples/react-hook-form`，并在 CI 中执行 TypeScript 检查，因此包 API 或类型变化时会立即失败。

## 覆盖能力

- `z.input` 与 `z.output` 分离，保留 `z.coerce.number()` 的真实输入类型。
- `useFieldArray` 动态联系人列表及嵌套错误路径。
- `superRefine` 将密码确认错误定位到指定字段。
- `zod-presets` 复用邮箱与手机号规则。
- `criteriaMode: "all"` 收集字段的全部错误。
- 提交函数只接收校验及转换后的 `ProfileFormOutput`。

## Schema

<<< ../../examples/react-hook-form/profileSchema.ts

## 表单组件

<<< ../../examples/react-hook-form/ProfileForm.tsx

## 在业务项目中接入

将 Schema 放在业务模块内，把通用格式规则留给 presets。页面组件只负责注册字段和展示错误，不应在 `onSubmit` 中重复校验或转换数据。

```tsx
<ProfileForm
  onSave={async (data) => {
    // data.age 已经是 number，email 已完成 trim 和小写转换。
    await updateProfile(data);
  }}
/>
```

运行 [前端校验实验室](/examples/playground) 可以直接观察这些转换和错误结构。

# 安装与认证

包发布在 GitHub Packages 的 npm registry 下，scope 为 `@clearlovesixteen`。

## 创建访问令牌

在 GitHub 中创建具有 `read:packages` 权限的 Personal Access Token。不要将 Token 写入仓库，也不要直接写进共享的 `.npmrc`。

## 配置 npm registry

在使用方项目根目录创建或更新 `.npmrc`：

```ini
@clearlovesixteen:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

在当前终端提供 Token：

```bash
export GITHUB_PACKAGES_TOKEN=github_pat_xxx
```

::: warning 避免泄露凭据
请将真实 Token 放在本机环境变量或 CI Secret 中。不要把带有明文 Token 的 `.npmrc` 提交到 Git。
:::

## 按需安装

核心包：

```bash
npm install zod @clearlovesixteen/zod-core
```

React Hook Form：

```bash
npm install zod react-hook-form @clearlovesixteen/zod-react-hook-form
```

Express：

```bash
npm install zod express @clearlovesixteen/zod-express
```

NestJS：

```bash
npm install zod @nestjs/common @clearlovesixteen/zod-nestjs
```

## CI 环境

将 Token 保存为 CI Secret，例如 `GITHUB_PACKAGES_TOKEN`，然后在安装依赖的步骤中注入：

```yaml
- name: Install dependencies
  run: npm ci
  env:
    GITHUB_PACKAGES_TOKEN: ${{ secrets.GITHUB_PACKAGES_TOKEN }}
```

## 版本要求

| 依赖 | 当前支持范围 |
| --- | --- |
| Node.js | `>=20` |
| TypeScript | `^5.7.0` |
| Zod | `^4.0.0` |
| React | `^16.8.0`、`^17`、`^18` 或 `^19`（由 React Hook Form 支持范围决定） |
| React Hook Form | `^7.0.0` |
| Express | `^5.0.0` |
| NestJS | `^11.0.0` |

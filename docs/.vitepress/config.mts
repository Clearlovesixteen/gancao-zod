import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Gancao Zod",
  description: "面向 TypeScript 应用的统一 Zod 校验工具包",
  lang: "zh-CN",
  base: "/gancao-zod/",
  lastUpdated: true,
  srcExclude: ["plans/**"],
  vite: {
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
      },
    },
  },
  markdown: {
    lineNumbers: true,
  },
  head: [
    ["meta", { name: "theme-color", content: "#2f6b4f" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Gancao Zod 文档" }],
    [
      "meta",
      {
        property: "og:description",
        content: "统一 React、Express 与 NestJS 的 Zod 校验结果和错误格式。",
      },
    ],
  ],
  themeConfig: {
    logo: {
      light: "/brand-mark-light.svg",
      dark: "/brand-mark-dark.svg",
      alt: "Gancao Zod",
    },
    siteTitle: "Gancao Zod",
    nav: [
      { text: "指南", link: "/guide/getting-started" },
      { text: "技术架构", link: "/architecture/overview" },
      { text: "包文档", link: "/packages/zod-core" },
      { text: "API", link: "/api/" },
    ],
    sidebar: [
      {
        text: "开始使用",
        items: [
          { text: "概览", link: "/guide/getting-started" },
          { text: "安装与认证", link: "/guide/installation" },
          { text: "校验结果", link: "/guide/validation-result" },
          { text: "错误处理", link: "/guide/error-handling" },
        ],
      },
      {
        text: "技术架构",
        items: [
          { text: "架构概览", link: "/architecture/overview" },
          { text: "校验数据流", link: "/architecture/validation-flow" },
        ],
      },
      {
        text: "包文档",
        items: [
          { text: "zod-core", link: "/packages/zod-core" },
          { text: "zod-presets", link: "/packages/zod-presets" },
          {
            text: "zod-react-hook-form",
            link: "/packages/zod-react-hook-form",
          },
          { text: "zod-express", link: "/packages/zod-express" },
          { text: "zod-nestjs", link: "/packages/zod-nestjs" },
        ],
      },
      {
        text: "示例与参考",
        items: [
          { text: "交互式校验", link: "/examples/playground" },
          { text: "API 参考", link: "/api/" },
        ],
      },
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "搜索文档", buttonAriaLabel: "搜索文档" },
          modal: {
            noResultsText: "没有找到相关内容",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
    outline: { level: [2, 3], label: "本页内容" },
    docFooter: { prev: "上一页", next: "下一页" },
    lastUpdated: { text: "最后更新于" },
    editLink: {
      pattern:
        "https://github.com/Clearlovesixteen/gancao-zod/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Clearlovesixteen/gancao-zod",
      },
    ],
    footer: {
      message: "基于 Zod 构建，面向稳定的应用边界。",
      copyright: "Copyright © 2026 Clearlovesixteen",
    },
  },
});

# HiSpark 工具资源下载页原型

用于展示开发工具分类、搜索、版本选择和编译工具链 ABI 联动选择的前端原型。基于 React、TypeScript、Vite 与 vinext，保留 Next.js App Router 文件结构。

[GitHub Pages 演示](https://github.sanchuanhehe.com/hispark-tools-portal/) · [原 Sites 设计原型](https://hisilicon-developer-tools-redesign.wyihe5220.chatgpt.site/)

## 功能

- 14 个根项目：12 项 HiSpark 工具，以及 GCC、Clang / LLVM 两类编译工具链。
- 按资源类型、运行环境与产品领域筛选，支持名称、标签和版本号搜索。
- 普通工具提供版本选择、历史版本、文档与下载入口。
- 编译器卡片联动 Base、海思发布版、Host ABI、Target ABI 和构建变体。
- 支持按芯片架构辅助选择 Target ABI，筛选状态可通过 URL 分享。

## 本地运行

需要 Node.js >=22.13.0 与 npm。

```bash
npm ci
npm run dev
```

按终端打印的地址访问。构建与运行生产服务：

```bash
npm run build
npm run start
```

类型检查：`npm run typecheck`。代码检查：`npm run lint`。

## 目录

```text
app/page.tsx       静态页面入口
app/catalog-client.tsx 页面交互、筛选与版本选择组件
app/globals.css    页面样式与字体
app/layout.tsx     页面元数据、社交预览与布局
data/catalog.ts   工具、版本及工具链安装包目录
public/           图片、字体和下载占位文件
vite.config.ts    独立 vinext / Vite 配置
```

新增普通工具修改 `data/catalog.ts` 的 `resources`；新增工具链安装包修改 `toolchainArtifacts`。分类选项、芯片辅助映射和筛选行为目前位于 `app/catalog-client.tsx`。部署到新域名时同步修改页面、布局、robots 和 sitemap 中的站点 URL。

## 原型边界

- 目录数据是设计原型快照，不代表官网最新软件版本，也不是完整兼容性清单。
- 所有软件包及校验文件下载均指向 `public/downloads/prototype-placeholder.bin`，该文件是 **0 字节占位文件**，不能用于安装或校验。
- 部分导航、版本说明和需求提交链接使用 `#` 占位。VS Code 安装入口与市场标识也应在正式使用前核验。
- 产品领域筛选暂时不关联 GCC/LLVM；全局排序只影响普通工具。日期排序使用字符串，正式接入数据前需规范化。
- 已移除未使用的 Sites 身份认证、D1 示例和专用部署配置；本仓库无需 Sites 凭据即可构建。

## 素材与权利

这是页面设计原型源码的公开展示仓库，不是海思官方软件下载站。HiSpark / HiSilicon 标识、工具图标及 HarmonyOS 字体来自原官网页面，相关商标和素材权利归各自权利人。`public/og.png` 为原型生成的社交分享图。

本仓库未授予第三方品牌、字体或软件包的再许可，也未为整体指定开源许可证。依赖包按各自许可证使用。公开可见不等于所有素材均可自由再分发。

## 验证与已知问题

本次源码整理已通过全新 `npm ci`、`npm run build` 和 `npm run typecheck`。`npm run lint` 当前报告 25 个错误、4 个警告，主要是原型占位链接、Effect 中的状态初始化、Hook 依赖及原生图片建议，尚未完成无障碍与状态管理整改。此仓库保留原型行为，不将其描述为生产就绪产品。

## GitHub Pages

推送到 `main` 后，GitHub Actions 自动执行类型检查与 `npm run build:pages`，将 `dist/client` 静态文件部署到 GitHub Pages。仓库路径为 `/hispark-tools-portal/`，站点沿用账号已配置的自定义域名。

本地 `npm run build` 仍构建服务器版本。`npm run build:pages` 为静态导出，预览时需将导出目录挂载在 `/hispark-tools-portal/`，无需部署 Node.js 服务。

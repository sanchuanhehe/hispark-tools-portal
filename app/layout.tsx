import type { Metadata } from "next";
import "./globals.css";

import { siteUrl, assetPath } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "海思开发工具资源下载｜HiSpark Studio、调试烧录与 GCC/LLVM 工具链",
  description: "集中查找海思 HiSpark Studio、VS Code 插件、AI 组件、BurnTool、DebugKits、VariableTrace、性能分析工具以及 GCC、Clang/LLVM 编译工具链，支持版本、Host 平台和 Target ABI 筛选。",
  applicationName: "HiSpark 开发工具资源中心",
  keywords: ["海思开发工具", "HiSpark Studio", "BurnTool", "DebugKits", "VariableTrace", "GCC 工具链", "Clang LLVM", "RISC-V 工具链", "开发工具下载"],
  alternates: { canonical: `${siteUrl}/` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: `${siteUrl}/`,
    siteName: "HiSpark 开发工具资源中心",
    title: "海思开发工具资源下载",
    description: "IDE、调试与烧录、性能分析，以及 GCC / Clang LLVM 工具链的一站式版本与 ABI 选择。",
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: "海思开发工具资源下载" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "海思开发工具资源下载",
    description: "按项目、版本、Host 平台和 Target ABI 查找海思开发工具与工具链。",
    images: [`${siteUrl}/og.png`],
  },
  icons: { icon: assetPath("/favicon.svg") },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}

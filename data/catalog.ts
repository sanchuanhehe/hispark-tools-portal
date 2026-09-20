export type Release = {
  version: string;
  installVersion?: string;
  fileName?: string;
  date: string;
  size: string;
  status: "推荐" | "维护" | "归档";
  note: string;
};

export type Resource = {
  id: string;
  category: "集成开发环境" | "插件与组件" | "调试与烧录" | "性能分析" | "开发工具链";
  family: "HiSpark 系列工具" | "Toolchain";
  title: string;
  description: string;
  os: "Windows" | "Linux";
  delivery: "下载软件包" | "插件市场下载";
  targets: string[];
  icon: string;
  docUrl: string;
  vscodeExtensionId?: string;
  coreVersion?: string;
  contents?: string[];
  referencePath?: string;
  releases: Release[];
};

export type ToolchainArtifact = {
  id: string;
  root: "GCC" | "Clang / LLVM";
  baseVersion: string;
  portalVersion: string;
  hostOs: "Windows" | "Linux";
  hostAbi: string;
  targetAbi: string;
  targetPlatform: "ARM32" | "AArch64" | "RISC-V";
  variant: "标准版" | "CodeSize";
  date: string;
  size: string;
  status: Release["status"];
  note: string;
};

export const resources: Resource[] = [
  {
    id: "studio",
    category: "集成开发环境",
    family: "HiSpark 系列工具",
    title: "HiSpark Studio",
    description: "适用于 MCU、星闪、穿戴系列芯片的 IDE 工具，集成实时变量监控与四合一调试器固件烧录。",
    os: "Windows",
    delivery: "下载软件包",
    targets: ["MCU", "星闪", "穿戴"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://docs.hisilicon.com/repos/fbb_ide/zh-CN/master/",
    releases: [
      { version: "26.06.1", date: "2026/6/30", size: "806 MB", status: "推荐", note: "当前推荐版本，包含实时变量监控与调试器固件烧录能力。" },
      { version: "26.03.1", date: "2026/3/31", size: "886 MB", status: "维护", note: "保留用于既有项目兼容与回归验证。" },
      { version: "25.12.1", date: "2025/12/31", size: "1005 MB", status: "归档", note: "历史归档版本，仅建议存量项目按需使用。" },
      { version: "25.09.1", date: "2025/9/30", size: "891 MB", status: "归档", note: "历史归档版本，仅建议存量项目按需使用。" },
    ],
  },
  {
    id: "studio-vscode",
    category: "插件与组件",
    family: "HiSpark 系列工具",
    title: "HiSpark Studio for VS Code",
    description: "适用于星闪、穿戴、广域系列芯片的 VS Code IDE 工具。",
    os: "Windows",
    delivery: "插件市场下载",
    targets: ["星闪", "穿戴", "广域"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://docs.hisilicon.com/repos/fbb_ide/zh-CN/master/",
    vscodeExtensionId: "HiSpark.hisparkai",
    releases: [
      { version: "26.06.1", installVersion: "26.6.1", date: "2026/6/30", size: "83 MB", status: "推荐", note: "当前 Marketplace 推荐版本。" },
      { version: "26.03.1", installVersion: "26.3.1", date: "2026/3/31", size: "—", status: "维护", note: "Marketplace 历史版本，用于既有项目兼容。" },
      { version: "26.02.1", installVersion: "26.2.1", date: "2026/2/6", size: "—", status: "归档", note: "Marketplace 历史归档版本。" },
      { version: "25.12.1", installVersion: "25.12.1", date: "2026/1/5", size: "—", status: "归档", note: "Marketplace 历史归档版本。" },
      { version: "25.09.1", installVersion: "25.9.1", date: "2025/9/18", size: "—", status: "归档", note: "Marketplace 历史归档版本。" },
    ],
  },
  {
    id: "studio-ai",
    category: "插件与组件",
    family: "HiSpark 系列工具",
    title: "HiSpark Studio AI for VS Code",
    description: "面向星闪、穿戴芯片开发的 AI 辅助工具，通过插件市场分发。",
    os: "Windows",
    delivery: "插件市场下载",
    targets: ["星闪", "穿戴", "AI"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://docs.hisilicon.com/repos/fbb_ide/zh-CN/master/",
    releases: [
      { version: "26.06.1", installVersion: "26.6.1", date: "2026/6/30", size: "13 MB", status: "推荐", note: "当前 Marketplace 推荐版本。" },
      { version: "26.04.1", installVersion: "26.4.1", date: "2026/5/7", size: "—", status: "维护", note: "Marketplace 历史版本，用于既有项目兼容。" },
      { version: "26.01.1", installVersion: "26.1.1", date: "2026/1/31", size: "—", status: "归档", note: "Marketplace 历史归档版本。" },
    ],
  },
  {
    id: "ai-component",
    category: "插件与组件",
    family: "HiSpark 系列工具",
    title: "HiSpark.AI 组件",
    description: "适用于星闪、穿戴芯片的 Linux AI 组件包。",
    os: "Linux",
    delivery: "下载软件包",
    targets: ["星闪", "穿戴", "AI"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://docs.hisilicon.com/repos/fbb_ide/zh-CN/master/",
    releases: [
      { version: "26.03.1", date: "2026/3/31", size: "1.9 GB", status: "推荐", note: "当前 Linux AI 组件推荐版本。" },
    ],
  },
  {
    id: "variable-trace",
    category: "性能分析",
    family: "HiSpark 系列工具",
    title: "VariableTrace",
    description: "适用于 MCU 系列芯片的实时变量监控工具。",
    os: "Windows",
    delivery: "下载软件包",
    targets: ["MCU", "实时变量"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://docs.hisilicon.com/repos/fbb_ide/zh-CN/master/",
    releases: [
      { version: "25.12.1", date: "2025/12/31", size: "45 MB", status: "推荐", note: "当前页面优选的实时变量监控工具版本。" },
      { version: "25.09.1", date: "2025/9/30", size: "29 MB", status: "归档", note: "用于既有 MCU 项目的历史兼容版本。" },
    ],
  },
  {
    id: "burn-tool",
    category: "调试与烧录",
    family: "HiSpark 系列工具",
    title: "BurnTool",
    description: "适用于全系芯片的在线烧录工具。",
    os: "Windows",
    delivery: "下载软件包",
    targets: ["全系芯片", "在线烧录"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://docs.hisilicon.com/repos/fbb_ide/zh-CN/master/",
    releases: [
      { version: "26.03.3", date: "2026/3/31", size: "62 MB", status: "推荐", note: "当前页面优选的在线烧录工具版本。" },
      { version: "25.12.2", date: "2025/12/31", size: "62 MB", status: "维护", note: "保留用于存量项目兼容。" },
      { version: "25.09.2", date: "2025/9/30", size: "25 MB", status: "归档", note: "历史归档版本。" },
    ],
  },
  {
    id: "debug-kits",
    category: "调试与烧录",
    family: "HiSpark 系列工具",
    title: "DebugKits",
    description: "适用于全系芯片的维测工具。",
    os: "Windows",
    delivery: "下载软件包",
    targets: ["全系芯片", "维测"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://docs.hisilicon.com/repos/fbb_ide/zh-CN/master/",
    releases: [
      { version: "26.03.3", date: "2026/3/31", size: "26 MB", status: "推荐", note: "当前页面优选的维测工具版本。" },
      { version: "25.12.2", date: "2025/12/31", size: "26 MB", status: "归档", note: "用于存量项目的历史兼容版本。" },
    ],
  },
  {
    id: "local-test",
    category: "性能分析",
    family: "HiSpark 系列工具",
    title: "HiSpark Local Test",
    description: "适用于短距、穿戴、家庭系列芯片的射频与功耗测试工具。",
    os: "Windows",
    delivery: "下载软件包",
    targets: ["短距", "穿戴", "家庭", "射频", "功耗"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://docs.hisilicon.com/repos/fbb_ide/zh-CN/master/",
    releases: [
      { version: "26.03.1", date: "2026/3/31", size: "30 MB", status: "推荐", note: "当前页面优选的本地射频、功耗测试版本。" },
    ],
  },
  {
    id: "aqtools",
    category: "性能分析",
    family: "HiSpark 系列工具",
    title: "AQTools",
    description: "音频质量调试工具，支持音频算法参数在线调试、音频效果及差异化调节与效果评估。",
    os: "Windows",
    delivery: "下载软件包",
    targets: ["视觉", "Hi3516CV610", "音频调试"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://gitcode.com/HiSpark/Hi3516CV610",
    contents: [
      "pc/AQTools_Vxxx.zip：PC 端调试工具，与板端 AQ 配合完成音频效果调试。",
      "board/Hi3516CV610_AQ_Vxxx.tgz：板端 AQ 调试组件，部署于单板提供音频调试接口。",
      "board/Hi3516CV610_AQ_ext_api_Vxxx.tgz：用于将 AQTools 部分功能编译到用户业务的小型化组件。",
    ],
    referencePath: "docs/06.工具中心/AQTools/音频质量调试工具使用指南",
    releases: [
      { version: "1.2.22.1", fileName: "AQTools.tar.gz", date: "—", size: "0 B（原型占位）", status: "推荐", note: "对应 Tools_V1.0.1 发布包；原型下载使用 0 字节静态占位文件。" },
    ],
  },
  {
    id: "pqtools",
    category: "性能分析",
    family: "HiSpark 系列工具",
    title: "PQTools",
    description: "图像质量调试工具，支持在线调参、点播抓帧、图像数据抓灌与流媒体预览。",
    os: "Windows",
    delivery: "下载软件包",
    targets: ["视觉", "Hi3516CV610", "图像调试"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://gitcode.com/HiSpark/Hi3516CV610",
    contents: [
      "pc/PQTools_Vxxx.zip：PC 端图像质量调试工具。",
      "pc/PQStream_Vxxx.zip：PC 端点播流工具，配合 PQTools 完成图像数据抓灌与预览。",
      "board/Hi3516CV610_PQ_Vxxx.tgz：板端 PQ 调试组件，部署于单板提供图像调试接口。",
      "board/Hi3516CV610_PQ_ext_api_Vxxx.tgz：用于将 PQTools 部分功能编译到用户业务的小型化组件。",
      "board/readme.txt：板端 PQ 部署、ini 配置、场景限制与抓灌数据配置说明。",
    ],
    referencePath: "docs/06.工具中心/PQTools/图像质量调试工具使用指南",
    releases: [
      { version: "1.2.60.2", fileName: "PQTools.tar.gz", date: "—", size: "0 B（原型占位）", status: "推荐", note: "对应 Tools_V1.0.1 发布包；原型下载使用 0 字节静态占位文件。" },
    ],
  },
  {
    id: "svp-npu",
    category: "开发工具链",
    family: "HiSpark 系列工具",
    title: "SVP_NPU",
    description: "SVP NNN PC 发布包，可将 Caffe、ONNX 等模型转换为 NPU 离线模型，并完成仿真、上板推理、精度比对和性能分析。",
    os: "Linux",
    delivery: "下载软件包",
    targets: ["视觉", "Hi3516CV610", "NPU"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://gitcode.com/HiSpark/Hi3516CV610",
    contents: [
      "SVP_NNN_PC_Vxxx.11.tgz：PC 端 SVP NNN 发布包。",
      "ATC：模型转换、算子调度、权值重排与内存优化工具。",
      "AMCT：支持 Caffe、PyTorch 的模型量化压缩工具。",
      "MindCmd：覆盖预处理、转换、仿真推理、上板推理、精度比对与性能分析的命令行工具。",
      "SVP ACL：基于 C 语言的图像分析应用开发 API 库。",
    ],
    referencePath: "docs/06.工具中心/SVP_NPU/",
    releases: [
      { version: "5.0.3.11", fileName: "SVP_PC.tar.gz", date: "—", size: "0 B（原型占位）", status: "推荐", note: "对应 Tools_V1.0.1 发布包；原型下载使用 0 字节静态占位文件。" },
    ],
  },
  {
    id: "tool-platform",
    category: "调试与烧录",
    family: "HiSpark 系列工具",
    title: "ToolPlatform",
    description: "面向视觉产品的统一烧录工具平台，提供工具启动与管理界面，并集成 BurnTool。",
    os: "Windows",
    delivery: "下载软件包",
    targets: ["视觉", "Hi3516CV610", "烧录"],
    icon: "/tool-suite-icon.png",
    docUrl: "https://gitcode.com/HiSpark/Hi3516CV610",
    contents: [
      "ToolPlatform-CAM-xxx-win32-x86_64.zip：Windows 端工具平台。",
      "BurnTool：支持空板烧写 boot、按地址烧写镜像和一键烧写全部镜像。",
    ],
    referencePath: "docs/06.工具中心/ToolPlatform/",
    releases: [
      { version: "5.7.14", fileName: "ToolPlatform.tar.gz", date: "—", size: "0 B（原型占位）", status: "推荐", note: "对应 Tools_V1.0.1 发布包；原型下载使用 0 字节静态占位文件。" },
    ],
  },
];

export const toolchainArtifacts: ToolchainArtifact[] = [
  { id: "gcc-10-arm-glibc-codesize-26061", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "26.06.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "ARM32 · glibc", targetPlatform: "ARM32", variant: "CodeSize", date: "2026/6/17", size: "117 MB", status: "推荐", note: "CodeSize 定制版本。" },
  { id: "gcc-10-arm-musl-codesize-26061", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "26.06.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "ARM32 · musl", targetPlatform: "ARM32", variant: "CodeSize", date: "2026/6/17", size: "88 MB", status: "推荐", note: "CodeSize 定制版本。" },
  { id: "gcc-10-aarch64-musl-26041", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "26.04.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "AArch64 · musl", targetPlatform: "AArch64", variant: "标准版", date: "2026/4/16", size: "93 MB", status: "推荐", note: "当前推荐版本。" },
  { id: "gcc-10-aarch64-musl-25091", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "25.09.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "AArch64 · musl", targetPlatform: "AArch64", variant: "标准版", date: "2025/9/30", size: "93 MB", status: "归档", note: "历史归档版本。" },
  { id: "gcc-10-arm-glibc-26041", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "26.04.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "ARM32 · glibc", targetPlatform: "ARM32", variant: "标准版", date: "2026/4/16", size: "438 MB", status: "推荐", note: "当前推荐版本。" },
  { id: "gcc-10-arm-glibc-25091", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "25.09.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "ARM32 · glibc", targetPlatform: "ARM32", variant: "标准版", date: "2025/9/30", size: "438 MB", status: "归档", note: "历史归档版本。" },
  { id: "gcc-10-arm-musl-26041", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "26.04.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "ARM32 · musl", targetPlatform: "ARM32", variant: "标准版", date: "2026/4/16", size: "273 MB", status: "推荐", note: "当前推荐版本。" },
  { id: "gcc-10-arm-musl-25091", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "25.09.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "ARM32 · musl", targetPlatform: "ARM32", variant: "标准版", date: "2025/9/30", size: "273 MB", status: "归档", note: "历史归档版本。" },
  { id: "gcc-10-aarch64-glibc-26041", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "26.04.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "AArch64 · glibc", targetPlatform: "AArch64", variant: "标准版", date: "2026/4/16", size: "108 MB", status: "推荐", note: "当前推荐版本。" },
  { id: "gcc-10-aarch64-glibc-25091", root: "GCC", baseVersion: "GCC 10.3", portalVersion: "25.09.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "AArch64 · glibc", targetPlatform: "AArch64", variant: "标准版", date: "2025/9/30", size: "108 MB", status: "归档", note: "历史归档版本。" },
  { id: "gcc-12-aarch64-musl-25121", root: "GCC", baseVersion: "GCC 12.3", portalVersion: "25.12.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "AArch64 · musl", targetPlatform: "AArch64", variant: "标准版", date: "2025/12/31", size: "97 MB", status: "推荐", note: "当前页面提供版本。" },
  { id: "gcc-12-arm-musl-25121", root: "GCC", baseVersion: "GCC 12.3", portalVersion: "25.12.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "ARM32 · musl", targetPlatform: "ARM32", variant: "标准版", date: "2025/12/31", size: "225 MB", status: "推荐", note: "当前页面提供版本。" },
  { id: "llvm-riscv-windows-26031", root: "Clang / LLVM", baseVersion: "LLVM 15.0.4", portalVersion: "26.03.1", hostOs: "Windows", hostAbi: "Windows · x86_64", targetAbi: "RISC-V 32 · musl", targetPlatform: "RISC-V", variant: "标准版", date: "2026/3/31", size: "618 MB", status: "推荐", note: "毕昇 LLVM 当前推荐发布版。" },
  { id: "llvm-riscv-windows-25091", root: "Clang / LLVM", baseVersion: "LLVM 15.0.4", portalVersion: "25.09.1", hostOs: "Windows", hostAbi: "Windows · x86_64", targetAbi: "RISC-V 32 · musl", targetPlatform: "RISC-V", variant: "标准版", date: "2025/9/30", size: "591 MB", status: "归档", note: "历史归档版本。" },
  { id: "llvm-riscv-aarch64-26031", root: "Clang / LLVM", baseVersion: "LLVM 15.0.4", portalVersion: "26.03.1", hostOs: "Linux", hostAbi: "Linux · AArch64", targetAbi: "RISC-V 32 · musl", targetPlatform: "RISC-V", variant: "标准版", date: "2026/3/31", size: "462 MB", status: "推荐", note: "毕昇 LLVM 当前推荐发布版。" },
  { id: "llvm-riscv-aarch64-25091", root: "Clang / LLVM", baseVersion: "LLVM 15.0.4", portalVersion: "25.09.1", hostOs: "Linux", hostAbi: "Linux · AArch64", targetAbi: "RISC-V 32 · musl", targetPlatform: "RISC-V", variant: "标准版", date: "2025/9/30", size: "438 MB", status: "归档", note: "历史归档版本。" },
  { id: "llvm-riscv-x86-26031", root: "Clang / LLVM", baseVersion: "LLVM 15.0.4", portalVersion: "26.03.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "RISC-V 32 · musl", targetPlatform: "RISC-V", variant: "标准版", date: "2026/3/31", size: "485 MB", status: "推荐", note: "毕昇 LLVM 当前推荐发布版。" },
  { id: "llvm-riscv-x86-25091", root: "Clang / LLVM", baseVersion: "LLVM 15.0.4", portalVersion: "25.09.1", hostOs: "Linux", hostAbi: "Linux · x86_64", targetAbi: "RISC-V 32 · musl", targetPlatform: "RISC-V", variant: "标准版", date: "2025/9/30", size: "461 MB", status: "归档", note: "历史归档版本。" },
];

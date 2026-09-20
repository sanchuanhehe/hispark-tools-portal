"use client";

import { useEffect, useMemo, useState } from "react";

import { resources, toolchainArtifacts, type Release, type Resource, type ToolchainArtifact } from "../data/catalog";

const toolchainRoots = ["GCC", "Clang / LLVM"] as const;
const siteUrl = "https://hisilicon-developer-tools-redesign.wyihe5220.chatgpt.site";
const prototypeDownloadUrl = "/downloads/prototype-placeholder.bin";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "HiSpark 开发工具资源中心",
      alternateName: "海思开发工具资源下载",
      url: `${siteUrl}/`,
      inLanguage: "zh-CN",
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/#webpage`,
      name: "海思开发工具资源下载",
      description: "集中查找 HiSpark Studio、调试烧录、性能分析以及 GCC、Clang/LLVM 编译工具链。",
      url: `${siteUrl}/`,
      isPartOf: { "@id": `${siteUrl}/#website` },
      inLanguage: "zh-CN",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 14,
        itemListElement: ["HiSpark Studio", "HiSpark Studio for VS Code", "HiSpark Studio AI for VS Code", "HiSpark.AI 组件", "VariableTrace", "BurnTool", "DebugKits", "HiSpark Local Test", "AQTools", "PQTools", "SVP_NPU", "ToolPlatform", "GCC", "Clang / LLVM（毕昇）"].map((name, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@type": "SoftwareApplication", name, url: `${siteUrl}/#resources`, applicationCategory: "DeveloperApplication" },
        })),
      },
    },
  ],
};

const categories = ["全部资源", "集成开发环境", "插件与组件", "调试与烧录", "性能分析", "开发工具链"] as const;
const targetOptions = ["全部", "MCU", "星闪", "穿戴", "广域", "视觉", "全系芯片"] as const;
const osOptions = ["全部", "Windows", "Linux"] as const;
const categorySlugs: Record<(typeof categories)[number], string> = { "全部资源": "all", "集成开发环境": "ide", "插件与组件": "plugins", "调试与烧录": "debug-flash", "性能分析": "performance", "开发工具链": "toolchain" };
const osSlugs: Record<(typeof osOptions)[number], string> = { "全部": "all", "Windows": "windows", "Linux": "linux" };
const targetSlugs: Record<(typeof targetOptions)[number], string> = { "全部": "all", "MCU": "mcu", "星闪": "nearlink", "穿戴": "wearable", "广域": "wide-area", "视觉": "vision", "全系芯片": "all-chips" };
const sortSlugs: Record<string, string> = { "推荐优先": "recommended", "最新发布": "latest", "名称排序": "name" };

type ToolchainUrlField = "baseVersion" | "portalVersion" | "hostAbi" | "targetAbi" | "variant";

function toolchainValueSlug(field: ToolchainUrlField, value: string) {
  if (field === "portalVersion") return value;
  if (field === "variant") return value === "标准版" ? "standard" : value.toLowerCase();
  return value.toLowerCase().replace(/\s*·\s*/g, "-").replace(/\s+/g, "-");
}

function toolchainParamMatches(field: ToolchainUrlField, actual: string, requested: string | null) {
  return !requested || requested === actual || requested === toolchainValueSlug(field, actual);
}

function updateUrlParams(changes: Record<string, string | null>, mode: "push" | "replace" = "push") {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  Object.entries(changes).forEach(([key, value]) => value ? url.searchParams.set(key, value) : url.searchParams.delete(key));
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (mode === "replace") window.history.replaceState({}, "", next);
  else window.history.pushState({}, "", next);
  window.dispatchEvent(new Event("catalogurlchange"));
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function resourceDownloadName(item: Resource, release: Release) {
  return release.fileName ?? `${item.id}-${release.installVersion ?? release.version}${item.vscodeExtensionId ? ".vsix" : ".zip"}`;
}

function resourceMatchesTarget(item: Resource, target: (typeof targetOptions)[number]) {
  if (target === "全部") return true;
  if (item.targets.includes(target)) return true;
  return item.targets.includes("全系芯片") && (["MCU", "星闪", "穿戴", "广域", "视觉"] as const).includes(target as "MCU" | "星闪" | "穿戴" | "广域" | "视觉");
}

function targetAbiGuidance(value: string) {
  if (value.startsWith("ARM32") && value.includes("glibc")) return "32 位 ARM 目标，运行环境使用 glibc；常见于完整 Linux 用户态。";
  if (value.startsWith("ARM32") && value.includes("musl")) return "32 位 ARM 目标，运行环境使用 musl；必须与 SDK 或 sysroot 的 libc 保持一致。";
  if (value.startsWith("AArch64") && value.includes("glibc")) return "64 位 ARM 目标，运行环境使用 glibc；适合对应的 AArch64 Linux 系统。";
  if (value.startsWith("AArch64") && value.includes("musl")) return "64 位 ARM 目标，运行环境使用 musl；必须与目标根文件系统匹配。";
  if (value.startsWith("RISC-V 32")) return "32 位 RISC-V 目标；当前已发布组合使用 musl。";
  return "请根据目标 CPU 架构和目标系统 C 库选择。";
}

type ChipProfile = {
  id: string;
  model: string;
  targetPrefix: "ARM32" | "AArch64" | "RISC-V 32";
  architecture: string;
  sourceUrl: string;
};

const chipProfiles: ChipProfile[] = [
  { id: "hi3516dv300", model: "Hi3516DV300", targetPrefix: "ARM32", architecture: "双核 Cortex-A7 / ARM 32 位", sourceUrl: "https://www.hisilicon.com/cn/about-us/press/news/competition-guide" },
  { id: "hi3516cv610", model: "Hi3516CV610", targetPrefix: "ARM32", architecture: "Cortex-A7 MP2 / ARM 32 位", sourceUrl: "https://developers.hisilicon.com/cn/caselibrary/surveillance_camera" },
  { id: "hi3516dv500", model: "Hi3516DV500", targetPrefix: "AArch64", architecture: "双核 Cortex-A55 / ARM 64 位", sourceUrl: "https://developers.hisilicon.com/cn/caselibrary/intelligent_helmet" },
  { id: "hi3861v100", model: "Hi3861V100", targetPrefix: "RISC-V 32", architecture: "RISC-V / 32 位", sourceUrl: "https://developers.hisilicon.com/cn/embeddedcompetition2024" },
  { id: "ws63v100", model: "WS63V100", targetPrefix: "RISC-V 32", architecture: "RV32IMFC / ILP32F", sourceUrl: "https://docs.hisilicon.com/repos/fbb_ws63/zh-CN/master/software/SDK%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E7%94%A8%E6%88%B7%E6%8C%87%E5%8D%97/WS63V100%20SDK%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%20%E7%94%A8%E6%88%B7%E6%8C%87%E5%8D%97.html" },
];

function ToolchainRootCard({ root, artifacts }: { root: (typeof toolchainRoots)[number]; artifacts: ToolchainArtifact[] }) {
  const [selection, setSelection] = useState(() => artifacts[0]);
  const [selectedChipId, setSelectedChipId] = useState("");
  const fields: ToolchainUrlField[] = ["baseVersion", "portalVersion", "hostAbi", "targetAbi", "variant"];
  const paramPrefix = root === "GCC" ? "gcc" : "llvm";
  const supportedChipProfiles = useMemo(() => chipProfiles.filter((profile) => artifacts.some((artifact) => artifact.targetAbi.startsWith(profile.targetPrefix))), [artifacts]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = {
      baseVersion: params.get(`${paramPrefix}_base`),
      portalVersion: params.get(`${paramPrefix}_release`),
      hostAbi: params.get(`${paramPrefix}_host`),
      targetAbi: params.get(`${paramPrefix}_target`),
      variant: params.get(`${paramPrefix}_variant`),
    };
    const requestedChip = params.get(`${paramPrefix}_chip`);
    setSelectedChipId(supportedChipProfiles.some((profile) => profile.id === requestedChip) ? requestedChip ?? "" : "");
    const matched = artifacts.find((artifact) => fields.every((field) => toolchainParamMatches(field, artifact[field], requested[field])));
    if (matched) {
      setSelection(matched);
      const paramSuffix: Record<ToolchainUrlField, string> = { baseVersion: "base", portalVersion: "release", hostAbi: "host", targetAbi: "target", variant: "variant" };
      const normalization: Record<string, string> = {};
      fields.forEach((field) => {
        if (requested[field]) {
          const canonical = toolchainValueSlug(field, matched[field]);
          if (requested[field] !== canonical) normalization[`${paramPrefix}_${paramSuffix[field]}`] = canonical;
        }
      });
      if (Object.keys(normalization).length) updateUrlParams(normalization, "replace");
    }
  }, [artifacts, paramPrefix, supportedChipProfiles]);

  function optionsFor(field: (typeof fields)[number]) {
    const fieldIndex = fields.indexOf(field);
    return unique(artifacts.filter((artifact) => fields.slice(0, fieldIndex).every((previous) => artifact[previous] === selection[previous])).map((artifact) => artifact[field]));
  }

  function choose(field: (typeof fields)[number], value: string, preserveChip = false) {
    const fieldIndex = fields.indexOf(field);
    const next = artifacts.find((artifact) => fields.slice(0, fieldIndex).every((previous) => artifact[previous] === selection[previous]) && artifact[field] === value);
    if (next) {
      setSelection(next);
      const urlChanges: Record<string, string | null> = {
        [`${paramPrefix}_base`]: toolchainValueSlug("baseVersion", next.baseVersion),
        [`${paramPrefix}_release`]: toolchainValueSlug("portalVersion", next.portalVersion),
        [`${paramPrefix}_host`]: toolchainValueSlug("hostAbi", next.hostAbi),
        [`${paramPrefix}_target`]: toolchainValueSlug("targetAbi", next.targetAbi),
        [`${paramPrefix}_variant`]: toolchainValueSlug("variant", next.variant),
      };
      if (field === "targetAbi" && !preserveChip) {
        setSelectedChipId("");
        urlChanges[`${paramPrefix}_chip`] = null;
      }
      updateUrlParams(urlChanges);
    }
  }

  function chooseChip(value: string) {
    setSelectedChipId(value);
    updateUrlParams({ [`${paramPrefix}_chip`]: value || null });
  }

  const current = artifacts.find((artifact) => fields.every((field) => artifact[field] === selection[field])) ?? artifacts[0];
  const selectedChip = supportedChipProfiles.find((profile) => profile.id === selectedChipId);
  const targetAbiOptions = optionsFor("targetAbi");
  const guidedTargetAbiOptions = selectedChip ? targetAbiOptions.filter((value) => value.startsWith(selectedChip.targetPrefix)) : targetAbiOptions;
  const rootLabel = root === "GCC" ? "GNU Compiler Collection" : "Clang / LLVM（毕昇）";
  const description = root === "GCC"
    ? "统一承载 GCC 交叉编译工具链；先选上游 Base 原始版本，再按海思发布版本和 ABI 定位安装包。"
    : "统一承载毕昇 Clang / LLVM 交叉编译工具链；宿主平台与目标 ABI 均在项目内联动选择。";

  return (
    <article className="toolchain-root-card">
      <div className="toolchain-heading">
        <div className="product-icon toolchain-icon"><img src="/toolchain-icon.png" alt="" /></div>
        <div>
          <div className="badges"><span className="recommend">{current.status}</span><span>编译工具链</span><span>{artifacts.length} 个可用包</span></div>
          <h3>{rootLabel}</h3>
          <p>{description}</p>
        </div>
        <a className="docs-link" href="https://docs.hisilicon.com/repos/fbb_toolchain/zh-CN/master/" target="_blank" rel="noreferrer">查看文档 ↗</a>
      </div>

      <div className="toolchain-config" aria-label={`${root} 工具链配置`}>
        <label><span>上游 Base 原始版本</span><select value={current.baseVersion} onChange={(event) => choose("baseVersion", event.target.value)}>{optionsFor("baseVersion").map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>海思发布版本</span><select value={current.portalVersion} onChange={(event) => choose("portalVersion", event.target.value)}>{optionsFor("portalVersion").map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>Host OS / ABI</span><select value={current.hostAbi} onChange={(event) => choose("hostAbi", event.target.value)}>{optionsFor("hostAbi").map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>Target ABI</span><select value={current.targetAbi} onChange={(event) => choose("targetAbi", event.target.value)}>{optionsFor("targetAbi").map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>构建变体</span><select value={current.variant} onChange={(event) => choose("variant", event.target.value)}>{optionsFor("variant").map((value) => <option key={value}>{value}</option>)}</select></label>
      </div>

      <details className="abi-helper">
        <summary><strong>Target ABI 选择助手</strong><span>可按芯片型号反查，也可直接查看当前可用项</span></summary>
        <div className="abi-helper-body">
          <section className="chip-reverse" aria-label="按芯片型号反查 Target ABI">
            <div className="abi-helper-intro"><strong><span>入口 A</span> 按芯片型号反查</strong><p>芯片型号用于确定 CPU 架构，再结合目标系统选择 libc。</p></div>
            <label><span>芯片型号</span><select value={selectedChipId} onChange={(event) => chooseChip(event.target.value)}><option value="">请选择芯片型号</option>{supportedChipProfiles.map((profile) => <option value={profile.id} key={profile.id}>{profile.model}</option>)}</select></label>
            {selectedChip && <div className="chip-match"><div><span>已识别架构</span><strong>{selectedChip.architecture}</strong><small>匹配 Target：{selectedChip.targetPrefix}</small></div><a href={selectedChip.sourceUrl} target="_blank" rel="noreferrer">查看芯片依据 ↗</a></div>}
          </section>
          <div className="abi-helper-intro direct"><strong><span>入口 B</span> 直接选择 Target ABI</strong><p>已根据前面的 Base、海思发布版本和 Host 过滤，只显示真实存在的安装包组合。</p></div>
          {guidedTargetAbiOptions.length > 0 ? <div className="abi-helper-options">
            {guidedTargetAbiOptions.map((value) => (
              <button type="button" className={current.targetAbi === value ? "active" : ""} key={value} onClick={() => choose("targetAbi", value, true)} aria-pressed={current.targetAbi === value}>
                <strong>{value}</strong><span>{targetAbiGuidance(value)}</span><em>{current.targetAbi === value ? "当前选择" : "应用此项 →"}</em>
              </button>
            ))}
          </div> : <div className="chip-no-match"><strong>当前组合没有匹配的 Target ABI</strong><p>请调整上游 Base、海思发布版本或 Host；也可以查看另一工具链根项目。</p></div>}
          <p className="abi-helper-tip"><strong>仍不确定？</strong> 查看 SDK、sysroot 或目标根文件系统：名称含 <code>musl</code> 选择 musl，工具链三元组或 sysroot 明确使用 GNU/glibc 时选择 glibc。ABI 必须与目标运行环境匹配，不能只按芯片名称猜测。</p>
        </div>
      </details>

      <div className="artifact-result">
        <div className="artifact-path"><span>已匹配安装包</span><strong>{current.baseVersion} / {current.portalVersion}</strong><code>{current.hostAbi} → {current.targetAbi} · {current.variant}</code></div>
        <dl><div><dt>发布时间</dt><dd>{current.date}</dd></div><div><dt>安装包</dt><dd>{current.size}</dd></div><div><dt>状态</dt><dd>{current.status}</dd></div></dl>
        <a className="primary" href={prototypeDownloadUrl} download={`${current.id}.tar.gz`}>下载软件包 <span>↓</span></a>
      </div>
      <p className="toolchain-note">{current.note} 选择项会自动排除不存在的 ABI 与版本组合，历史版本通过“海思发布版本”直接访问。</p>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("全部资源");
  const [target, setTarget] = useState<(typeof targetOptions)[number]>("全部");
  const [os, setOs] = useState<(typeof osOptions)[number]>("全部");
  const [sort, setSort] = useState("推荐优先");
  const [selectedVersions, setSelectedVersions] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Resource | null>(null);
  const [urlRevision, setUrlRevision] = useState(0);
  const [currentSearch, setCurrentSearch] = useState("");

  function applyUrlState() {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const osParam = params.get("os");
    const targetParam = params.get("target");
    const sortParam = params.get("sort");
    const categoryFromUrl = categories.find((item) => categorySlugs[item] === categoryParam || item === categoryParam) ?? "全部资源";
    const osFromUrl = osOptions.find((item) => osSlugs[item] === osParam || item === osParam) ?? "全部";
    const targetFromUrl = targetOptions.find((item) => targetSlugs[item] === targetParam || item === targetParam) ?? "全部";
    const sortFromUrl = Object.keys(sortSlugs).find((item) => sortSlugs[item] === sortParam || item === sortParam) ?? "推荐优先";
    const normalizedParams = new URLSearchParams(params);
    const normalizeFilter = (key: string, raw: string | null, canonical: string, isDefault: boolean) => {
      if (!raw) return;
      if (isDefault) normalizedParams.delete(key);
      else if (raw !== canonical) normalizedParams.set(key, canonical);
    };
    normalizeFilter("category", categoryParam, categorySlugs[categoryFromUrl], categoryFromUrl === "全部资源");
    normalizeFilter("os", osParam, osSlugs[osFromUrl], osFromUrl === "全部");
    normalizeFilter("target", targetParam, targetSlugs[targetFromUrl], targetFromUrl === "全部");
    normalizeFilter("sort", sortParam, sortSlugs[sortFromUrl], sortFromUrl === "推荐优先");
    if (normalizedParams.toString() !== params.toString()) {
      const normalizedSearch = normalizedParams.toString();
      window.history.replaceState({}, "", `${window.location.pathname}${normalizedSearch ? `?${normalizedSearch}` : ""}${window.location.hash}`);
    }
    const versions: Record<string, string> = {};
    resources.forEach((item) => {
      const requested = params.get(`version_${item.id}`);
      if (requested && item.releases.some((release) => release.version === requested)) versions[item.id] = requested;
    });
    setQuery(params.get("q") ?? "");
    setCategory(categoryFromUrl);
    setOs(osFromUrl);
    setTarget(targetFromUrl);
    setSort(sortFromUrl);
    setSelectedVersions(versions);
    setCurrentSearch(window.location.search);
    setUrlRevision((current) => current + 1);
  }

  useEffect(() => {
    const syncCurrentSearch = () => setCurrentSearch(window.location.search);
    applyUrlState();
    window.addEventListener("popstate", applyUrlState);
    window.addEventListener("catalogurlchange", syncCurrentSearch);
    return () => {
      window.removeEventListener("popstate", applyUrlState);
      window.removeEventListener("catalogurlchange", syncCurrentSearch);
    };
  }, []);

  function filterHref(changes: Record<string, string | null>) {
    const params = new URLSearchParams(currentSearch);
    Object.entries(changes).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key));
    const queryString = params.toString();
    return `/${queryString ? `?${queryString}` : ""}#resources`;
  }

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = resources.filter((item) => {
      const haystack = [item.title, item.description, item.category, item.family, item.os, ...item.targets, ...item.releases.map((r) => r.version)].join(" ").toLowerCase();
      return (!normalized || haystack.includes(normalized)) &&
        (category === "全部资源" || item.category === category) &&
        resourceMatchesTarget(item, target) &&
        (os === "全部" || item.os === os);
    });
    return [...result].sort((a, b) => {
      if (sort === "名称排序") return a.title.localeCompare(b.title, "zh-CN");
      if (sort === "最新发布") return b.releases[0].date.localeCompare(a.releases[0].date);
      return Number(b.releases[0].status === "推荐") - Number(a.releases[0].status === "推荐");
    });
  }, [query, category, target, os, sort]);

  const visibleToolchains = useMemo(() => {
    if (category !== "全部资源" && category !== "开发工具链") return [];
    const normalized = query.trim().toLowerCase();
    return toolchainRoots.map((root) => {
      const artifacts = toolchainArtifacts.filter((artifact) => {
        const haystack = [artifact.root, artifact.root === "Clang / LLVM" ? "BiSheng 毕昇 Clang LLVM" : "GNU GCC", artifact.baseVersion, artifact.portalVersion, artifact.hostAbi, artifact.targetAbi, artifact.variant].join(" ").toLowerCase();
        return artifact.root === root && (!normalized || haystack.includes(normalized)) && target === "全部" && (os === "全部" || artifact.hostOs === os);
      });
      return { root, artifacts };
    }).filter((entry) => entry.artifacts.length > 0);
  }, [query, category, target, os]);

  const resultCount = filtered.length + visibleToolchains.length;

  function categoryCount(item: (typeof categories)[number]) {
    if (item === "全部资源") return resources.length + toolchainRoots.length;
    if (item === "开发工具链") return resources.filter((resource) => resource.category === item).length + toolchainRoots.length;
    return resources.filter((resource) => resource.category === item).length;
  }

  function selectedRelease(item: Resource) {
    return item.releases.find((release) => release.version === selectedVersions[item.id]) ?? item.releases[0];
  }

  function changeQuery(value: string, mode: "push" | "replace" = "replace") {
    setQuery(value);
    updateUrlParams({ q: value || null }, mode);
  }

  function changeCategory(value: (typeof categories)[number]) {
    setCategory(value);
    updateUrlParams({ category: value === "全部资源" ? null : categorySlugs[value] });
  }

  function changeOs(value: (typeof osOptions)[number]) {
    setOs(value);
    updateUrlParams({ os: value === "全部" ? null : osSlugs[value] });
  }

  function changeTarget(value: (typeof targetOptions)[number]) {
    setTarget(value);
    updateUrlParams({ target: value === "全部" ? null : targetSlugs[value] });
  }

  function changeSort(value: string) {
    setSort(value);
    updateUrlParams({ sort: value === "推荐优先" ? null : sortSlugs[value] });
  }

  function chooseResourceVersion(item: Resource, version: string) {
    setSelectedVersions((current) => ({ ...current, [item.id]: version }));
    updateUrlParams({ [`version_${item.id}`]: version });
  }

  function resetFilters() {
    setQuery("");
    setCategory("全部资源");
    setTarget("全部");
    setOs("全部");
    setSort("推荐优先");
    updateUrlParams({ q: null, category: null, target: null, os: null, sort: null });
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="site-header">
        <a className="brand" href="#" aria-label="HiSpark 生态首页">
          <img src="/hispark-logo.png" alt="HiSpark 生态" />
        </a>
        <nav aria-label="主导航">
          <a href="#">首页</a><a href="#">案例中心</a><a href="#">解决方案</a>
          <a className="active" href="#">开发中心</a><a href="#">文档</a>
          <a href="#">论坛</a><a href="#">课堂</a><a href="#">活动</a>
        </nav>
        <div className="header-actions"><a href="#">心愿单</a><span className="search-glyph">⌕</span><a href="#">登录</a></div>
      </header>

      <section className="subnav" aria-label="开发中心二级导航">
        <a href="#">最新概览</a><a className="active" href="#">工具下载</a>
      </section>

      <section className="hero">
        <div className="container hero-inner">
          <nav className="crumb" aria-label="面包屑"><a href="https://developers.hisilicon.com/">首页</a><span>/</span><a href="https://developers.hisilicon.com/cn/developerTool">开发中心</a><span>/</span><strong>工具下载</strong></nav>
          <div className="hero-copy">
            <span className="hero-kicker">HISILICON DEVELOPER TOOLS</span>
            <h1>开发工具资源下载</h1>
            <p>按资源类型、目标芯片和运行环境快速定位适配版本，获得清晰的版本说明与历史归档。</p>
          </div>
          <label className="search-box">
            <span className="search-glyph">⌕</span>
            <input value={query} onChange={(event) => changeQuery(event.target.value)} aria-label="搜索资源" placeholder="搜索工具名称、芯片系列或版本号" />
            <span className="shortcut">⌘ K</span>
            <button type="button" onClick={() => changeQuery(query, "push")}>搜索</button>
          </label>
          <div className="hot-search"><span>热门：</span><button onClick={() => changeQuery("HiSpark Studio", "push")}>HiSpark Studio</button><button onClick={() => changeQuery("RISC-V", "push")}>RISC-V 工具链</button><button onClick={() => changeQuery("AI", "push")}>AI 组件</button></div>
        </div>
      </section>

      <section className="category-strip">
        <div className="container category-tabs" role="tablist" aria-label="资源分类">
          {categories.map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => changeCategory(item)} role="tab" aria-selected={category === item}>
              <span>{item === "全部资源" ? "资源" : item.slice(0, 2)}</span>
              <strong>{item}</strong>
              <small>{categoryCount(item)} 项</small>
            </button>
          ))}
        </div>
      </section>

      <section className="container catalog" id="resources">
        <aside className="filters" aria-label="筛选条件">
          <div className="filter-title"><strong>筛选条件</strong><button onClick={resetFilters}>重置</button></div>
          <fieldset>
            <legend>运行环境</legend>
            {osOptions.map((item) => <a className="filter-option" href={filterHref({ os: item === "全部" ? null : osSlugs[item] })} key={item} role="radio" aria-checked={os === item} onClick={(event) => { event.preventDefault(); changeOs(item); }}><span className={`radio-mark ${os === item ? "checked" : ""}`} aria-hidden="true" /><span>{item}</span><em>{item === "全部" ? resources.length + 2 : resources.filter((r) => r.os === item).length + toolchainRoots.filter((root) => toolchainArtifacts.some((artifact) => artifact.root === root && artifact.hostOs === item)).length}</em></a>)}
          </fieldset>
          <fieldset>
            <legend>产品领域</legend>
            {targetOptions.map((item) => <a className="filter-option" href={filterHref({ target: item === "全部" ? null : targetSlugs[item] })} key={item} role="radio" aria-checked={target === item} onClick={(event) => { event.preventDefault(); changeTarget(item); }}><span className={`radio-mark ${target === item ? "checked" : ""}`} aria-hidden="true" /><span>{item}</span></a>)}
          </fieldset>
          <div className="filter-note"><strong>找不到适配资源？</strong><p>可通过心愿单提交芯片、系统与版本需求。</p><a href="#">提交资源需求 →</a></div>
        </aside>

        <div className="results">
          <div className="result-toolbar">
            <div><h2>{category}</h2><span>共 {resultCount} 个根项目，版本与 ABI 在项目内选择</span></div>
            <label>排序<select value={sort} onChange={(event) => changeSort(event.target.value)}><option>推荐优先</option><option>最新发布</option><option>名称排序</option></select></label>
          </div>

          <div className="source-groups">
            <div><strong>HiSpark 系列工具</strong><span>提供一站式开发、测试服务，集成应用开发、烧录、调试、分析、测试等功能。</span><a href="https://docs.hisilicon.com/repos/fbb_ide/zh-CN/master/" target="_blank" rel="noreferrer">查看文档 ↗</a></div>
            <div><strong>Toolchain</strong><span>按 GCC / Clang-LLVM 根项目归并，上游 Base、海思发布版与 Host / Target ABI 联动选择。</span><a href="https://docs.hisilicon.com/repos/fbb_toolchain/zh-CN/master/" target="_blank" rel="noreferrer">查看文档 ↗</a></div>
          </div>

          <div className="resource-list">
            {filtered.map((item) => {
              const release = selectedRelease(item);
              return (
                <article className="resource-card" key={item.id}>
                  <div className="product-icon"><img src={item.icon} alt="" /></div>
                  <div className="product-main">
                    <div className="badges"><span className="recommend">{release.status}</span><span>{item.category}</span><span>{item.family}</span>{item.coreVersion && <span>{item.coreVersion}</span>}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="target-tags">{item.targets.map((chip) => <span key={chip}>{chip}</span>)}</div>
                    {item.contents && <details className="package-contents"><summary>查看包内内容（{item.contents.length}）</summary><ul>{item.contents.map((content) => <li key={content}>{content}</li>)}</ul>{item.referencePath && <p><span>参考文档</span><code>{item.referencePath}</code></p>}</details>}
                    <dl className="meta-grid">
                      <div><dt>运行环境</dt><dd>{item.os}</dd></div>
                      <div><dt>发布时间</dt><dd>{release.date}</dd></div>
                      <div><dt>安装包</dt><dd>{release.size}</dd></div>
                    </dl>
                  </div>
                  <div className="download-panel">
                    <label>Host 平台
                      <select value={item.os} disabled><option>{item.os}</option></select>
                    </label>
                    <label>选择版本
                      <select value={release.version} onChange={(event) => chooseResourceVersion(item, event.target.value)}>
                        {item.releases.map((option) => <option value={option.version} key={option.version}>{option.version} · {option.status}</option>)}
                      </select>
                    </label>
                    {item.vscodeExtensionId
                      ? release.status === "推荐"
                        ? <a className="primary" href={`vscode:extension/${item.vscodeExtensionId}`}>在 VS Code 中安装<span>↗</span></a>
                        : <a className="primary" href={prototypeDownloadUrl} download={resourceDownloadName(item, release)}>下载历史 VSIX<span>↓</span></a>
                      : <a className="primary" href={prototypeDownloadUrl} download={resourceDownloadName(item, release)}>{item.delivery}<span>↓</span></a>}
                    <button className="history" onClick={() => setHistory(item)}>{item.releases.length > 1 ? `历史版本（${item.releases.length - 1}）` : "发布详情"} <span>→</span></button>
                    {item.vscodeExtensionId && <a className="docs-link" href={`https://marketplace.visualstudio.com/items?itemName=${item.vscodeExtensionId}#version-history`} target="_blank" rel="noreferrer">浏览器查看版本历史 ↗</a>}
                    <a className="docs-link" href={item.docUrl} target="_blank" rel="noreferrer">查看文档 ↗</a>
                  </div>
                </article>
              );
            })}
            {visibleToolchains.map(({ root, artifacts }) => <ToolchainRootCard key={`${root}-${urlRevision}-${artifacts.map((item) => item.id).join("-")}`} root={root} artifacts={artifacts} />)}
            {resultCount === 0 && <div className="empty"><strong>未找到匹配资源</strong><p>请减少筛选条件，或尝试工具名称、芯片系列及版本号。</p><button onClick={resetFilters}>清除全部筛选</button></div>}
          </div>
        </div>
      </section>

      <section className="policy">
        <div className="container">
          <div className="policy-head"><div><span className="eyebrow">VERSION LIFECYCLE</span><h2>版本与生命周期</h2><p>历史版本独立归档，不与推荐版本混排；每个版本保留可核验的发布信息。</p></div><a href="#">查看完整版本策略 →</a></div>
          <div className="policy-grid">
            <article><span className="status-dot current" /><strong>当前推荐</strong><p>默认选中，展示完整适配条件、发布日期、包大小与版本说明。</p></article>
            <article><span className="status-dot maintained" /><strong>维护版本</strong><p>保留近两个稳定版本，用于存量项目兼容与缺陷回归。</p></article>
            <article><span className="status-dot archived" /><strong>历史归档</strong><p>通过产品内“历史版本”访问，下载前明确兼容与安全提示。</p></article>
            <article><span className="status-dot verified" /><strong>完整校验</strong><p>每个安装包附 SHA-256、文件大小、支持平台和变更记录。</p></article>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-main"><strong>HiSpark 生态</strong><div><a href="#">海思官网</a><a href="#">HiSpark 开源社区</a><a href="#">文档中心</a><a href="#">技术论坛</a><a href="#">关于我们</a></div></div>
        <div className="container footer-bottom"><span>©2025 华为技术有限公司</span><div><a href="#">法律声明</a><a href="#">隐私政策</a><a href="#">用户协议</a></div></div>
      </footer>

      {history && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setHistory(null); }}>
        <section className="history-modal" role="dialog" aria-modal="true" aria-labelledby="history-title">
          <div className="modal-head"><div><span>{history.category}</span><h2 id="history-title">{history.title} · 历史版本</h2></div><button aria-label="关闭" onClick={() => setHistory(null)}>×</button></div>
          <div className="modal-summary"><strong>推荐分发规则</strong><span>当前版本默认直达；维护版与归档版仅在此处展示。</span></div>
          <div className="release-list">
            {history.releases.map((release, index) => <article key={release.version}>
              <div className={`release-marker ${release.status === "推荐" ? "current" : release.status === "维护" ? "maintained" : ""}`} />
              <div className="release-info"><div><strong>{release.version}</strong><span className={`release-status status-${release.status}`}>{release.status}</span></div><p>{release.note}</p><small>发布于 {release.date} · {history.os} · {release.size}</small></div>
              <div className="release-actions">
                {history.vscodeExtensionId
                  ? release.status === "推荐"
                    ? <a className="install-version" href={`vscode:extension/${history.vscodeExtensionId}`} onClick={() => chooseResourceVersion(history, release.version)}>在 VS Code 中安装</a>
                    : <a className="install-version" href={prototypeDownloadUrl} download={resourceDownloadName(history, release)} onClick={() => chooseResourceVersion(history, release.version)}>下载此版本 VSIX</a>
                  : <a className="install-version" href={prototypeDownloadUrl} download={resourceDownloadName(history, release)} onClick={() => chooseResourceVersion(history, release.version)}>下载此版本</a>}
                <a href={history.vscodeExtensionId ? `https://marketplace.visualstudio.com/items?itemName=${history.vscodeExtensionId}#version-history` : "#"} target={history.vscodeExtensionId ? "_blank" : undefined} rel={history.vscodeExtensionId ? "noreferrer" : undefined}>版本说明</a>{index > 0 && !history.vscodeExtensionId && <a href={prototypeDownloadUrl} download={`${resourceDownloadName(history, release)}.sha256`}>SHA-256</a>}
              </div>
            </article>)}
          </div>
          <div className="archive-warning"><strong>历史版本提示</strong><p>{history.vscodeExtensionId ? "历史插件将下载对应版本的 VSIX；下载后在 VS Code 中执行“Extensions: Install from VSIX...”完成安装。" : "归档版本不再作为默认推荐。生产项目使用前应核对芯片、宿主系统、依赖和已知问题。"}</p></div>
        </section>
      </div>}
    </main>
  );
}

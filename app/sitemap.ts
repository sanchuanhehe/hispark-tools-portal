import type { MetadataRoute } from "next";

const siteUrl = "https://hisilicon-developer-tools-redesign.wyihe5220.chatgpt.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: siteUrl,
    lastModified: new Date("2026-08-18T00:00:00+08:00"),
    changeFrequency: "weekly",
    priority: 1,
  }];
}

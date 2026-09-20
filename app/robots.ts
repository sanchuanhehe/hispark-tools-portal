import type { MetadataRoute } from "next";

const siteUrl = "https://hisilicon-developer-tools-redesign.wyihe5220.chatgpt.site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

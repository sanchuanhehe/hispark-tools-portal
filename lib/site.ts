export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const siteUrl = basePath
  ? `https://github.sanchuanhehe.com${basePath}`
  : "https://hisilicon-developer-tools-redesign.wyihe5220.chatgpt.site";
export const assetPath = (path: string) => `${basePath}${path}`;

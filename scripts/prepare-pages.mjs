import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

// vinext beta.2 cannot prerender the App Router with basePath enabled.
// Export at /, then scope its generated asset references for project Pages.
const root = 'dist/client';
const base = '/hispark-tools-portal';
async function rewrite(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await rewrite(file);
    else if (/\.(html|js|css|json|rsc|txt|xml)$/.test(file)) {
      const text = await readFile(file, 'utf8');
      await writeFile(file, text.replaceAll('/_next/', `${base}/_next/`));
    }
  }
}
await rewrite(root);
const html = await readFile(`${root}/index.html`, 'utf8');
if (!html.includes('HiSpark Studio') || !html.includes('Target ABI')) {
  throw new Error('Exported homepage is missing catalog content');
}
for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (!url.startsWith('/')) continue;
  if (!url.startsWith(`${base}/`)) throw new Error(`Unscoped URL: ${url}`);
  const file = url.slice(base.length + 1).split(/[?#]/)[0];
  if (file) await access(path.join(root, file));
}
await writeFile(`${root}/.nojekyll`, '');
await writeFile(`${root}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: https://github.sanchuanhehe.com${base}/sitemap.xml\n`);
await writeFile(`${root}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://github.sanchuanhehe.com${base}/</loc></url></urlset>`);
console.log('Pages homepage and local asset references verified.');

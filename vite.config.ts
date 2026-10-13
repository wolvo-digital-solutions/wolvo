/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const DEFAULT_SITE_URL = 'https://wolvo.agency';

/** Section anchors listed in the sitemap (single-page launch, per the TRD). */
const SITEMAP_PATHS = ['/'];

/**
 * Injects the configured site URL into index.html and emits robots.txt and
 * sitemap.xml so SEO files always match the deployment domain.
 */
function seoFiles(siteUrl: string): Plugin {
  const url = siteUrl.replace(/\/+$/, '');
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`;
  const today = new Date().toISOString().slice(0, 10);
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    SITEMAP_PATHS.map(
      (p) => `  <url>\n    <loc>${url}${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ).join('\n') +
    `\n</urlset>\n`;

  return {
    name: 'wolvo-seo-files',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', url),
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/robots.txt') return void res.setHeader('Content-Type', 'text/plain').end(robots);
        if (req.url === '/sitemap.xml') return void res.setHeader('Content-Type', 'application/xml').end(sitemap);
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = env.VITE_SITE_URL || DEFAULT_SITE_URL;

  return {
    plugins: [react(), seoFiles(siteUrl)],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      assetsInlineLimit: 2048,
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  };
});

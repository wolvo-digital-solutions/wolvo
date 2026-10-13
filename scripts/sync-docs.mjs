import { cpSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const docsDir = resolve(__dirname, '../docs');

if (existsSync(distDir)) {
  if (existsSync(docsDir)) {
    rmSync(docsDir, { recursive: true, force: true });
  }
  mkdirSync(docsDir, { recursive: true });
  cpSync(distDir, docsDir, { recursive: true });
  console.log('✓ Successfully synced dist/ to docs/ for GitHub Pages compatibility');
}

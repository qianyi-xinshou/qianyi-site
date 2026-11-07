import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { postMarkdown } from './src/lib/markdown';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: 'https://qianyi-xinshou.github.io',
  base: process.env.GITHUB_ACTIONS ? '/qianyi-site' : '/',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: postMarkdown(fileURLToPath(new URL('.', import.meta.url))),
});

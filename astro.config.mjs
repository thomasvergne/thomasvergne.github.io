// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import tailwind from '@astrojs/tailwind';

import icon from 'astro-icon';

import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
    site: 'https://thomas-vergne.fr',
    integrations: [mdx(), sitemap(), tailwind(), icon(), compress()],
});
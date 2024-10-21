// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import tailwind from '@astrojs/tailwind';

import icon from 'astro-icon';

import compress from 'astro-compress';

import ShikiTheme from 'shiki/themes/github-dark-default.mjs';

import bonzaiTextMate from './public/bonzai.tmLanguage.json' assert { type: 'json' };

// https://astro.build/config
export default defineConfig({
    site: 'https://thomas-vergne.fr',
    integrations: [mdx(), sitemap(), tailwind(), icon(), compress()],
    markdown: {
      shikiConfig: {
        theme: {
          ...ShikiTheme,
          bg: '#171717',
          fg: '#d6d3d1',
        },
        langs: [
          {
            ...bonzaiTextMate,
            aliases: ['bonzai'],
          }
        ]
      }
    }
});
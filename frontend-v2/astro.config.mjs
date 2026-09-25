// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Set SITE_URL in .env to your actual deployment domain; defaults to production domain
  site: process.env.SITE_URL || 'https://swasthatrack.vercel.app',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
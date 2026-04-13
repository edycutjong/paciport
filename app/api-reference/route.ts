import { ApiReference } from '@scalar/nextjs-api-reference';

export const GET = ApiReference({
  url: '/openapi.json',
  theme: 'saturn',
  darkMode: true,
  metaData: {
    title: 'API Reference — PaciPort',
    description: 'PaciPort cross-exchange migration API. Delta-neutral position transfers in under 200ms.',
    ogTitle: 'PaciPort API Reference',
    ogDescription: '1-click perpetual futures migration API for Pacifica Exchange.',
  },
  favicon: '/logo.png',
  customCss: `
    :root {
      --scalar-color-1: #06b6d4;
      --scalar-color-accent: #06b6d4;
    }
    .scalar-app {
      font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
    }
    .dark-mode .scalar-app {
      background: #030308;
    }
  `,
});

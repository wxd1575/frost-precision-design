# Frost & Ice Aircon

Marketing site and admin dashboard for Frost & Ice Aircon, providing cooling, refrigeration and electrical services across South Africa.

Live site: https://frosticeaircon.co.za

## Tech stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (authentication and data)

## Local development

Requires Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
npm install
npm run dev
```

Environment variables (Supabase URL and keys) go in `.env.local`.

## Build

```sh
npm run build
```

The production build is written to `dist/`.

## Deployment

The site is deployed on Vercel; `vercel.json` rewrites all routes to `index.html` for client-side routing.

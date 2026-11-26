# AVERRA

Marketing site for AVERRA, an AI-supported platform for private and independent schools. The page presents one branded school experience for families, teachers, and administrators, designed to complement an existing learning management system.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm install
npm run build
```

## Environment

Copy `.env.example` to `.env` when you need local Supabase values. The committed example contains only publishable project values: the project URL and the publishable key.

`.env` is gitignored. Do not commit service-role keys, secret keys, or any other credential. Server code reads `SUPABASE_SERVICE_ROLE_KEY` from the environment at runtime, and that value stays out of the repository.

## Stack

Vite, React, TypeScript, TanStack Start, Tailwind CSS, Framer Motion, and Nitro with the Cloudflare preset.

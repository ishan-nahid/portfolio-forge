# Portfolio Forge

## Repository Context

Portfolio Forge is a React + TypeScript portfolio application with two data paths currently present in the codebase:

- **Public portfolio content path (Cloudflare):** portfolio sections (hero, stack, experience, footer, etc.) load via `/api/content`, backed by Cloudflare KV and merged with default fallback content.
- **Projects + admin CRUD path (Supabase):** the `/admin` page and project list currently perform direct Supabase CRUD queries.
- **Asset upload path (Cloudflare):** `/api/admin/upload` stores uploaded files in Cloudflare R2 and returns a public URL.

Core stack:

- React 18 + Vite + TypeScript
- React Router + TanStack Query
- Tailwind CSS + shadcn/ui
- Cloudflare Pages Functions (KV + R2 + Access-protected admin APIs)
- Supabase (database CRUD in current admin/project flows)

## Architecture Diagram

```mermaid
flowchart TD
    U[Visitor / Admin Browser] --> FE[React SPA\n(Vite + Router + Query)]

    FE -->|GET /api/content| CFPublic[Cloudflare Function\nfunctions/api/content.ts]
    CFPublic --> KV[(Cloudflare KV\nCONTENT_KV)]

    FE -->|GET/PUT /api/admin/content\nPOST /api/admin/upload| CFAdmin[Cloudflare Admin Functions\nAccess-protected]
    CFAdmin --> KV
    CFAdmin --> R2[(Cloudflare R2\nASSETS_BUCKET)]

    FE -->|Direct CRUD (projects/skills/experience/profile)| SB[(Supabase)]
```

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Landing page sections live one-per-file in src/components/sections and render via SectionShell (anchored id + data-tone); orb brightness reads data-tone="dark".
- All demo CTAs call openDemo() from src/context/DemoRequestContext so the single modal stays the one entry point.
- Background 3D orbs live in one fixed lazy-loaded canvas (src/components/orbs) rendered inside <main>; section backgrounds stay non-positioned and content sits at z-10 so orbs show over dark backgrounds but under text; scroll-driven configs are seeded so layout is stable.
- Interactive product demos live one-per-file in src/components/demos, registered in registry.ts with React.lazy and opened via DemoModal; they share AppShell primitives and hold only local state.
- Demo requests are validated with the zod schema in src/components/demo-request/schema.ts and inserted from the browser into demo_requests, which allows anonymous insert only (no reads) so leads are kept but never exposed.

# Implementation Plan: Tukarbuku

## Overview
Tukarbuku is a lightweight SvelteKit marketplace for buying and bartering used books through COD and in-app chat. The first vertical slice delivers the public discovery experience: a distinctive landing page, responsive book listing, search, listing-type/condition/city filters, and lightweight pagination-ready data handling.

## Architecture Decisions
- SvelteKit with SSR-friendly routes and progressively enhanced client interactions.
- Tailwind CSS is represented through a small local utility layer initially so the empty repository has no unnecessary dependency before the first install.
- Book data is isolated in `src/lib/data` while the server data layer uses Drizzle ORM with PostgreSQL.
- Public book discovery excludes DONASI from the UI while the future data model can retain it.
- Visual direction: “community shelf” editorial layout with ink navy, paper, apricot, and mint accents; typography uses system stacks for zero font-network cost.

## Task List

### Phase 1: Foundation & public discovery
- [x] Task 1: Create repository structure and implementation plan.
- [x] Task 2: Build the responsive public landing page with realistic seed listings.
- [x] Task 3: Add search, filters, result count, and lightweight pagination behavior.

### Checkpoint: Public discovery
- [ ] Verify the page at mobile and desktop widths.
- [ ] Run the available type/build checks after dependencies are installed.

### Phase 2: Data and identity
- [x] Task 4: Add Drizzle PostgreSQL schema and database utility.
- [ ] Task 5: Add Google-only Auth.js integration and protected route helpers.
- [ ] Task 6: Replace landing seed reads with paginated server queries.

### Phase 3: Listing and profile flows
- [ ] Task 7: Add public book detail route and login-gated actions.
- [ ] Task 8: Add profile setup and dashboard shell.
- [ ] Task 9: Add create/edit listing flow for JUAL and BARTER.

### Phase 4: Conversation and performance
- [ ] Task 10: Add persisted conversations/messages and WebSocket server contract.
- [ ] Task 11: Add dashboard chat UI with reconnect and unread states.
- [ ] Task 12: Audit image loading, SSR, accessibility, and mobile performance.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Empty repo has no installed dependencies | Medium | Keep first slice dependency-light and provide package metadata for the next setup step. |
| Image URLs may be unavailable offline | Medium | Use deterministic remote placeholders with clear image alt text; later replace with R2/Supabase WebP URLs. |
| Real-time chat requires a separately deployed process | High | Define the persistence contract before implementing the socket server. |

## Open Questions
- Which deployment target should be used for the Node SSR app and WebSocket process?
- Which image storage provider should be selected: Cloudflare R2 or Supabase Storage?
- What PostgreSQL connection environment is available for local development?

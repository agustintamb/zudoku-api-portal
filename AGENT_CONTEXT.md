# Agent Context — Zudoku Exploration Project

This file is written for AI agents picking up this project mid-stream.
It captures decisions made, technical internals discovered, and open questions.

---

## Project purpose

This is a **Zudoku exploration/test project**, not a production app. The goal is to
understand the full capability surface of Zudoku v0.93 by building working examples of
every major customization axis: routing, custom pages, theming, API versioning, MDX
components, header/layout customization, and slots.

The project is now a **hybrid app**: Home and Dashboard are custom pages with their own
header/footer (`layout: "none"`); Documentation, API Store and API docs use Zudoku's layout.
Dev server: `npm run dev` (http://localhost:3000).

---

## What Zudoku is

Zudoku is a **Vite-based documentation framework** (like Nextra or Starlight but for APIs).
It is config-driven via `zudoku.config.tsx`. Running `npm run dev` / `zudoku dev` invokes
the Zudoku CLI which wraps Vite internally with its own plugin.

**Critical:** The Vite plugin is NOT exposed externally. You cannot do:
```ts
import { zudokuPlugin } from "zudoku/vite"; // does not work for custom vite configs
```
`zudoku/vite` only exports `defineConfig` / `mergeConfig` helpers. The actual Vite plugin
lives in the CLI. This means **Zudoku cannot be embedded as a library inside a traditional
Vite app**. Zudoku IS the framework — you build within it.

---

## Architecture of the current project

### Navigation drives everything

`zudoku.config.tsx` → `navigation` array is the single source of truth for:
- Which sidebar items appear
- Which custom-page routes are registered
- Which category a route "belongs to" (determines sidebar content)

### Sidebar visibility rule

Zudoku's `Main.tsx` computes `hasNavigation` by traversing the navigation tree to find
which top-level category the current route belongs to:

```ts
// Simplified from node_modules/zudoku/src/lib/components/context/ZudokuContext.ts
const navItem = traverseNavigation(navigation, (item, parentCategories) => {
  if (item.type === "link") return; // links are skipped
  if (getItemPath(item) === pathname) {
    return parentCategories.at(0) ?? item; // returns outermost parent category
  }
});
// finalNavigation = topNavItem is a category ? topNavItem.items : []
// hasNavigation = finalNavigation.length > 0
```

**Consequence**: if a `custom-page` is at the root level of the navigation array (no
parent category), `hasNavigation` is false → no left sidebar → `<main>` gets
`col-span-full` → full-width layout. Header and footer still render.

API doc pages are NOT in the navigation array, but they get sidebar content from the
OpenAPI plugin via `getPluginNavigation`.

### Current navigation structure

```
navigation: [
  { type: "custom-page", path: "/home", display: "hide", layout: "none", element: <AppShell>… }
  { type: "custom-page", path: "/dashboard", display: "hide", layout: "none", element: <AppShell>… }
  { type: "category", label: "Documentation", items: [Getting Started, MDX Examples,
      Reference (/customization, /slots), Useful Links] }
  { type: "custom-page", path: "/api-store", label: "API Store" }   // Zudoku layout, no AppShell
]
```

- `display: "hide"` only hides the top-nav tab; the route is still registered.
- Top-nav order shown by Zudoku: Documentation, API Store. The custom `AppHeader` (Home and
  Dashboard only) shows Home, Dashboard, Docs, API Store.
- APIs live under `/api-store/*` so the "API Store" tab is highlighted (NavLink prefix match)
  on the store page and on every API docs/playground page:
  `/api-store/petstore`, `/api-store/blog` (v1/v2), `/api-store/auth`.
- `/` redirects to `/home`.

### Header, footer and site

- `header` is only `placements: { search: "center" }`; there is no `header.navigation` (the
  "Resources" dropdown was removed).
- `site: { showPoweredBy: false, logo, footer: {} }`.
- `src/components/AppFooter.tsx` has two variants, both fed by `footerData.ts`:
  full (inside `AppShell`, Home/Dashboard) and `slim` (thin single row, injected through the
  `footer-before` slot on Zudoku-layout pages). `src/styles/footer.css` (imported in the config)
  strips Zudoku's footer wrapper border/padding via `footer:has([data-app-footer])`.
- `Footer`, `Header` and `Layout` are not exported from `zudoku`, hence the custom footer.

---

## Key technical discoveries

### custom-page route registration

The working mechanism is `type: "custom-page"` in the navigation array:
```tsx
{ type: "custom-page", path: "/home", label: "Home", element: <LandingPage />, layout: "none" }
```

The `customPages` top-level config key (also in the schema) does NOT create routes — it's
wired to Zod validation but the route plugin only reads from the navigation array. Confirmed
by reading `node_modules/zudoku/src/lib/plugins/custom-pages/index.tsx`.

### layout prop on custom-page

```ts
layout: z.enum(["default", "none"]).optional()  // from InputNavigationSchema
```

- `"default"` (or omitted): wraps route with `<Layout>` (header + sidebar + footer)
- `"none"`: bare route — no layout wrapper at all

The `/home` page currently has `layout: "none"` (set manually by the user). This removes
the header/footer from the landing page, making it a blank canvas.

### API versioning

Native. Change `input` from a string to an array:
```tsx
{
  type: "file",
  path: "/api-store/blog",
  input: [
    { path: "v1", input: "./apis/blog-api.yaml", label: "v1.0" },
    { path: "v2", input: "./apis/blog-api-v2.yaml", label: "v2.0" },
  ],
}
```
Zudoku auto-generates:
- Routes `/api-store/blog/v1/...` and `/api-store/blog/v2/...`
- A `<Select>` dropdown in the API header (from `ApiHeader.tsx`)
- Version switching preserves the current tag if it exists in the target version

### zudoku/ui components

These are shadcn components. Import with PascalCase path (not lowercase):
```ts
import { Badge } from "zudoku/ui/Badge";   // correct
import { Card, CardContent, ... } from "zudoku/ui/Card";
import { Button } from "zudoku/ui/Button";
```
`zudoku/ui/badge.js` (lowercase) does NOT work — causes build error.

### zudoku/router

Re-exports everything from `react-router`. Use for navigation in custom pages:
```ts
import { Link, useNavigate, useParams, useLocation } from "zudoku/router";
```

### CSS custom properties for theming

Theme colors are set as CSS custom properties by Zudoku using the shadcn convention
(HSL without wrapper). Use in inline styles:
```ts
color: "hsl(var(--primary))"
background: "hsl(var(--muted))"
border: "1px solid hsl(var(--border))"
```
Available vars: `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`,
`--foreground`, `--background`, `--border`, `--accent`, `--accent-foreground`, `--card`.

### MDX components

Register in config, use in any `.mdx` without imports:
```tsx
// zudoku.config.tsx
mdx: { components: { CalloutBox, FeatureGrid } }

// any .mdx file — no import needed
<CalloutBox variant="info" title="Note">content</CalloutBox>
```

### Header customization

Three mechanisms:
1. **`header.navigation`**: links/dropdowns in the top header bar (not used currently)
2. **`header.placements`**: repositions search, auth, nav (`start | center | end`)
3. **`slots`**: injects React components into named layout positions

Slot names (from `node_modules/zudoku/src/lib/components/Slot.tsx`):
```
layout-before-head       before the entire <header> element
layout-after-head        after the entire <header> element
head-navigation-start    inside header, after logo
head-navigation-end      inside header, before theme switcher
top-navigation-before    before the top nav tabs row
top-navigation-after     after the top nav tabs row
content-before           before page content (inside <main>)
content-after            after page content (inside <main>)
navigation-before        before left sidebar navigation
navigation-after         after left sidebar navigation
footer-before            before footer content
footer-after             after footer content
mobile-top-bar-end       end of mobile top bar
```

Usage:
```tsx
slots: {
  "head-navigation-end": <MyComponent />,
}
```

### Slot visibility toggle (playground feature)

All slot demo components are controlled by a module-level store in `src/slots/slotVisibility.ts`.
State persists in `localStorage` (key: `zudoku-slots-visible`). Default: **false** (slots hidden).

```ts
// src/slots/slotVisibility.ts — useSyncExternalStore pattern, no Provider needed
export const slotStore = {
  subscribe(cb) { ... },
  getSnapshot() { return visible; },
  getServerSnapshot() { return false; },
  toggle() { visible = !visible; localStorage.setItem(...); notify(); },
};
```

Every slot component reads from the store:
```tsx
const visible = useSyncExternalStore(slotStore.subscribe, slotStore.getSnapshot, slotStore.getServerSnapshot);
if (!visible) return null;
return <SlotBar name="..." ... />;
```

The toggle button (`SlotToggle.tsx`) lives in `head-navigation-end` and is always visible.
It shows `"🔌 Slots: ON/OFF"` and renders the slot indicator for that position only when ON.

The slots are documented as an MDX page (`pages/slots.mdx`); there is no slots custom page.

### Footer requires site.footer

`<Footer>` returns `null` when `site.footer` is not configured — the `footer-before` and
`footer-after` slots are never mounted. The project sets `site.footer: {}` and uses
`footer-before` for `<AppFooter slim />` (see "Header, footer and site").

### Things that are NOT possible

- **i18n / string replacement**: All framework strings ("On this page", "Send", "Query
  Parameters", etc.) are hardcoded in the source. No config API exists for overriding them.
  The only options are CSS hacks or patching `node_modules`.
- **Full header replacement via config**: Can't replace the Header component through config.
  The workaround is `layout: "none"` on all custom routes + building a fully custom
  header/nav component. API doc pages would keep Zudoku's full layout.
- **Custom Vite config with Zudoku plugin**: Not possible — the Vite plugin is internal.

---

## The hybrid layout architecture

```
Custom pages (layout: "none", wrapped in <AppShell>: AppHeader + AppFooter):
  /home            → LandingPage (hero + ClientsCarousel)
  /dashboard       → DashboardPage

Zudoku-layout pages (header/sidebar by Zudoku, slim footer via slot):
  /api-store       → custom page (search + filter chips), label "API Store"
  /api-store/*     → OpenAPI docs/playground (petstore, blog v1/v2, auth)
  /introduction, /components-demo, /api-store-mdx, /customization, /slots → MDX docs
```

In custom pages, use `<Link to="...">` from `zudoku/router` for internal navigation.
`ClientsCarousel` is a pure CSS keyframes marquee (a `<style>` tag in the component). Libraries
were tried and dropped: `react-fast-marquee` is CJS-only and breaks Zudoku's SSR dev render
("Element type is invalid… got: object"); Embla autoscroll did not animate. Logos come from
`https://cdn.simpleicons.org/<slug>`.

---

## Files created / modified

### Modified
- `zudoku.config.tsx` — theme, navigation, versioned APIs under `/api-store/*`, header placements, slots, site/footer, MDX components, redirect `/` → `/home`

### Pages
- `src/pages/LandingPage.tsx` — `<LandingPage>` from `zudoku/components` plus `<ClientsCarousel />`
- `src/pages/ApiStorePage.tsx` — `zudoku/ui` Card/Badge/Button, search + filter chips
- `src/pages/DashboardPage.tsx` — useState + useNavigate demo
- `pages/components-demo.mdx`, `pages/api-store-mdx.mdx`, `pages/customization.mdx`, `pages/slots.mdx` (all 12 slots table)

### APIs
- `apis/blog-api.yaml` (v1), `apis/blog-api-v2.yaml`, `apis/auth-api.yaml`

### Components and styles
- `src/components/AppHeader.tsx` — `AppHeader` (Home, Dashboard, Docs, API Store) and `AppShell`
- `src/components/AppFooter.tsx` + `footerData.ts` — full and `slim` footer, single data source
- `src/components/ClientsCarousel.tsx` — CSS marquee of brand logos
- `src/components/CalloutBox.tsx`, `FeatureGrid.tsx` — custom MDX components
- `src/styles/footer.css` — neutralizes Zudoku's footer wrapper

### Slot system
- `src/slots/slotVisibility.ts` — module-level store, localStorage persistence
- `src/slots/SlotToggle.tsx` — toggle button in `head-navigation-end`
- `src/slots/SlotTag.tsx` — shared `<SlotTag>` and `<SlotBar>`
- `LayoutBeforeHead`, `HeadNavigationStart`, `TopNavigationBefore`, `TopNavigationAfter`, `NavigationBefore`, `NavigationAfter` — one demo bar/pill each
- Removed: `HeadNavigationEnd`, `FooterBefore`, `FooterAfter`, `SlotsDemoPage`, `HeaderSlotDemo`

---

## Open threads / things to explore

### High priority (user showed interest)

1. **Authentication** — Zudoku has native auth plugins for Clerk, Firebase, Supabase,
   Azure B2C, and OpenID. The `authentication` config key wires auth into the layout
   (Login button, profile dropdown). Could demo Clerk or a mock auth provider.

2. **Protected routes** — `protectedRoutes` config key exists in the schema. Works with
   auth plugins to gate pages.

3. **Visual confirmation** — most UI changes were only verified by HTTP status, not in a browser.



### Medium priority

4. **`header.navigation` with icons** — the schema accepts `icon` on nav items but it
   wasn't tested with actual Lucide icon names.

5. **`Slot.Source` inside a custom page** — worked earlier in the removed `SlotsDemoPage`
   (`content-before`/`content-after`, gated by `slotStore`). No longer present in the project.

6. **Search** — Zudoku has built-in search via `pagefind`. Works on built output, not dev.
   Haven't tested it.

7. **Native `catalogs` option / API catalog plugin** — tried `catalogs` (route `/api-reference`);
   it is applied only at dev-server startup (restart needed). Dropped in favor of the custom `ApiStorePage`.

8. **`options.showVersionSelect: "always"`** on an API with a single version — this would
   show the version selector even when there's only one version.

9. **`options.disablePlayground: true`** on an API — hides the "Try it" panel.

10. **`options.examplesLanguage`** — changes the default code snippet language.

11. **MDX frontmatter `toc: false`** — disables the right-side TOC for a specific MDX page.

12. **`navigationRules`** — config key that filters sidebar items based on auth state.
    Not tested.

13. **`build.remarkPlugins` / `build.rehypePlugins`** — custom remark/rehype plugins for
    MDX processing. Not tested.

### Architecture questions not yet answered

14. **Can a Zudoku custom page use `useParams`?** For dynamic routes like `/user/:id`.
    The `custom-page` schema only takes a static `path`. Unknown if wildcard/param paths work.

15. **Can you have two separate `<Zudoku>` instances on the same page?** The `<Zudoku>`
    component from `zudoku/components` could theoretically be embedded in a React app, but
    this wasn't tested.

16. **SSR / prerendering** — Zudoku has SSR support in its build. Not explored.

---

## Useful source paths in node_modules

```
node_modules/zudoku/src/
  config/validators/
    ZudokuConfig.ts           # Full config schema (Zod)
    InputNavigationSchema.ts  # Navigation item types incl. custom-page layout enum
    HeaderNavigationSchema.ts # header.navigation schema
  lib/
    components/
      Layout.tsx              # Root layout: Header + grid
      Main.tsx                # Sidebar visibility logic (hasNavigation)
      Header.tsx              # Header with all slot targets
      Slot.tsx                # All PredefinedSlotNames
      context/ZudokuContext.ts # useCurrentNavigation() — sidebar logic
    plugins/
      custom-pages/index.tsx  # Route registration from navigation
      openapi/
        ApiHeader.tsx         # Version selector dropdown
        util/getRoutes.tsx    # Version route generation + buildVersionSwitchUrl
      markdown/
        MdxPage.tsx           # TOC logic, "On this page" hardcoded label
        Toc.tsx               # TOC sidebar component
  app/processRoutes.tsx       # layout: "none" vs "default" handling
```

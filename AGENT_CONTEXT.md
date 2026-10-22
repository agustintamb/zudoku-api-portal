# Agent Context — Zudoku Exploration Project

This file is written for AI agents picking up this project mid-stream.
It captures decisions made, technical internals discovered, and open questions.

---

## Project purpose

This is a **Zudoku exploration/test project**, not a production app. The goal is to
understand the full capability surface of Zudoku v0.93 by building working examples of
every major customization axis: routing, custom pages, theming, API versioning, MDX
components, header/layout customization, and slots.

**Constraint held throughout**: existing files were never deleted, only added to.

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

API doc pages (`/api`, `/blog-api`, etc.) are NOT in the navigation array, but they get
sidebar content from the OpenAPI plugin via `getPluginNavigation`.

### Current navigation structure

```
navigation: [
  { type: "custom-page", path: "/home", ... }        // no sidebar
  { type: "custom-page", path: "/api-store", ... }   // no sidebar
  { type: "custom-page", path: "/dashboard", ... }   // no sidebar
  {
    type: "category", label: "Documentation",         // sidebar shows when in /introduction etc.
    items: [
      { type: "category", label: "Getting Started", items: ["/introduction"] },
      { type: "category", label: "MDX Examples", items: ["/components-demo", "/api-store-mdx"] },
      { type: "category", label: "Useful Links", ... },
    ]
  }
]
```

APIs are registered in `apis: [...]` only — not in `navigation`. Accessible via the
API Store page buttons.

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
  path: "/blog-api",
  input: [
    { path: "v1", input: "./apis/blog-api.yaml", label: "v1.0" },
    { path: "v2", input: "./apis/blog-api-v2.yaml", label: "v2.0" },
  ],
}
```
Zudoku auto-generates:
- Routes `/blog-api/v1/...` and `/blog-api/v2/...`
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
1. **`header.navigation`**: links/dropdowns in the top header bar
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

### Things that are NOT possible

- **i18n / string replacement**: All framework strings ("On this page", "Send", "Query
  Parameters", etc.) are hardcoded in the source. No config API exists for overriding them.
  The only options are CSS hacks or patching `node_modules`.
- **Full header replacement via config**: Can't replace the Header component through config.
  The workaround is `layout: "none"` on all custom routes + building a fully custom
  header/nav component. API doc pages would keep Zudoku's full layout.
- **Custom Vite config with Zudoku plugin**: Not possible — the Vite plugin is internal.

---

## The "full custom layout" architecture

The user was thinking about this at the end of the session:

> If I want a more customized app and don't want to be tied to that header, would it be
> better to use `layout: "none"` and build everything custom, navigating with React Router
> to the routes specified in the Zudoku config?

**Answer: Yes. This is a valid hybrid architecture:**

```
Custom pages (layout: "none"):
  /home            → fully custom React component, own header/nav
  /api-store       → fully custom
  /dashboard       → fully custom

Zudoku-managed pages (layout: "default" or omitted):
  /api             → Zudoku OpenAPI layout with sidebar
  /blog-api/v1     → same
  /auth-api        → same
  /introduction    → MDX page with sidebar
```

In custom pages, build your own `<header>` as a normal React component.
Use `<Link to="/api-store">` from `zudoku/router` for internal navigation.
Zudoku registers all the routes; you just navigate to them.

This was partially explored — `/home` has `layout: "none"` at session end, but a custom
header/nav has not been built yet.

---

## Files created / modified

### Modified
- `zudoku.config.tsx` — full rewrite adding theme, custom pages, versioned APIs, header config, slots, MDX components

### Created
- `apis/blog-api.yaml` — Blog API v1 (posts, comments, authors)
- `apis/blog-api-v2.yaml` — Blog API v2 (adds slug, coverImage, likes, featured endpoint, nested comments, socialLinks)
- `apis/auth-api.yaml` — Auth API (register, login, refresh, password reset)
- `pages/components-demo.mdx` — MDX demo of CalloutBox and FeatureGrid
- `pages/api-store-mdx.mdx` — API catalog in MDX
- `src/pages/LandingPage.tsx` — uses `<LandingPage>` from `zudoku/components`
- `src/pages/ApiStorePage.tsx` — uses `zudoku/ui` Card/Badge/Button
- `src/pages/DashboardPage.tsx` — useState + useNavigate demo
- `src/components/CalloutBox.tsx` — custom MDX component, 5 variants
- `src/components/FeatureGrid.tsx` — custom MDX component, responsive grid
- `src/components/HeaderSlotDemo.tsx` — badge + button injected via slot

---

## Open threads / things to explore

### High priority (user showed interest)

1. **Full custom layout architecture** — build a proper custom `<AppHeader>` with React
   nav, apply `layout: "none"` to all custom pages, verify API doc pages still work with
   their Zudoku layout. This is the next natural step.

2. **Authentication** — Zudoku has native auth plugins for Clerk, Firebase, Supabase,
   Azure B2C, and OpenID. The `authentication` config key wires auth into the layout
   (Login button, profile dropdown). Could demo Clerk or a mock auth provider.

3. **Protected routes** — `protectedRoutes` config key exists in the schema. Works with
   auth plugins to gate pages.

### Medium priority

4. **`header.navigation` with icons** — the schema accepts `icon` on nav items but it
   wasn't tested with actual Lucide icon names.

5. **`Slot.Source` inside a custom page** — slots can also be used from inside components,
   not just from config. A component can render `<Slot.Source name="footer-before">` to
   inject content into the layout from deep in the tree.

6. **Search** — Zudoku has built-in search via `pagefind`. Works on built output, not dev.
   Haven't tested it.

7. **API catalog plugin** (`zudoku/plugins/api-catalog`) — a Zudoku-native plugin for
   API catalog pages. Might replace the custom `ApiStorePage.tsx` with a config-driven version.

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

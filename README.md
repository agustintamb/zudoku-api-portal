# Zudoku Test — API Platform Showcase

A hands-on exploration project built on top of **Zudoku v0.93** to map the boundaries of the framework: what it handles natively, what requires workarounds, and how it composes with standard React/shadcn patterns.

## What's in here

### Three OpenAPI specs

| API | Path | Notes |
|-----|------|-------|
| Petstore | `/api` | Unmodified classic example |
| Blog API | `/blog-api` | **Versioned** — v1 and v2 with selector |
| Auth API | `/auth-api` | JWT auth flows |

### Custom React pages (no sidebar, full-width)

| Page | Path | Demonstrates |
|------|------|--------------|
| Landing | `/home` | `<LandingPage>` from `zudoku/components` |
| API Store | `/api-store` | `zudoku/ui` Card/Badge/Button (shadcn) |
| Dashboard | `/dashboard` | `useState`, `useNavigate` from `zudoku/router` |

### MDX documentation pages (with sidebar)

| Page | Path | Demonstrates |
|------|------|--------------|
| Introduction | `/introduction` | Base MDX page |
| Components Demo | `/components-demo` | Custom MDX components: `<CalloutBox>`, `<FeatureGrid>` |
| API Catalog (MDX) | `/api-store-mdx` | Same content as API Store but in MDX |

## Key findings

- **Sidebar**: Controlled by navigation structure, not a prop. Top-level nav items = no sidebar. Items nested in a `category` = sidebar shows that category's items.
- **Versioning**: Native. `input: [{ path, input, label }]` on any API triggers a version selector dropdown automatically.
- **UI components**: `zudoku/ui/*` exports shadcn components (PascalCase: `Badge`, `Card`, `Button`). They inherit the active theme.
- **Router**: `zudoku/router` re-exports React Router — `Link`, `useNavigate`, `useParams` all work in custom pages.
- **Custom MDX components**: Registered once in `mdx.components` in the config; available as JSX tags in every `.mdx` file without imports.
- **Header slots**: Named injection points (`head-navigation-end`, `layout-before-head`, etc.) accept arbitrary React components.
- **i18n**: Not supported — all framework strings are hardcoded in English.
- **Full custom layout**: Use `layout: "none"` on custom pages + build your own header/nav with React. API doc pages keep Zudoku's full layout.

## Stack

- [Zudoku](https://zudoku.dev) — documentation framework
- React + TypeScript
- shadcn/ui (via `zudoku/ui/*`)
- React Router (via `zudoku/router`)

## Run

```bash
npm install
npm run dev      # http://localhost:3001
```

## Project structure

```
zudoku.config.tsx       # Single source of truth: navigation, APIs, theme, slots, header
apis/
  openapi.yaml          # Petstore (original)
  blog-api.yaml         # Blog API v1
  blog-api-v2.yaml      # Blog API v2 (slug, coverImage, likes, featured endpoint)
  auth-api.yaml         # Auth API
pages/
  introduction.mdx      # Original intro page
  components-demo.mdx   # CalloutBox + FeatureGrid demo
  api-store-mdx.mdx     # API catalog in MDX
src/
  pages/
    LandingPage.tsx     # Uses zudoku/components <LandingPage>
    ApiStorePage.tsx    # Uses zudoku/ui Card, Badge, Button
    DashboardPage.tsx   # useState + useNavigate demo
  components/
    CalloutBox.tsx      # Custom MDX component (5 variants)
    FeatureGrid.tsx     # Custom MDX component (responsive grid)
    HeaderSlotDemo.tsx  # Injected into header via slots config
```

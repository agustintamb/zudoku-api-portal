import type { ZudokuConfig } from "zudoku";
import { LandingPage } from "./src/pages/LandingPage";
import { ApiStorePage } from "./src/pages/ApiStorePage";
import { DashboardPage } from "./src/pages/DashboardPage";
import { AppShell } from "./src/components/AppHeader";
import { CalloutBox } from "./src/components/CalloutBox";
import { FeatureGrid } from "./src/components/FeatureGrid";
import { LayoutBeforeHead } from "./src/slots/LayoutBeforeHead";
import { HeadNavigationStart } from "./src/slots/HeadNavigationStart";
import { SlotToggle } from "./src/slots/SlotToggle";
import { TopNavigationBefore } from "./src/slots/TopNavigationBefore";
import { TopNavigationAfter } from "./src/slots/TopNavigationAfter";
import { NavigationBefore } from "./src/slots/NavigationBefore";
import { NavigationAfter } from "./src/slots/NavigationAfter";
import { AppFooter } from "./src/components/AppFooter";
import "./src/styles/footer.css";

const config: ZudokuConfig = {
  // ─── Branding ─────────────────────────────────────────────────────────────
  site: {
    showPoweredBy: false,
    logo: {
      src: { light: "/logo-light.svg", dark: "/logo-dark.svg" },
      alt: "Zudoku",
      width: "130px",
      href: "/home",
    },
    // Zudoku only mounts footer slots when site.footer exists. The footer itself is
    // <AppFooter>, injected through the footer-before slot (see src/styles/footer.css).
    footer: {},
  },

  // ─── Theme ────────────────────────────────────────────────────────────────
  // Colors are HSL values without the hsl() wrapper — Zudoku wraps them in
  // CSS custom properties: --primary: 250 84% 54%; used as hsl(var(--primary)).
  // This is the same convention shadcn/ui uses.
  theme: {
    light: {
      primary: "250 84% 54%",
      primaryForeground: "0 0% 100%",
      accent: "250 84% 95%",
      accentForeground: "250 84% 30%",
      radius: "0.5rem",
    },
    dark: {
      primary: "250 84% 68%",
      primaryForeground: "0 0% 100%",
      accent: "250 84% 15%",
      accentForeground: "250 84% 80%",
    },
    fonts: {
      sans: "Geist",
      mono: "Geist Mono",
    },
  },

  // ─── Navigation ───────────────────────────────────────────────────────────
  // Custom pages at the TOP LEVEL of the array (no parent category) →
  // Zudoku creates the route but hasNavigation=false → no left sidebar,
  // the <main> takes col-span-full (full width). Header and footer still show.
  //
  // API docs are NOT listed here — they're only reachable via the API Store.
  // Their sidebar comes from the OpenAPI plugin automatically.
  navigation: [
    // ── Custom React pages — full-width, no sidebar ──
    {
      type: "custom-page",
      path: "/home",
      display: "hide",
      label: "Home",
      icon: "home",
      layout: "none",
      element: <AppShell><LandingPage /></AppShell>,
    },
    {
      type: "custom-page",
      path: "/dashboard",
      display: "hide",
      label: "Dashboard",
      icon: "bar-chart-2",
      layout: "none",
      element: <AppShell><DashboardPage /></AppShell>,
    },

    // ── Documentation — MDX pages with left sidebar ──
    {
      type: "category",
      label: "Documentation",
      items: [
        {
          type: "category",
          label: "Getting Started",
          icon: "sparkles",
          items: ["/introduction"],
        },
        {
          type: "category",
          label: "MDX Examples",
          icon: "file-text",
          items: ["/components-demo", "/api-store-mdx"],
        },
        {
          type: "category",
          label: "Reference",
          icon: "book-open",
          items: ["/customization", "/slots"],
        },
        {
          type: "category",
          label: "Useful Links",
          collapsible: false,
          icon: "link",
          items: [
            {
              type: "link",
              icon: "book",
              label: "Zudoku Docs",
              to: "https://zudoku.dev/docs/quickstart/",
            },
          ],
        },
      ],
    },

    // ── API Store — its tab stays active on /api-store/* (the API docs live under it) ──
    {
      type: "custom-page",
      path: "/api-store",
      label: "API Store",
      icon: "layers",
      element: <ApiStorePage />,
    },
  ],

  // ─── Header ───────────────────────────────────────────────────────────────
  // The header tabs come from the top-level `navigation` items above.
  header: {
    placements: {
      search: "center",
    },
  },

  // ─── Slots ────────────────────────────────────────────────────────────────
  // Slots inject arbitrary React content into named positions in the layout.
  // "head-navigation-end" renders inside the header bar, before the theme switcher.
  // Other available slot names: "head-navigation-start", "layout-before-head",
  // "layout-after-head", "top-navigation-before", "top-navigation-after",
  // "content-before", "content-after", "navigation-before", "navigation-after",
  // "footer-before", "footer-after"
  // Each slot component is self-identifying: it renders its own name and a
  // description of where it appears, so you can spot it instantly in the UI
  // without commenting/uncommenting. See src/slots/ for each component.
  slots: {
    "layout-before-head":    <LayoutBeforeHead />,
    "head-navigation-start": <HeadNavigationStart />,
    "head-navigation-end":   <SlotToggle />,
    "top-navigation-before": <TopNavigationBefore />,
    "top-navigation-after":  <TopNavigationAfter />,
    "navigation-before":     <NavigationBefore />,
    "navigation-after":      <NavigationAfter />,
    "footer-before":        <AppFooter slim />,
  },

  // ─── Redirects ────────────────────────────────────────────────────────────
  redirects: [{ from: "/", to: "/home" }],

  // ─── OpenAPI Specs ────────────────────────────────────────────────────────
  apis: [
    // Existing Petstore (unchanged)
    {
      type: "file",
      input: "./apis/openapi.yaml",
      path: "/api-store/petstore",
    },
    // Blog API with versioning — input is an array of { path, input, label }.
    // Zudoku automatically shows a version selector dropdown in the API header
    // and creates routes /api-store/blog/v1/... and /api-store/blog/v2/...
    // /api-store/blog redirects to the first version (v1).
    {
      type: "file",
      path: "/api-store/blog",
      input: [
        { path: "v1", input: "./apis/blog-api.yaml", label: "v1.0" },
        { path: "v2", input: "./apis/blog-api-v2.yaml", label: "v2.0" },
      ],
    },
    // NEW: Auth API
    {
      type: "file",
      input: "./apis/auth-api.yaml",
      path: "/api-store/auth",
    },
  ],

  // ─── MDX Components ───────────────────────────────────────────────────────
  // These become global JSX tags in every .mdx file — no imports needed.
  // Usage: <CalloutBox variant="info" title="Note">...</CalloutBox>
  //        <FeatureGrid columns={3} items={[...]} />
  mdx: {
    components: {
      CalloutBox,
      FeatureGrid,
    },
  },
};

export default config;

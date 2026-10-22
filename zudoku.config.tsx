import type { ZudokuConfig } from "zudoku";
import { LandingPage } from "./src/pages/LandingPage";
import { ApiStorePage } from "./src/pages/ApiStorePage";
import { DashboardPage } from "./src/pages/DashboardPage";
import { SlotsDemoPage } from "./src/pages/SlotsDemoPage";
import { CalloutBox } from "./src/components/CalloutBox";
import { FeatureGrid } from "./src/components/FeatureGrid";
import { LayoutBeforeHead } from "./src/slots/LayoutBeforeHead";
import { HeadNavigationStart } from "./src/slots/HeadNavigationStart";
import { SlotToggle } from "./src/slots/SlotToggle";
import { TopNavigationBefore } from "./src/slots/TopNavigationBefore";
import { TopNavigationAfter } from "./src/slots/TopNavigationAfter";
import { NavigationBefore } from "./src/slots/NavigationBefore";
import { NavigationAfter } from "./src/slots/NavigationAfter";
import { FooterBefore } from "./src/slots/FooterBefore";
import { FooterAfter } from "./src/slots/FooterAfter";

const config: ZudokuConfig = {
  // ─── Branding ─────────────────────────────────────────────────────────────
  site: {
    logo: {
      src: { light: "/logo-light.svg", dark: "/logo-dark.svg" },
      alt: "Zudoku",
      width: "130px",
      href: "/home",
    },
    // Footer only renders when site.footer is configured — otherwise the
    // <Footer> component returns null, and footer-before/footer-after slots
    // are never mounted regardless of what's in config.slots.
    footer: {
      copyright: "© 2026 Zudoku Test Project",
      columns: [
        {
          title: "Pages",
          links: [
            { label: "Home", href: "/home" },
            { label: "API Store", href: "/api-store" },
            { label: "Dashboard", href: "/dashboard" },
          ],
        },
        {
          title: "Documentation",
          links: [
            { label: "Introduction", href: "/introduction" },
            { label: "Components Demo", href: "/components-demo" },
            { label: "Slots Demo", href: "/slots-demo" },
            { label: "Customization", href: "/customization" },
          ],
        },
        {
          title: "APIs",
          links: [
            { label: "Petstore", href: "/api" },
            { label: "Blog API", href: "/blog-api" },
            { label: "Auth API", href: "/auth-api" },
          ],
        },
      ],
    },
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
      label: "Home",
      icon: "home",
      element: <LandingPage />,
    },
    {
      type: "custom-page",
      path: "/api-store",
      label: "API Store",
      icon: "layers",
      element: <ApiStorePage />,
    },
    {
      type: "custom-page",
      path: "/dashboard",
      label: "Dashboard",
      icon: "bar-chart-2",
      element: <DashboardPage />,
    },
    {
      type: "custom-page",
      path: "/slots-demo",
      label: "Slots Demo",
      icon: "plug",
      element: <SlotsDemoPage />,
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
          items: ["/customization"],
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
  ],

  // ─── Header ───────────────────────────────────────────────────────────────
  // header.navigation adds links/dropdowns to the top header bar.
  // header.placements controls where search, auth, and nav are positioned.
  // Slots inject React content into named positions inside the existing header.
  header: {
    navigation: [
      {
        label: "Dashboard",
        to: "/dashboard",
      },
      {
        label: "Resources",
        items: [
          {
            label: "Introduction",
            description: "Get started with the platform",
            to: "/introduction",
          },
          {
            label: "Components Demo",
            description: "Custom MDX components showcase",
            to: "/components-demo",
          },
          {
            label: "Zudoku Docs",
            to: "https://zudoku.dev/docs/quickstart",
            target: "_blank",
          },
        ],
      },
    ],
    placements: {
      navigation: "end",
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
    "footer-before":         <FooterBefore />,
    "footer-after":          <FooterAfter />,
  },

  // ─── Redirects ────────────────────────────────────────────────────────────
  redirects: [{ from: "/", to: "/home" }],

  // ─── OpenAPI Specs ────────────────────────────────────────────────────────
  apis: [
    // Existing Petstore (unchanged)
    {
      type: "file",
      input: "./apis/openapi.yaml",
      path: "/api",
    },
    // Blog API with versioning — input is an array of { path, input, label }.
    // Zudoku automatically shows a version selector dropdown in the API header
    // and creates routes /blog-api/v1/... and /blog-api/v2/...
    // /blog-api redirects to the first version (v1).
    {
      type: "file",
      path: "/blog-api",
      input: [
        { path: "v1", input: "./apis/blog-api.yaml", label: "v1.0" },
        { path: "v2", input: "./apis/blog-api-v2.yaml", label: "v2.0" },
      ],
    },
    // NEW: Auth API
    {
      type: "file",
      input: "./apis/auth-api.yaml",
      path: "/auth-api",
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

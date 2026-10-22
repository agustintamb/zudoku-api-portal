// Single source of the footer, rendered by <AppFooter> on every page.
export const FOOTER = {
  columns: [
    {
      title: "Pages",
      links: [
        { label: "Home", href: "/home" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "API Store", href: "/api-store" },
      ],
    },
    {
      title: "Documentation",
      links: [
        { label: "Introduction", href: "/introduction" },
        { label: "Components Demo", href: "/components-demo" },
        { label: "Slots", href: "/slots" },
        { label: "Customization", href: "/customization" },
      ],
    },
    {
      title: "APIs",
      links: [
        { label: "Petstore", href: "/api-store/petstore" },
        { label: "Blog API", href: "/api-store/blog" },
        { label: "Auth API", href: "/api-store/auth" },
      ],
    },
  ],
};

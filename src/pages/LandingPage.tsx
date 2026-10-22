import { LandingPage as ZudokuLandingPage } from "zudoku/components";

export function LandingPage() {
  return (
    <ZudokuLandingPage
      variant="hero"
      eyebrow="API Platform v2.0"
      title="Build faster with our APIs"
      description="Explore interactive API documentation, test endpoints in real-time, and integrate in minutes. Three APIs available — Petstore, Blog, and Auth."
      actions={[
        { label: "Browse APIs", href: "/api-store", variant: "primary" },
        { label: "Read the Docs", href: "/introduction", variant: "outlined" },
      ]}
    />
  );
}

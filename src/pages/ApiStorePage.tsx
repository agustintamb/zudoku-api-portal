import { Link } from "zudoku/router";

// zudoku/ui/* exports shadcn components — these are the same shadcn components
// Zudoku uses internally, so they inherit the active theme automatically.
import { Badge } from "zudoku/ui/Badge";
import { Button } from "zudoku/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "zudoku/ui/Card";

type ApiEntry = {
  id: string;
  name: string;
  description: string;
  version: string;
  path: string;
  status: "stable" | "beta" | "deprecated";
  category: string;
  endpoints: number;
  tags: string[];
};

const APIs: ApiEntry[] = [
  {
    id: "petstore",
    name: "Petstore API",
    description:
      "The classic Swagger Petstore example. CRUD operations for pets, store inventory, and user management.",
    version: "3.0.2",
    path: "/api",
    status: "stable",
    category: "Example",
    endpoints: 20,
    tags: ["pets", "store", "users"],
  },
  {
    id: "blog",
    name: "Blog API",
    description:
      "Manage blog posts, comments, and author profiles. Supports pagination, filtering by tag or author. Versioned — v1 and v2 available.",
    version: "v1 / v2",
    path: "/blog-api",
    status: "stable",
    category: "Content",
    endpoints: 11,
    tags: ["posts", "comments", "authors"],
  },
  {
    id: "auth",
    name: "Auth API",
    description:
      "JWT authentication service. Register, login, token refresh, password reset, and profile management.",
    version: "2.0.0",
    path: "/auth-api",
    status: "stable",
    category: "Security",
    endpoints: 8,
    tags: ["jwt", "oauth", "users"],
  },
];

const statusVariant: Record<ApiEntry["status"], "default" | "secondary" | "warning" | "destructive"> = {
  stable: "default",
  beta: "warning",
  deprecated: "destructive",
};

export function ApiStorePage() {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2.5rem 1.5rem",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "hsl(var(--primary))",
            marginBottom: "0.5rem",
          }}
        >
          API Catalog
        </p>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            marginBottom: "0.75rem",
          }}
        >
          Available APIs
        </h1>
        <p style={{ color: "hsl(var(--muted-foreground))", maxWidth: "560px" }}>
          Browse and explore all available API references. Each API includes interactive documentation, request/response schemas, and a live sandbox.
        </p>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          padding: "1rem 1.25rem",
          borderRadius: "0.5rem",
          background: "hsl(var(--muted))",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Total APIs", value: APIs.length },
          { label: "Total Endpoints", value: APIs.reduce((s, a) => s + a.endpoints, 0) },
          { label: "Stable", value: APIs.filter((a) => a.status === "stable").length },
          { label: "Categories", value: new Set(APIs.map((a) => a.category)).size },
        ].map(({ label, value }) => (
          <div key={label}>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "hsl(var(--foreground))",
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* API Grid — uses zudoku/ui Card and Badge (shadcn) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {APIs.map((api) => (
          <Card key={api.id}>
            <CardHeader>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <CardTitle>{api.name}</CardTitle>
                <Badge variant={statusVariant[api.status]}>
                  {api.status}
                </Badge>
              </div>
              <CardDescription>{api.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  marginBottom: "1rem",
                }}
              >
                {api.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  fontSize: "0.8rem",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                <span>
                  <strong style={{ color: "hsl(var(--foreground))" }}>v{api.version}</strong>{" "}
                  Version
                </span>
                <span>
                  <strong style={{ color: "hsl(var(--foreground))" }}>{api.endpoints}</strong>{" "}
                  Endpoints
                </span>
                <span>
                  <strong style={{ color: "hsl(var(--foreground))" }}>{api.category}</strong>
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <Button asChild style={{ width: "100%" }}>
                <Link to={api.path}>View Docs →</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Footer note */}
      <p
        style={{
          marginTop: "3rem",
          fontSize: "0.8rem",
          color: "hsl(var(--muted-foreground))",
          textAlign: "center",
        }}
      >
        This page is a{" "}
        <code style={{ fontFamily: "monospace" }}>customPage</code> using{" "}
        <code style={{ fontFamily: "monospace" }}>zudoku/ui</code> Card, Badge, and Button —
        the same shadcn components Zudoku uses internally.
      </p>
    </div>
  );
}

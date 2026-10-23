import { useState } from "react";
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
    path: "/api-store/petstore",
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
    path: "/api-store/blog",
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
    path: "/api-store/auth",
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
  const [query, setQuery] = useState("");
  const [apiFilter, setApiFilter] = useState("all");

  const q = query.trim().toLowerCase();
  const filtered = APIs.filter(
    (a) =>
      (apiFilter === "all" || a.id === apiFilter) &&
      (!q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))),
  );

  return (
    <div
      style={{ padding: "1.5rem 0" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>

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

      {/* Search + filter by API */}
      <div style={{ marginBottom: "2rem" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search APIs by name, description or tag…"
          aria-label="Search APIs"
          style={{
            width: "100%",
            maxWidth: "480px",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        />
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {[{ id: "all", name: "All" }, ...APIs].map((f) => (
            <button
              key={f.id}
              onClick={() => setApiFilter(f.id)}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
                border: "1px solid",
                borderColor: apiFilter === f.id ? "hsl(var(--primary))" : "hsl(var(--border))",
                background: apiFilter === f.id ? "hsl(var(--primary))" : "transparent",
                color: apiFilter === f.id ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }}>
          No APIs match your search.
        </p>
      )}

      {/* API Grid — uses zudoku/ui Card and Badge (shadcn) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filtered.map((api) => (
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
                  <strong style={{ color: "hsl(var(--foreground))" }}>{api.version.startsWith("v") ? api.version : `v${api.version}`}</strong>{" "}
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

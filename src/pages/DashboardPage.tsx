import { useState } from "react";
import { Link, useNavigate } from "zudoku/router";
import { Badge } from "zudoku/ui/Badge";
import { Button } from "zudoku/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "zudoku/ui/Card";

// This page demonstrates a traditional React page pattern inside Zudoku's customPages:
// - useState for local state
// - useNavigate from zudoku/router (React Router)
// - zudoku/ui components (shadcn)
// - No MDX, no Zudoku-specific abstractions — pure React

type ActivityItem = {
  id: number;
  action: string;
  api: string;
  time: string;
  status: "success" | "error" | "pending";
};

const ACTIVITY: ActivityItem[] = [
  { id: 1, action: "GET /api/pets", api: "Petstore", time: "2 min ago", status: "success" },
  { id: 2, action: "POST /auth/login", api: "Auth API", time: "5 min ago", status: "success" },
  { id: 3, action: "GET /blog-api/posts", api: "Blog API", time: "12 min ago", status: "success" },
  { id: 4, action: "DELETE /api/pet/5", api: "Petstore", time: "1 hr ago", status: "error" },
  { id: 5, action: "POST /blog-api/posts", api: "Blog API", time: "2 hr ago", status: "pending" },
];

const STATS = [
  { label: "Total Requests", value: "1,284", delta: "+12% this week" },
  { label: "Success Rate", value: "97.3%", delta: "+0.5% vs last week" },
  { label: "APIs Integrated", value: "3", delta: "Petstore · Blog · Auth" },
  { label: "Avg. Latency", value: "84ms", delta: "p95: 210ms" },
];

const statusStyle: Record<ActivityItem["status"], string> = {
  success: "default",
  error: "destructive",
  pending: "secondary",
};

export function DashboardPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | ActivityItem["status"]>("all");

  const filtered =
    filter === "all" ? ACTIVITY : ACTIVITY.filter((a) => a.status === filter);

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2.5rem 1.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "hsl(var(--primary))",
              marginBottom: "0.25rem",
            }}
          >
            Overview
          </p>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "hsl(var(--foreground))",
            }}
          >
            Dashboard
          </h1>
        </div>
        <Button onClick={() => navigate("/api-store")}>Browse APIs</Button>
      </div>

      {/* Stats grid — shadcn Card from zudoku/ui */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader style={{ paddingBottom: "0.25rem" }}>
              <CardTitle style={{ fontSize: "0.85rem", fontWeight: 500, color: "hsl(var(--muted-foreground))" }}>
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "hsl(var(--foreground))" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", marginTop: "0.25rem" }}>
                {stat.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <CardTitle>Recent Activity</CardTitle>
            {/* Filter buttons — local state with useState */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["all", "success", "error", "pending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: filter === f ? "hsl(var(--primary))" : "hsl(var(--border))",
                    background: filter === f ? "hsl(var(--primary))" : "transparent",
                    color: filter === f ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                    transition: "all 0.15s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }}>
              No activity for this filter.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    background: "hsl(var(--muted))",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <code
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      {item.action}
                    </code>
                    <Badge variant="outline">{item.api}</Badge>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                      {item.time}
                    </span>
                    <Badge variant={statusStyle[item.status] as "default" | "destructive" | "secondary"}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem 1.25rem",
          borderRadius: "0.5rem",
          background: "hsl(var(--muted))",
          fontSize: "0.8rem",
          color: "hsl(var(--muted-foreground))",
        }}
      >
        This page is a <code style={{ fontFamily: "monospace" }}>customPage</code> using{" "}
        <code style={{ fontFamily: "monospace" }}>useState</code>,{" "}
        <code style={{ fontFamily: "monospace" }}>useNavigate</code> from{" "}
        <code style={{ fontFamily: "monospace" }}>zudoku/router</code>, and{" "}
        <code style={{ fontFamily: "monospace" }}>zudoku/ui</code> Card/Badge/Button.{" "}
        <Link to="/api-store" style={{ color: "hsl(var(--primary))" }}>
          Back to API Store
        </Link>
      </div>
    </div>
  );
}

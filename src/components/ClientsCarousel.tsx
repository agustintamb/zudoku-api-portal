// Real brand logos served by Simple Icons (same CDN Zudoku uses for footer icons).
const CLIENTS = [
  { name: "Google", slug: "google" },
  { name: "Spotify", slug: "spotify" },
  { name: "Netflix", slug: "netflix" },
  { name: "Airbnb", slug: "airbnb" },
  { name: "Uber", slug: "uber" },
  { name: "Stripe", slug: "stripe" },
  { name: "Shopify", slug: "shopify" },
  { name: "GitHub", slug: "github" },
];

const CSS = `
@keyframes clients-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.clients-track {
  display: flex;
  width: max-content;
  animation: clients-marquee 30s linear infinite;
}
.clients-viewport:hover .clients-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .clients-track { animation: none; }
  .clients-track > [aria-hidden] { display: none; }
  .clients-viewport { overflow-x: auto; }
}
`;

export function ClientsCarousel() {
  // The list is rendered twice so translating by -50% loops seamlessly; the
  // copy is hidden from assistive tech so logos aren't announced twice.
  const slides = [
    ...CLIENTS.map((client) => ({ ...client, duplicate: false })),
    ...CLIENTS.map((client) => ({ ...client, duplicate: true })),
  ];

  return (
    <section style={{ padding: "3rem 0", textAlign: "center" }}>
      <style>{CSS}</style>
      <p
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "hsl(var(--muted-foreground))",
          marginBottom: "1.5rem",
        }}
      >
        Trusted by teams worldwide
      </p>
      <div
        className="clients-viewport"
        style={{
          overflow: "hidden",
          maxWidth: "640px",
          margin: "0 auto",
          maskImage:
            "linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)",
        }}
      >
        <div className="clients-track">
          {slides.map((client, i) => (
            <div
              key={`${client.slug}-${i}`}
              aria-hidden={client.duplicate || undefined}
              style={{ padding: "0 2.5rem" }}
            >
              <img
                src={`https://cdn.simpleicons.org/${client.slug}`}
                alt={client.duplicate ? "" : client.name}
                title={client.name}
                height={32}
                draggable={false}
                style={{ height: "32px", width: "auto", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

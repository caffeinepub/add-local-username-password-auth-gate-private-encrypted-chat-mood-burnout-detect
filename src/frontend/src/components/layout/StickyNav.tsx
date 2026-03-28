import { useScrollShadow } from "@/hooks/useScrollShadow";

const NAV_LINKS = [
  { label: "About", href: "#about-section" },
  { label: "How It Works", href: "#how-it-works-section" },
  { label: "Features", href: "#features-section" },
  { label: "FAQ", href: "#faq-section" },
];

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export default function StickyNav() {
  const { isScrolled } = useScrollShadow(20);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: isScrolled ? "oklch(0.10 0.05 260 / 0.92)" : "transparent",
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(16px)" : "none",
        boxShadow: isScrolled
          ? "0 4px 24px oklch(0 0 0 / 0.4), 0 1px 0 oklch(0.68 0.28 290 / 0.3)"
          : "none",
        borderBottom: isScrolled
          ? "1px solid oklch(0.68 0.28 290 / 0.25)"
          : "none",
        transition:
          "background 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
      }}
      aria-label="Main navigation"
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Brand */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            fontWeight: 800,
            fontSize: "1.25rem",
            letterSpacing: "-0.02em",
            background:
              "linear-gradient(135deg, oklch(0.65 0.28 255) 0%, oklch(0.65 0.28 335) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          }}
          data-ocid="nav.link"
        >
          MindVault
        </button>

        {/* Nav links */}
        <ul
          style={{
            display: "flex",
            gap: "0.25rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => scrollToSection(link.href)}
                style={{
                  padding: "0.5rem 0.875rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "oklch(0.85 0.05 260)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  transition:
                    "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms ease, color 200ms ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "scale(1.05)";
                  el.style.background = "oklch(0.68 0.22 28 / 0.15)";
                  el.style.color = "oklch(0.68 0.22 28)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "scale(1)";
                  el.style.background = "transparent";
                  el.style.color = "oklch(0.85 0.05 260)";
                }}
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

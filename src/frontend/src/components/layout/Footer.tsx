import { Heart, Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "mindvault-app";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer
      style={{
        background: "oklch(0.08 0.03 260)",
        borderTop: "1px solid oklch(0.28 0.06 260)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact section */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: "oklch(0.97 0.005 240)" }}
            >
              Contact Us
            </h3>
            <a
              href="mailto:mindvault@gmail.com"
              className="flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              style={{ color: "oklch(0.75 0.06 270)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.68 0.22 28)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.75 0.06 270)";
              }}
            >
              <Mail className="w-4 h-4" />
              <span>mindvault@gmail.com</span>
            </a>
          </div>

          {/* Navigation links */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: "oklch(0.97 0.005 240)" }}
            >
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              {[
                { label: "About", id: "about-section" },
                { label: "Features", id: "features-section" },
                { label: "How It Works", id: "how-it-works-section" },
                { label: "Privacy", id: "privacy-section" },
                { label: "FAQ", id: "faq-section" },
              ].map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="transition-colors text-left focus:outline-none focus:ring-2 focus:ring-ring rounded"
                  style={{ color: "oklch(0.75 0.06 270)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.68 0.28 290)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.75 0.06 270)";
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Social media */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: "oklch(0.97 0.005 240)" }}
            >
              Follow Us
            </h3>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/mindvault"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded p-1"
                style={{ color: "oklch(0.75 0.06 270)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.72 0.2 185)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.75 0.06 270)";
                }}
                aria-label="Follow us on X (Twitter)"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/mindvault"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded p-1"
                style={{ color: "oklch(0.75 0.06 270)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.65 0.28 255)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.75 0.06 270)";
                }}
                aria-label="Follow us on LinkedIn"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/mindvault"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded p-1"
                style={{ color: "oklch(0.75 0.06 270)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.68 0.28 290)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.75 0.06 270)";
                }}
                aria-label="Follow us on GitHub"
              >
                <SiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8"
          style={{ borderTop: "1px solid oklch(0.28 0.06 260)" }}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
            style={{ color: "oklch(0.65 0.04 260)" }}
          >
            <p>© {currentYear} MindVault. All rights reserved.</p>
            <p>
              Built with{" "}
              <Heart
                className="inline w-4 h-4 fill-current"
                style={{ color: "oklch(0.68 0.22 28)" }}
                aria-label="love"
              />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
                style={{ color: "oklch(0.68 0.28 290)" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Contact Us
            </h3>
            <a
              href="mailto:mindvault@gmail.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
            >
              <Mail className="w-4 h-4" />
              <span>mindvault@gmail.com</span>
            </a>
          </div>

          {/* Navigation links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => scrollToSection("about-section")}
                className="text-muted-foreground hover:text-accent transition-colors text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features-section")}
                className="text-muted-foreground hover:text-accent transition-colors text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("how-it-works-section")}
                className="text-muted-foreground hover:text-accent transition-colors text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("privacy-section")}
                className="text-muted-foreground hover:text-accent transition-colors text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("faq-section")}
                className="text-muted-foreground hover:text-accent transition-colors text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
              >
                FAQ
              </button>
            </nav>
          </div>

          {/* Social media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/mindvault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded p-1"
                aria-label="Follow us on X (Twitter)"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/mindvault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded p-1"
                aria-label="Follow us on LinkedIn"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/mindvault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded p-1"
                aria-label="Follow us on GitHub"
              >
                <SiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar with copyright and attribution */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} MindVault. All rights reserved.</p>
            <p>
              Built with{" "}
              <Heart
                className="inline w-4 h-4 text-accent fill-accent"
                aria-label="love"
              />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded"
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

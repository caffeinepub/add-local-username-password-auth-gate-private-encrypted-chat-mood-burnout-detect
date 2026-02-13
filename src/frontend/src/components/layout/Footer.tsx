import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'mindvault-app';

  return (
    <footer className="border-t border-border/50 py-8 px-4" role="contentinfo">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} MindVault. Built with{' '}
          <Heart className="inline w-4 h-4 text-accent fill-accent" aria-label="love" />{' '}
          using{' '}
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
    </footer>
  );
}

import Link from "next/link";
import { Zap, MessageCircle, Globe } from "lucide-react";

const footerLinks = {
  Produit: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Créateur Web", href: "/website-creator" },
    { label: "Tarifs", href: "/pricing" },
    { label: "Modules", href: "/dashboard#modules" },
  ],
  Communauté: [
    { label: "Discord Support", href: "https://discord.gg/nuFNvVybGE" },
    { label: "The French Baguette", href: "https://discord.gg/jX9mFnEk72" },
    { label: "Maths-App", href: "https://maths-app.com" },
  ],
  Légal: [
    { label: "CGU", href: "/legal/terms" },
    { label: "Confidentialité", href: "/legal/privacy" },
    { label: "Mentions légales", href: "/legal/notices" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-glass-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary transition-all group-hover:bg-primary/30">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-bold tracking-tight text-foreground">Synkrone</span>
            </Link>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              Créez votre bot Discord personnalisé en quelques clics avec des modules prêts à l&apos;emploi.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://discord.gg/nuFNvVybGE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border text-muted transition-all hover:text-accent hover:border-accent/30 hover:bg-accent/5"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://maths-app.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border text-muted transition-all hover:text-accent hover:border-accent/30 hover:bg-accent/5"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted/70 transition-all hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-glass-border pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted/50">
            &copy; {new Date().getFullYear()} Synkrone. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted/50">
            <span>Propulsé par</span>
            <span className="text-gradient font-semibold">Synkrone</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

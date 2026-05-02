import Link from "next/link";
import { Bot, MessageCircle, Globe } from "lucide-react";

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
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Bot className="h-6 w-6 text-primary" />
              Synkrone
            </Link>
            <p className="mt-3 text-sm text-muted">
              Créez votre bot Discord personnalisé en quelques clics avec des modules prêts à l&apos;emploi.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://discord.gg/nuFNvVybGE"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-accent"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://maths-app.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-accent"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} Synkrone. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

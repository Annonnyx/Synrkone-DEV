import Link from "next/link";
import {
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Crown,
  Globe,
  Bot,
  Coins,
  Code2,
  BarChart3,
  Users,
  Terminal,
} from "lucide-react";

const bentoFeatures = [
  {
    icon: Layers,
    title: "Modules pré-codés",
    description: "Auto-rôles, génération, modération, économie… Activez ce que vous voulez en un clic.",
    span: "col-span-2",
    accent: "primary",
  },
  {
    icon: Zap,
    title: "Zero code requis",
    description: "Branchez votre token et votre bot tourne en secondes.",
    span: "col-span-1",
    accent: "accent",
  },
  {
    icon: Shield,
    title: "Hébergement & sécurité",
    description: "Token chiffré, redémarrage auto, uptime 99.7% garanti.",
    span: "col-span-1",
    accent: "success",
  },
  {
    icon: Crown,
    title: "Krônes & Premium",
    description: "Système de points flexible. Payez uniquement pour ce que vous utilisez.",
    span: "col-span-1",
    accent: "premium",
  },
  {
    icon: Globe,
    title: "Créateur Web intégré",
    description: "Sites web pour vos serveurs avec presets ou code custom. Intégration via /setup.",
    span: "col-span-2",
    accent: "accent",
  },
  {
    icon: BarChart3,
    title: "Statistiques temps réel",
    description: "Serveurs, commandes, latence, uptime — tout est visible depuis le dashboard.",
    span: "col-span-1",
    accent: "primary",
  },
];

const bots = [
  { name: "Vex", href: "https://discord.com/oauth2/authorize?client_id=1367891720871874560", desc: "Multifonction", color: "from-primary/20 to-primary/5" },
  { name: "Asuna", href: "https://discord.com/oauth2/authorize?client_id=1428865683986452640", desc: "Modération", color: "from-accent/20 to-accent/5" },
  { name: "Kayaba", href: "https://discord.com/oauth2/authorize?client_id=1385913159717621780", desc: "Utilitaires", color: "from-success/20 to-success/5" },
  { name: "Yui", href: "https://discord.com/oauth2/authorize?client_id=1460012999912853810", desc: "Fun & Jeux", color: "from-premium/20 to-premium/5" },
];

const accentMap: Record<string, { icon: string; badge: string; glow: string }> = {
  primary: { icon: "text-primary", badge: "bg-primary/10 text-primary", glow: "group-hover:shadow-primary/20" },
  accent: { icon: "text-accent", badge: "bg-accent/10 text-accent", glow: "group-hover:shadow-accent/20" },
  success: { icon: "text-success", badge: "bg-success/10 text-success", glow: "group-hover:shadow-success/20" },
  premium: { icon: "text-premium", badge: "bg-premium/10 text-premium", glow: "group-hover:shadow-premium/20" },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[100px] animate-float-delayed" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="animate-slide-up mb-8 inline-flex items-center gap-2 rounded-full border border-glass-border glass px-4 py-2 text-sm font-medium text-muted">
            <Sparkles className="h-3.5 w-3.5 text-premium" />
            <span>Nouveau</span>
            <span className="text-foreground">Créateur de sites web intégré</span>
            <ArrowRight className="h-3 w-3" />
          </div>

          {/* Title */}
          <h1 className="animate-slide-up text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">Créez votre</span>
            <br />
            <span className="text-gradient">bot Discord</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed sm:text-xl" style={{ animationDelay: "0.2s" }}>
            Modules pré-codés, configuration instantanée, statistiques temps réel.
            <br className="hidden sm:block" />
            <span className="text-foreground/70"> Pas besoin de savoir coder.</span>
          </p>

          {/* CTAs */}
          <div className="animate-slide-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/dashboard"
              className="btn-shiny inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white"
            >
              Créer mon bot
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="glass inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-white/8"
            >
              Voir les tarifs
            </Link>
          </div>

          {/* Stats bar */}
          <div className="animate-slide-up mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted sm:gap-12" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              <span><span className="font-semibold text-foreground">99.7%</span> uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span><span className="font-semibold text-foreground">4 800+</span> utilisateurs</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-accent" />
              <span><span className="font-semibold text-foreground">12 000+</span> commandes/jour</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Features */}
      <section className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tout ce qu&apos;il vous faut
          </h2>
          <p className="mt-3 text-muted text-lg">
            Des modules pensés pour chaque usage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {bentoFeatures.map((feat) => {
            const colors = accentMap[feat.accent] || accentMap.primary;
            return (
              <div
                key={feat.title}
                className={`bento-item group p-6 sm:p-8 ${feat.span} transition-all duration-500`}
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${colors.badge}`}>
                  <feat.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bots showcase */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Nos bots en action
            </h2>
            <p className="mt-3 text-muted text-lg">
              Déjà opérationnels. Ajoutez-les à votre serveur.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bots.map((bot) => (
              <a
                key={bot.name}
                href={bot.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-item group p-6 text-center"
              >
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${bot.color} mb-4 transition-transform group-hover:scale-110`}>
                  <Bot className="h-6 w-6 text-foreground/70" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{bot.name}</h3>
                <p className="mt-1 text-xs text-muted">{bot.desc}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Ajouter <ArrowRight className="h-3 w-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bento-item relative p-12 text-center sm:p-16 overflow-hidden">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Prêt à créer votre bot ?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted text-lg">
                Commencez gratuitement. Évoluez avec les Krônes.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/dashboard"
                  className="btn-shiny inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white"
                >
                  Lancer le Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://discord.gg/nuFNvVybGE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-white/8"
                >
                  Support Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

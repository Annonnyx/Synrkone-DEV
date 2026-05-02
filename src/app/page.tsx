import Link from "next/link";
import {
  Bot,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Crown,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Modules pré-codés",
    description:
      "Auto-rôles, génération d'images, modération, économie… Activez ce que vous voulez en un clic.",
  },
  {
    icon: Zap,
    title: "Configuration instantanée",
    description:
      "Pas besoin de coder. Branchez votre token Discord et votre bot est opérationnel en secondes.",
  },
  {
    icon: Shield,
    title: "Fiable et sécurisé",
    description:
      "Hébergement garanti, token chiffré, redémarrage automatique en cas de crash.",
  },
  {
    icon: Crown,
    title: "Premium sur demande",
    description:
      "Certains modules et commandes avancées sont disponibles en Premium pour ceux qui veulent plus.",
  },
  {
    icon: Globe,
    title: "Créateur de sites web",
    description:
      "Créez un site web pour votre serveur : code custom ou presets, intégré via un simple /setup.",
  },
  {
    icon: Sparkles,
    title: "Communauté active",
    description:
      "Rejoignez notre support Discord et profitez de l'aide de la communauté Synkrone.",
  },
];

const bots = [
  { name: "Vex", href: "https://discord.com/oauth2/authorize?client_id=1367891720871874560", desc: "Bot multifonction" },
  { name: "Asuna", href: "https://discord.com/oauth2/authorize?client_id=1428865683986452640", desc: "Modération avancée" },
  { name: "Kayaba", href: "https://discord.com/oauth2/authorize?client_id=1385913159717621780", desc: "Utilitaires serveur" },
  { name: "Yui", href: "https://discord.com/oauth2/authorize?client_id=1460012999912853810", desc: "Fun & mini-jeux" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary-glow)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Bot className="h-4 w-4" />
              Nouveau : Créateur de sites web intégré
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Créez votre bot Discord
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                en quelques clics
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              Synkrone vous permet de créer un bot Discord personnalisé avec des
              modules pré-codés. Auto-rôles, génération, modération, économie…
              tout est activable en un clic. Pas besoin de savoir coder.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary-glow transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary-glow"
              >
                Créer mon bot
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-card"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-3 text-muted">
            Des modules pensés pour chaque usage, du plus simple au plus avancé.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:bg-card-hover hover:shadow-lg hover:shadow-primary-glow"
            >
              <feat.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feat.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bots showcase */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Nos bots en action
            </h2>
            <p className="mt-3 text-muted">
              Découvrez les bots propulsés par Synkrone et ajoutez-les à votre serveur.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bots.map((bot) => (
              <a
                key={bot.name}
                href={bot.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:bg-card-hover hover:shadow-lg hover:shadow-primary-glow"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Bot className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {bot.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{bot.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Ajouter <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/5 p-10 text-center sm:p-16">
          <h2 className="text-3xl font-bold text-foreground">
            Prêt à créer votre bot ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Rejoignez des centaines de serveurs qui utilisent déjà Synkrone.
            C&apos;est gratuit pour commencer.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary-glow transition-all hover:bg-primary-hover"
            >
              Lancer le Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://discord.gg/nuFNvVybGE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-card"
            >
              Rejoindre le support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

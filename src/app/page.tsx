import Link from "next/link";
import { ArrowRight, Zap, Shield, Layers, Crown, Globe, BarChart3, Bot, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Modules pré-codés",
    description: "Auto-rôles, modération, économie, musique. Activez ce dont vous avez besoin.",
    span: "md:col-span-2",
  },
  {
    icon: Zap,
    title: "Zéro code",
    description: "Configuration visuelle. Votre bot est en ligne en minutes.",
    span: "md:col-span-1",
  },
  {
    icon: Shield,
    title: "Hébergement flexible",
    description: "Cloud Synkrone ou auto-hébergé. Votre choix.",
    span: "md:col-span-1",
  },
  {
    icon: Crown,
    title: "Système de Krônes",
    description: "Payez uniquement pour ce que vous utilisez. Pas d'abonnement forcé.",
    span: "md:col-span-1",
  },
  {
    icon: Globe,
    title: "Sites web intégrés",
    description: "Créez une page pour votre serveur avec notre constructeur visuel.",
    span: "md:col-span-2",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Statistiques détaillées sur l'usage de votre bot.",
    span: "md:col-span-1",
  },
];

const bots = [
  { name: "Vex", desc: "Multifonction", href: "https://discord.com/oauth2/authorize?client_id=1367891720871874560" },
  { name: "Asuna", desc: "Modération", href: "https://discord.com/oauth2/authorize?client_id=1428865683986452640" },
  { name: "Kayaba", desc: "Utilitaires", href: "https://discord.com/oauth2/authorize?client_id=1385913159717621780" },
  { name: "Yui", desc: "Fun & Jeux", href: "https://discord.com/oauth2/authorize?client_id=1460012999912853810" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero - Clean and spacious */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 lg:px-8">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-5xl">
          {/* Eyebrow */}
          <div className="animate-fade-in mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60">
              <Zap className="h-4 w-4 text-violet-400" />
              Plateforme de bots Discord
            </span>
          </div>

          {/* Main title */}
          <h1 className="animate-fade-in delay-1 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
            Créez votre bot
            <br />
            <span className="text-gradient">sans coder</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in delay-2 mt-8 max-w-xl text-lg text-white/50 leading-relaxed">
            Modules pré-codés, hébergement cloud ou auto-hébergé, 
            statistiques temps réel. Pour les créateurs de communautés Discord.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in delay-3 mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base"
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="btn-ghost inline-flex items-center gap-2 px-6 py-3 text-base"
            >
              Voir les tarifs
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in delay-3 mt-20 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <div className="text-2xl font-semibold text-white">99.7%</div>
              <div className="mt-1 text-sm text-white/40">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">4,800+</div>
              <div className="mt-1 text-sm text-white/40">Utilisateurs</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">12K+</div>
              <div className="mt-1 text-sm text-white/40">Commandes/jour</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento grid */}
      <section className="relative px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Tout ce qu&apos;il vous faut
            </h2>
            <p className="mt-4 text-white/50">
              Une suite complète d&apos;outils pour gérer votre communauté.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`surface-card group p-6 ${feature.span}`}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-500/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bots showcase */}
      <section className="relative px-6 py-32 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Nos bots
              </h2>
              <p className="mt-4 text-white/50">
                Déjà en ligne. Ajoutez-les à votre serveur.
              </p>
            </div>
            <Link 
              href="/projects" 
              className="hidden sm:inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Voir tous les bots
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bots.map((bot) => (
              <a
                key={bot.name}
                href={bot.href}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card group p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 text-violet-300 transition-transform group-hover:scale-105">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-white">{bot.name}</h3>
                <p className="mt-1 text-sm text-white/40">{bot.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Prêt à créer votre bot ?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/50">
            Commencez gratuitement. Aucune carte requise.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base"
            >
              Lancer le dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://discord.gg/nuFNvVybGE"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2 px-8 py-4 text-base"
            >
              Rejoindre Discord
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

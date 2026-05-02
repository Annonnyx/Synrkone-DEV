"use client";

import Link from "next/link";
import { ArrowRight, Zap, Shield, Layers, Crown, Globe, BarChart3, Bot, ChevronRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Modules pré-codés",
    description: "Auto-rôles, modération, économie, musique. Activez ce dont vous avez besoin.",
    span: "md:col-span-2",
    featured: true,
  },
  {
    icon: Zap,
    title: "Zéro code",
    description: "Configuration visuelle. Votre bot en ligne en minutes.",
    span: "md:col-span-1",
    featured: false,
  },
  {
    icon: Shield,
    title: "Cloud ou Self-hosted",
    description: "Hébergement Synkrone ou code source complet.",
    span: "md:col-span-1",
    featured: false,
  },
  {
    icon: Crown,
    title: "Paiement flexible",
    description: "Payez ce que vous utilisez. Pas d'abonnement forcé.",
    span: "md:col-span-1",
    featured: false,
  },
  {
    icon: Globe,
    title: "Site web inclus",
    description: "Créez une page pour votre serveur avec notre constructeur.",
    span: "md:col-span-2",
    featured: true,
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
      {/* Global background glow */}
      <div className="page-glow" />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Plateforme de bots Discord</span>
          </div>

          {/* Main heading - Larger with Syne font */}
          <h1 className="font-display animate-fade-up delay-100 mt-8 text-7xl font-semibold text-white sm:text-8xl lg:text-9xl leading-[0.95] tracking-tight">
            Créez votre
            <br />
            <span className="text-gradient">bot sans code</span>
          </h1>

          {/* Description - Shorter */}
          <p className="animate-fade-up delay-200 mt-8 max-w-xl text-xl text-[#a79eb5] leading-relaxed">
            Modules pré-codés, hébergement flexible, analytics temps réel.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center gap-4">
            <Link href="/dashboard" className="btn-violet inline-flex items-center gap-2 px-8 py-4 text-base">
              Commencer gratuitement
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/pricing" className="btn-ghost inline-flex items-center gap-2 px-8 py-4 text-base">
              Voir les tarifs
            </Link>
          </div>

          {/* Stats - Bigger numbers */}
          <div className="animate-fade-up delay-400 mt-20 flex gap-16 border-t border-white/10 pt-10">
            <div>
              <div className="font-display text-4xl font-semibold text-white">99.7%</div>
              <div className="mt-1 text-sm text-[#6b6078]">Uptime</div>
            </div>
            <div>
              <div className="font-display text-4xl font-semibold text-white">4.8K+</div>
              <div className="mt-1 text-sm text-[#6b6078]">Utilisateurs</div>
            </div>
            <div>
              <div className="font-display text-4xl font-semibold text-white">12K+</div>
              <div className="mt-1 text-sm text-[#6b6078]">Commandes/jour</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento */}
      <section className="relative py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-16">
            <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">Fonctionnalités</span>
            <h2 className="font-display mt-4 text-5xl font-semibold text-white sm:text-6xl">
              Tout inclus
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`${feature.featured ? 'card-featured' : 'card'} group p-7 ${feature.span}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                  feature.featured 
                    ? 'bg-gradient-to-br from-violet-500/20 to-amber-500/10 text-violet-300 group-hover:scale-110' 
                    : 'bg-white/5 text-violet-300 group-hover:bg-violet-500/20'
                }`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-medium text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-[#a79eb5] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bots showcase */}
      <section className="relative py-32 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">Nos bots</span>
              <h2 className="font-display mt-4 text-5xl font-semibold text-white">
                Prêts à l&apos;emploi
              </h2>
            </div>
            <Link 
              href="/projects" 
              className="hidden sm:inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Voir tous
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bots.map((bot, i) => (
              <a
                key={bot.name}
                href={bot.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group p-6 text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/30 to-amber-500/20 opacity-50 blur-xl transition-opacity group-hover:opacity-80" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 text-violet-300 transition-transform group-hover:scale-110">
                    <Bot className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-medium text-white">{bot.name}</h3>
                <p className="mt-1 text-sm text-[#6b6078]">{bot.desc}</p>
                
                <div className="mt-4 flex items-center justify-center gap-1 text-sm text-violet-400 opacity-0 transition-all group-hover:opacity-100">
                  <span>Ajouter</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <div className="card-featured p-12 sm:p-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 mb-8">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Gratuit pour commencer
            </div>
            
            <h2 className="font-display text-5xl font-semibold text-white sm:text-6xl">
              Prêt à créer
              <br />
              <span className="text-gradient">votre bot ?</span>
            </h2>
            
            <p className="mx-auto mt-6 max-w-lg text-xl text-[#a79eb5]">
              Pas de carte requise. Testez tous les modules gratuitement.
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/dashboard" className="btn-violet inline-flex items-center gap-2 px-8 py-4 text-base">
                Lancer le dashboard
                <ArrowRight className="h-5 w-5" />
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
        </div>
      </section>
    </main>
  );
}

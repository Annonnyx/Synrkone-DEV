"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Crown,
  Globe,
  Bot,
  BarChart3,
  Users,
  Terminal,
  ChevronRight,
  MousePointer2,
} from "lucide-react";

const bentoFeatures = [
  {
    icon: Layers,
    title: "Modules pré-codés",
    description: "Auto-rôles, génération IA, modération, économie… Activez ce que vous voulez en un clic.",
    span: "md:col-span-2",
    accent: "primary",
  },
  {
    icon: Zap,
    title: "Zero code requis",
    description: "Branchez votre token et votre bot tourne en secondes.",
    span: "md:col-span-1",
    accent: "accent",
  },
  {
    icon: Shield,
    title: "Hébergement inclus",
    description: "Ou choisissez l'auto-hébergement. Token chiffré, uptime 99.7%.",
    span: "md:col-span-1",
    accent: "success",
  },
  {
    icon: Crown,
    title: "Krônes & Premium",
    description: "Système de points flexible. Payez uniquement pour ce que vous utilisez.",
    span: "md:col-span-1",
    accent: "premium",
  },
  {
    icon: Globe,
    title: "Créateur Web intégré",
    description: "Sites web pour vos serveurs avec presets ou code custom. Intégration via /setup.",
    span: "md:col-span-2",
    accent: "accent",
  },
  {
    icon: BarChart3,
    title: "Statistiques temps réel",
    description: "Serveurs, commandes, latence, uptime — tout est visible depuis le dashboard.",
    span: "md:col-span-1",
    accent: "primary",
  },
];

const bots = [
  { name: "Vex", href: "https://discord.com/oauth2/authorize?client_id=1367891720871874560", desc: "Multifonction", color: "from-violet-500/30 to-violet-600/10", iconColor: "text-violet-400" },
  { name: "Asuna", href: "https://discord.com/oauth2/authorize?client_id=1428865683986452640", desc: "Modération", color: "from-cyan-500/30 to-cyan-600/10", iconColor: "text-cyan-400" },
  { name: "Kayaba", href: "https://discord.com/oauth2/authorize?client_id=1385913159717621780", desc: "Utilitaires", color: "from-emerald-500/30 to-emerald-600/10", iconColor: "text-emerald-400" },
  { name: "Yui", href: "https://discord.com/oauth2/authorize?client_id=1460012999912853810", desc: "Fun & Jeux", color: "from-amber-500/30 to-amber-600/10", iconColor: "text-amber-400" },
];

const accentMap: Record<string, { badge: string; icon: string }> = {
  primary: { badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", icon: "text-violet-400" },
  accent: { badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", icon: "text-cyan-400" },
  success: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: "text-emerald-400" },
  premium: { badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: "text-amber-400" },
};

// Spotlight hook
function useSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      setPosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    return () => element.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return { ref, position };
}

// Animated counter
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, position } = useSpotlight();
  return (
    <div
      ref={ref}
      className={`bento-item-spotlight ${className}`}
      style={{ "--mouse-x": `${position.x}%`, "--mouse-y": `${position.y}%` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero - Premium */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/20" />
          
          {/* Floating orbs */}
          <div className="absolute top-[20%] left-[15%] h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-float" />
          <div className="absolute top-[40%] right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[100px] animate-float-delayed" />
          <div className="absolute bottom-[20%] left-[30%] h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[90px] animate-float-slow" />
        </div>

        {/* Noise overlay */}
        <div className="noise-overlay" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          {/* Badge with shimmer */}
          <div className="animate-slide-up-fade mb-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2.5 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white/60">Nouveau</span>
            <span className="text-white">Créateur de sites web</span>
            <ChevronRight className="h-4 w-4 text-white/40" />
          </div>

          {/* Main title with staggered reveal */}
          <div className="space-y-2">
            <div className="overflow-hidden">
              <h1 className="animate-slide-up text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-[100px] leading-[0.9]">
                Créez votre
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="animate-slide-up text-6xl font-bold tracking-tight sm:text-7xl lg:text-[100px] leading-[0.9] stagger-2"
                style={{ animationDelay: "0.15s" }}>
                <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent animate-gradient">
                  bot Discord
                </span>
              </h1>
            </div>
          </div>

          {/* Animated line */}
          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent animate-scale-in" style={{ animationDelay: "0.3s" }} />

          {/* Subtitle */}
          <p className="animate-slide-up-fade mx-auto mt-8 max-w-xl text-lg text-white/50 leading-relaxed sm:text-xl stagger-3" style={{ animationDelay: "0.4s" }}>
            Modules pré-codés, hébergement flexible, statistiques temps réel.
            <br />
            <span className="text-white/70">Zero code requis.</span>
          </p>

          {/* CTAs with magnetic effect */}
          <div className="animate-slide-up-fade mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ animationDelay: "0.5s" }}>
            <Link
              href="/dashboard"
              className="btn-shiny group inline-flex items-center gap-3 rounded-2xl px-10 py-5 text-lg font-semibold text-white magnetic-btn"
            >
              <span>Créer mon bot</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
            >
              <span>Voir les tarifs</span>
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Stats with animated counters */}
          <div className="animate-slide-up-fade mt-20 grid grid-cols-3 gap-8 sm:gap-16" style={{ animationDelay: "0.6s" }}>
            <div className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                <AnimatedNumber value={99} suffix=".7%" />
              </div>
              <div className="mt-1 text-xs text-white/40 uppercase tracking-wider">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                <AnimatedNumber value={4800} suffix="+" />
              </div>
              <div className="mt-1 text-xs text-white/40 uppercase tracking-wider">Utilisateurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                <AnimatedNumber value={12000} suffix="+" />
              </div>
              <div className="mt-1 text-xs text-white/40 uppercase tracking-wider">Cmd/jour</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <MousePointer2 className="h-5 w-5 animate-bounce" />
          <span className="text-xs uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* Bento Features - Premium */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 mb-6">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Fonctionnalités</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Tout ce qu&apos;il vous faut
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/40">
              Des modules pensés pour chaque usage. Activez, configurez, déployez.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {bentoFeatures.map((feat, i) => {
              const colors = accentMap[feat.accent] || accentMap.primary;
              return (
                <SpotlightCard
                  key={feat.title}
                  className={`${feat.span} group p-8`}
                >
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${colors.badge} transition-transform duration-500 group-hover:scale-110`}>
                    <feat.icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {feat.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/30 transition-colors group-hover:text-white/60">
                    <span>En savoir plus</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bots showcase - Premium */}
      <section className="relative py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 mb-6">
              <Bot className="h-4 w-4 text-violet-400" />
              <span>Bots actifs</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Nos bots en action
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/40">
              Déjà opérationnels. Ajoutez-les à votre serveur en un clic.
            </p>
          </div>

          {/* Bot cards with hover effects */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bots.map((bot, i) => (
              <a
                key={bot.name}
                href={bot.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="bento-item relative overflow-hidden p-8 text-center transition-all duration-500 group-hover:-translate-y-2">
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${bot.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 transition-transform duration-500 group-hover:scale-110">
                      <Bot className={`h-7 w-7 ${bot.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{bot.name}</h3>
                    <p className="mt-1 text-sm text-white/50">{bot.desc}</p>
                    
                    {/* Hover action */}
                    <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-white/0 transition-all duration-300 group-hover:text-white/80">
                      <span>Ajouter à Discord</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Premium */}
      <section className="relative py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Gradient border container */}
            <div className="gradient-border relative rounded-3xl p-[1px]">
              <div className="relative overflow-hidden rounded-3xl bg-[#030305] p-12 sm:p-16">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-600/10" />
                
                {/* Top line */}
                <div className="absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                <div className="relative z-10 text-center">
                  <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
                    <Sparkles className="h-4 w-4" />
                    <span>Commencez gratuitement</span>
                  </div>
                  
                  <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Prêt à créer
                    <br />
                    <span className="text-gradient">votre bot ?</span>
                  </h2>
                  
                  <p className="mx-auto mt-6 max-w-lg text-lg text-white/50">
                    Modules pré-codés, hébergement flexible, statistiques temps réel.
                  </p>
                  
                  <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link
                      href="/dashboard"
                      className="btn-shiny group inline-flex items-center gap-3 rounded-2xl px-10 py-5 text-lg font-semibold text-white"
                    >
                      <span>Lancer le Dashboard</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <a
                      href="https://discord.gg/nuFNvVybGE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
                    >
                      <span>Support Discord</span>
                      <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

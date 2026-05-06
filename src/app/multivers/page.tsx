import Link from "next/link";
import { ArrowRight, Globe, Calculator, Users, Trophy, Brain, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Test d'évaluation",
    description: "Test initial et exercices libres pour tous les niveaux.",
  },
  {
    icon: Zap,
    title: "IA adaptative",
    description: "Progression pilotée par IA selon vos performances.",
  },
  {
    icon: Trophy,
    title: "Classement Elo",
    description: "Système de classement dynamique pour la compétition.",
  },
  {
    icon: Users,
    title: "Multijoueur",
    description: "Mode multijoueur en temps réel pour défier vos amis.",
  },
  {
    icon: Calculator,
    title: "Corrections détaillées",
    description: "Apprentissage guidé avec corrections et méthodes.",
  },
  {
    icon: Globe,
    title: "Statistiques avancées",
    description: "Outils statistiques pour les enseignants et classes.",
  },
];

export default function MultiversPage() {
  return (
    <div className="relative min-h-screen">
      <div className="page-glow" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 mb-6">
            <Globe className="h-4 w-4" />
            Multivers
          </span>
          <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">
            Maths-App
          </h1>
          <p className="mt-4 text-xl text-white/50 max-w-2xl mx-auto">
            Le chess.com des mathématiques. Apprenez, progressez et compétitionnez avec une plateforme interactive et intelligente.
          </p>
        </div>

        {/* Hero card */}
        <div className="card-featured p-8 sm:p-12 mb-20 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-violet-500/10 text-cyan-300 mb-6 border border-cyan-500/30">
            <Calculator className="h-10 w-10" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Le chess.com des mathématiques
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Une plateforme d&apos;apprentissage des mathématiques gamifiée. Tests d&apos;évaluation, progression adaptée par IA, mode multijoueur et classement Elo dynamique.
          </p>
          <a
            href="https://www.maths-app.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-violet inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            Lancer Maths-App
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="font-display text-3xl font-semibold text-white text-center mb-12">
            Fonctionnalités clés
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="card p-6 group"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/10 text-cyan-300 group-hover:scale-110 transition-all duration-300 border border-cyan-500/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-medium text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card-featured p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-white mb-4">
            Prêt à réviser ?
          </h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Rejoignez des milliers d&apos;utilisateurs et commencez votre progression dès maintenant.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.maths-app.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-violet inline-flex items-center gap-2 px-6 py-3"
            >
              <Sparkles className="h-5 w-5" />
              Commencer gratuitement
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

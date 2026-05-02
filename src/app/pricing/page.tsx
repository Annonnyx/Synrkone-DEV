import { Check, Crown, Zap, Bot, Coins, ShoppingCart, Plus, Star, Server, Download, Sparkles, Percent } from "lucide-react";
import Link from "next/link";

const kroneOffers = [
  {
    krone: 30,
    price: "4,99 €",
    unitPrice: "0,166 €",
    description: "Idéal pour tester. 2-3 modules.",
    savings: null,
    icon: Zap,
    popular: false,
    premium: false,
    features: ["2-3 modules actifs", "Support communautaire"],
  },
  {
    krone: 60,
    price: "7,99 €",
    unitPrice: "0,133 €",
    description: "Pour les petits serveurs. 4-6 modules.",
    savings: "Économisez 20%",
    icon: Bot,
    popular: false,
    premium: false,
    features: ["4-6 modules actifs", "Support email", "Stats avancées"],
  },
  {
    krone: 110,
    price: "11,99 €",
    unitPrice: "0,109 €",
    description: "Pour les communautés moyennes. Tous modules.",
    savings: "Économisez 35%",
    icon: Star,
    popular: true,
    premium: false,
    features: ["Modules illimités", "Support prioritaire", "API access"],
  },
  {
    krone: 150,
    price: "14,99 €",
    unitPrice: "0,100 €",
    description: "Pour les gros serveurs actifs.",
    savings: "Économisez 40%",
    icon: Crown,
    popular: false,
    premium: true,
    features: ["Modules illimités", "Support prioritaire", "Instance supplémentaire", "Webhook custom"],
  },
  {
    krone: 200,
    price: "17,99 €",
    unitPrice: "0,090 €",
    description: "La meilleure valeur. Accès complet.",
    savings: "Économisez 45%",
    icon: Crown,
    popular: false,
    premium: true,
    features: ["Tout inclus", "2 instances", "Support dédié", "Early access"],
  },
];

const microTransactions = [
  { name: "Instance supplémentaire", description: "Ajoutez un bot supplémentaire à votre compte.", price: "1,99 €", icon: Bot },
  { name: "Profil personnalisé", description: "Personnalisez la page de profil de votre bot.", price: "0,99 €", icon: Star },
  { name: "Commande Premium", description: "Débloquez une commande Premium spécifique.", price: "1,49 €", icon: Crown },
  { name: "Support prioritaire", description: "Accédez au support dédié pendant 30 jours.", price: "2,99 €", icon: Sparkles },
];

const hostingOptions = [
  {
    name: "Hébergement Synkrone",
    description: "Inclus dans tous les abonnements. Uptime 99.7%, redémarrage auto, support inclus.",
    price: "Inclus",
    priceNote: "dans l'abonnement",
    icon: Server,
    recommended: true,
    features: ["Uptime 99.7%", "Redémarrage auto", "Support 24/7", "Mises à jour auto"],
  },
  {
    name: "Auto-hébergement",
    description: "Code source complet pour héberger sur votre propre serveur. Paiement unique.",
    price: "29,99 €",
    priceNote: "paiement unique",
    icon: Download,
    recommended: false,
    features: ["Code source complet", "Documentation incluse", "Mises à jour 6 mois", "Support setup"],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 mb-6">
          <Coins className="h-4 w-4 text-amber-400" />
          1 Krône = 0,80 € de valeur
        </span>
        <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">Tarifs</h1>
        <p className="mt-4 text-xl text-white/60 max-w-2xl mx-auto">
          Plus vous prenez de Krônes, plus vous économisez. Jusqu&apos;à -35%.
        </p>
      </div>

      {/* Krône offers */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kroneOffers.map((offer) => (
          <div
            key={offer.krone}
            className={`card relative p-6 flex flex-col ${
              offer.popular
                ? "border-violet-500/40 shadow-xl shadow-violet-500/15 scale-[1.02]"
                : offer.premium
                ? "border-amber-500/40 shadow-xl shadow-amber-500/15 bg-gradient-to-br from-amber-500/5 to-transparent"
                : ""
            }`}
          >
            {/* Badges */}
            {offer.popular ? (
              <>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-violet-500/30 z-10">
                  Plus populaire
                </span>
                {offer.savings && (
                  <span className="absolute top-6 right-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-2 py-0.5 text-[10px] font-bold text-black flex items-center gap-0.5 shadow-lg">
                    -35%
                  </span>
                )}
              </>
            ) : (
              offer.savings && (
                <span className="absolute -top-3 right-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1 text-xs font-bold text-black flex items-center gap-1 shadow-lg">
                  <Percent className="h-3 w-3" />
                  {offer.savings}
                </span>
              )
            )}
            
            <div className="flex items-center gap-2 mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                offer.popular 
                  ? "bg-gradient-to-br from-violet-500/20 to-amber-500/10 text-violet-300"
                  : offer.premium
                  ? "bg-gradient-to-br from-amber-500/30 to-amber-600/10 text-amber-300"
                  : "bg-white/5 text-violet-300"
              }`}>
                <offer.icon className="h-5 w-5" />
              </div>
              <div>
                <span className={`font-display text-2xl font-bold ${offer.premium ? "text-amber-400" : "text-white"}`}>{offer.krone}</span>
                <span className="text-sm text-white/40 ml-1">Kr</span>
              </div>
            </div>
            
            {/* Price and unit price */}
            <div className="mb-2">
              <span className="font-display text-3xl font-bold text-white">{offer.price}</span>
              <div className="text-sm text-white/40 mt-1">{offer.unitPrice}/Kr</div>
            </div>
            
            <p className="text-sm text-white/50 mb-4">{offer.description}</p>
            
            {/* Features - flex-1 pushes button to bottom */}
            <ul className="space-y-2 mb-5 flex-1">
              {offer.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                  <Check className="h-4 w-4 text-violet-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link
              href="/dashboard"
              className={`block w-full text-center rounded-xl py-3 text-sm font-medium transition-all ${
                offer.popular
                  ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:shadow-lg hover:shadow-violet-500/25"
                  : offer.premium
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-black hover:shadow-lg hover:shadow-amber-500/25 font-semibold"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              Choisir
            </Link>
          </div>
        ))}
      </div>

      {/* Value proposition */}
      <div className="mt-12 card-featured p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white mb-2">
              Pourquoi les Krônes ?
            </h3>
            <p className="text-white/60 max-w-xl">
              Notre système vous permet de dépenser vos Krônes uniquement sur les modules que vous utilisez. 
              Vous gardez le contrôle total de votre budget.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-white/40">Économisez jusqu&apos;à</div>
              <div className="font-display text-3xl font-bold text-amber-400">35%</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-violet-500/10 flex items-center justify-center">
              <Percent className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Hosting Options */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-semibold text-white">Options d&apos;hébergement</h2>
          <p className="mt-4 text-white/60">
            Choisissez ce qui vous convient. Cloud managé ou auto-hébergé.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
          {hostingOptions.map((option) => (
            <div
              key={option.name}
              className={`card relative p-8 ${option.recommended ? "border-violet-500/30" : ""}`}
            >
              {option.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-violet-500/30">
                  Recommandé
                </span>
              )}
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  option.recommended 
                    ? "bg-gradient-to-br from-violet-500/20 to-violet-600/10 text-violet-300"
                    : "bg-amber-500/10 text-amber-400"
                }`}>
                  <option.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">{option.name}</h3>
                  <p className="text-sm text-white/40">{option.priceNote}</p>
                </div>
              </div>
              <p className="text-white/60 mb-6">{option.description}</p>
              <ul className="space-y-3 mb-8">
                {option.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-white/80">
                    <Check className={`h-5 w-5 ${option.recommended ? "text-violet-400" : "text-amber-400"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className={`font-display text-3xl font-bold ${option.recommended ? "text-white" : "text-amber-400"}`}>
                  {option.price}
                </span>
                <Link
                  href="/dashboard"
                  className={`rounded-xl px-6 py-3 text-sm font-medium transition-all ${
                    option.recommended
                      ? "bg-violet-600 text-white hover:bg-violet-500"
                      : "border border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  }`}
                >
                  {option.recommended ? "Choisir" : "En savoir plus"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Micro-transactions */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-semibold text-white flex items-center justify-center gap-3">
            <ShoppingCart className="h-8 w-8 text-violet-400" />
            Compléments
          </h2>
          <p className="mt-4 text-white/60">
            Ajoutez des options à la carte, sans engagement.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {microTransactions.map((micro) => (
            <div key={micro.name} className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <micro.icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white">{micro.name}</h3>
              </div>
              <p className="text-sm text-white/50 mb-4">{micro.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold text-white">{micro.price}</span>
                <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                  Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

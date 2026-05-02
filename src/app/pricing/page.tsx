import { Check, Crown, Zap, Bot, Coins, ShoppingCart, Plus, Star, Server, Download } from "lucide-react";
import Link from "next/link";

const kroneOffers = [
  {
    krone: 30,
    modulePoints: 10,
    price: "2,99 €",
    description: "Très limité, idéal pour tester.",
    color: "muted",
    icon: Zap,
    popular: false,
  },
  {
    krone: 60,
    modulePoints: 25,
    price: "4,99 €",
    minEuros: "2 €",
    description: "Pour les petits serveurs.",
    color: "primary",
    icon: Bot,
    popular: true,
  },
  {
    krone: 110,
    modulePoints: 50,
    price: "8,99 €",
    description: "Pour les communautés moyennes.",
    color: "primary",
    icon: Star,
    popular: false,
  },
  {
    krone: 150,
    modulePoints: 75,
    price: "11,99 €",
    description: "Pour les gros serveurs.",
    color: "premium",
    icon: Crown,
    popular: false,
  },
  {
    krone: 200,
    modulePoints: 100,
    price: "15,99 €",
    description: "Accès complet, aucune limite.",
    color: "premium",
    icon: Crown,
    popular: false,
  },
];

const microTransactions = [
  { name: "Instance supplémentaire", description: "Ajoutez un bot supplémentaire à votre compte.", price: "1,99 €", icon: Bot },
  { name: "Profil personnalisé", description: "Personnalisez la page de profil de votre bot.", price: "0,99 €", icon: Star },
  { name: "Commande Premium", description: "Débloquez une commande Premium spécifique.", price: "1,49 €", icon: Crown },
  { name: "Pack de points +10", description: "Ajoutez 10 pts de modules à votre offre.", price: "1,99 €", icon: Plus },
  { name: "Pack de points +25", description: "Ajoutez 25 pts de modules à votre offre.", price: "3,99 €", icon: Plus },
  { name: "Support prioritaire", description: "Accédez au support dédié pendant 30 jours.", price: "2,99 €", icon: Crown },
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

const pointExamples = [
  { feature: "Auto-Rôles (simple)", cost: 1 },
  { feature: "Messages de bienvenue (simple)", cost: 1 },
  { feature: "Tickets (simple)", cost: 1 },
  { feature: "Musique (complet)", cost: 2 },
  { feature: "Modération (complet)", cost: 2 },
  { feature: "Giveaways (complet)", cost: 2 },
  { feature: "Génération IA (avancé)", cost: 3 },
  { feature: "Économie (avancé)", cost: 3 },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white">Tarifs</h1>
        <p className="mt-3 text-white/60">
          Payez en Krônes, dépensez en points de modules. Un système flexible et transparent.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
          <Coins className="h-4 w-4" />
          1 Krône ≈ 0,08 €
        </div>
      </div>

      {/* Krône offers */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kroneOffers.map((offer) => (
          <div
            key={offer.krone}
            className={`card relative p-5 ${
              offer.popular
                ? "border-primary/30 glow-primary scale-[1.02]"
                : offer.color === "premium"
                ? "border-premium/20 hover:border-premium/40"
                : ""
            }`}
          >
            {offer.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-primary-glow">
                Populaire
              </span>
            )}
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  offer.color === "premium"
                    ? "bg-amber-500/10 text-amber-400"
                    : offer.color === "primary"
                    ? "bg-violet-500/10 text-violet-400"
                    : "bg-muted/10 text-white/60"
                }`}
              >
                <offer.icon className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white">{offer.krone} Kr</span>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-extrabold text-white">{offer.price}</span>
            </div>
            <p className="text-xs text-white/60 mb-3">{offer.description}</p>
            <div className="rounded-xl border border-white/10 bg-white/3 p-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Points de modules</span>
                <span className="text-sm font-bold text-violet-400">{offer.modulePoints} pts</span>
              </div>
            </div>
            {offer.minEuros && (
              <p className="text-[10px] text-warning mb-2">
                Min. {offer.minEuros} d&apos;achat requis
              </p>
            )}
            <Link
              href="/dashboard"
              className={`block w-full rounded-xl px-3 py-2 text-center text-xs font-semibold transition-all ${
                offer.popular
                  ? "btn-shiny text-white"
                  : offer.color === "premium"
                  ? "bg-amber-500/10 text-amber-400 hover:bg-premium/20 border border-premium/30"
                  : "glass text-white hover:bg-white/8"
              }`}
            >
              Choisir
            </Link>
          </div>
        ))}
      </div>

      {/* Module points explanation */}
      <div className="mt-16 card p-6">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Coins className="h-5 w-5 text-violet-400" />
          Comment fonctionnent les points de modules ?
        </h2>
        <p className="text-sm text-white/60 mb-6">
          Chaque offre vous donne un nombre de points de modules. Vous répartissez ces points
          entre les modules de votre choix. Une feature simple coûte 1 pt, une feature complète
          coûte 2-3 pts.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 text-left font-semibold text-white">Feature</th>
                <th className="py-3 text-right font-semibold text-white">Coût en pts</th>
              </tr>
            </thead>
            <tbody>
              {pointExamples.map((ex) => (
                <tr key={ex.feature} className="border-b border-white/10/50">
                  <td className="py-2.5 text-white/60">{ex.feature}</td>
                  <td className="py-2.5 text-right">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      ex.cost === 1 ? "bg-emerald-500/10 text-emerald-400" :
                      ex.cost === 2 ? "bg-violet-500/10 text-violet-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>
                      {ex.cost} pt{ex.cost > 1 ? "s" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hosting Options */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Server className="h-6 w-6 text-violet-400" />
            Options d&apos;hébergement
          </h2>
          <p className="mt-2 text-white/60">
            Choisissez l&apos;hébergement qui vous convient. Cloud managé ou auto-hébergé.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {hostingOptions.map((option) => (
            <div
              key={option.name}
              className={`card relative p-6 ${option.recommended ? "border-primary/30" : ""}`}
            >
              {option.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-violet-500/30">
                  Recommandé
                </span>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${option.recommended ? "bg-violet-500/10 text-violet-400" : "bg-amber-500/10 text-amber-400"}`}>
                  <option.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{option.name}</h3>
                  <p className="text-xs text-white/60">{option.priceNote}</p>
                </div>
              </div>
              <p className="text-sm text-white/60 mb-4">{option.description}</p>
              <ul className="space-y-2 mb-6">
                {option.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-white">
                    <Check className={`h-4 w-4 ${option.recommended ? "text-violet-400" : "text-amber-400"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${option.recommended ? "text-white" : "text-amber-400"}`}>
                  {option.price}
                </span>
                <Link
                  href="/dashboard"
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    option.recommended
                      ? "bg-violet-500 text-white hover:bg-violet-600"
                      : "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
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
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <ShoppingCart className="h-6 w-6 text-cyan-400" />
            Micro-transactions
          </h2>
          <p className="mt-2 text-white/60">
            Ajoutez des éléments à la carte, sans engagement.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {microTransactions.map((micro) => (
            <div
              key={micro.name}
              className="card group p-5 hover:border-accent/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <micro.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">{micro.name}</h3>
              </div>
              <p className="text-xs text-white/60 mb-3">{micro.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">{micro.price}</span>
                <button className="rounded-xl border border-accent/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-accent/20 transition-all">
                  Acheter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-white">Questions fréquentes</h2>
        <div className="mt-8 mx-auto max-w-2xl space-y-4 text-left">
          {[
            {
              q: "Qu'est-ce qu'un Krône ?",
              a: "Le Krône est la monnaie virtuelle de Synkrone. 1 Krône ≈ 0,08 €. Vous achetez des Krônes puis les échangez contre des points de modules.",
            },
            {
              q: "Puis-je changer d'offre à tout moment ?",
              a: "Oui, vous pouvez upgrader à tout moment. La différence sera calculée au prorata. Les points non utilisés sont reportés.",
            },
            {
              q: "Que se passe-t-il si je dépasse mes points de modules ?",
              a: "Vous pouvez acheter des packs de points supplémentaires en micro-transaction, ou upgrader votre offre.",
            },
            {
              q: "Les points de modules sont-ils réinitialisés chaque mois ?",
              a: "Non, vos points sont conservés tant que votre abonnement est actif. Seule la répartition peut changer.",
            },
            {
              q: "Puis-je répartir mes points différemment ?",
              a: "Oui, à tout moment depuis le Dashboard. Désactivez un module pour récupérer ses points et les allouer ailleurs.",
            },
          ].map((faq) => (
            <div key={faq.q} className="card p-5">
              <h3 className="font-semibold text-white text-sm">{faq.q}</h3>
              <p className="mt-2 text-sm text-white/60">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

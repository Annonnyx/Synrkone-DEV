import { Shield, Lock, Eye, Server, Trash2, UserCheck, FileKey, Mail, Clock, AlertCircle, Scale } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 mb-6">
          <Shield className="h-4 w-4" />
          Protection des données
        </div>
        <h1 className="font-display text-4xl font-semibold text-white">Politique de confidentialité</h1>
        <p className="mt-4 text-white/50">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </div>

      {/* Introduction */}
      <div className="card p-6 mb-8">
        <p className="text-white/70 leading-relaxed">
          Synkrone s&apos;engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité 
          explique comment nous collectons, utilisons, stockons et protégeons vos données personnelles, 
          conformément au Règlement Général sur la Protection des Données (RGPD).
        </p>
      </div>

      {/* Data Controller */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Responsable du traitement</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-2">
          <p>
            <strong className="text-white">Synkrone</strong> est le responsable du traitement des données collectées sur cette plateforme.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Email : contact@synkrone.fr</li>
            <li>Discord : <a href="https://discord.gg/nuFNvVybGE" className="text-violet-400 hover:underline">Serveur Support</a></li>
          </ul>
        </div>
      </section>

      {/* Data Collection */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Eye className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Données collectées</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-4">
          <p>Nous collectons les types de données suivants :</p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-violet-400" />
                Données de compte
              </h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Adresse email</li>
                <li>Nom d&apos;utilisateur</li>
                <li>Mot de passe (chiffré)</li>
                <li>Date d&apos;inscription</li>
              </ul>
            </div>
            
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-400" />
                Données de bots
              </h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Tokens Discord (chiffrés)</li>
                <li>Noms des bots</li>
                <li>Configuration des modules</li>
                <li>Logs d&apos;activité (30 jours)</li>
              </ul>
            </div>
            
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-400" />
                Données techniques
              </h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Adresse IP (anonymisée)</li>
                <li>Type de navigateur</li>
                <li>Cookie de session</li>
                <li>Statistiques d&apos;utilisation</li>
              </ul>
            </div>
            
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-rose-400" />
                Données de transaction
              </h3>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Historique des achats</li>
                <li>Solde de Krônes</li>
                <li>Factures (10 ans)</li>
                <li>Moyens de paiement (tokenisés)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <FileKey className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Finalités du traitement</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed">
          <p className="mb-3">Vos données sont collectées pour les finalités suivantes :</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white">Fourniture du service</strong> : création et gestion de votre compte, fonctionnement des bots</li>
            <li><strong className="text-white">Sécurité</strong> : protection contre la fraude, authentification, prévention des abus</li>
            <li><strong className="text-white">Support client</strong> : réponse à vos demandes et résolution de problèmes</li>
            <li><strong className="text-white">Amélioration</strong> : analyse statistique pour améliorer nos services</li>
            <li><strong className="text-white">Obligations légales</strong> : conservation des factures, réponse aux autorités</li>
          </ul>
        </div>
      </section>

      {/* Legal Basis */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Scale className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Base légale du traitement</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed">
          <p className="mb-3">Le traitement de vos données repose sur les bases légales suivantes :</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">1</div>
              <div>
                <p className="text-white font-medium">Exécution du contrat</p>
                <p className="text-xs">Le traitement est nécessaire pour fournir les services demandés (CGU).</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">2</div>
              <div>
                <p className="text-white font-medium">Obligation légale</p>
                <p className="text-xs">Conservation des factures (Code de commerce), réponse aux réquisitions judiciaires.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">3</div>
              <div>
                <p className="text-white font-medium">Intérêt légitime</p>
                <p className="text-xs">Sécurité du service, prévention de la fraude, amélioration de l&apos;expérience utilisateur.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">4</div>
              <div>
                <p className="text-white font-medium">Consentement</p>
                <p className="text-xs">Pour les cookies non essentiels et les communications marketing (modifiable à tout moment).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Durée de conservation</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-2 text-white font-medium">Type de données</th>
                <th className="pb-2 text-white font-medium">Durée de conservation</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-white/5">
                <td className="py-3">Données de compte actif</td>
                <td className="py-3">Durée de l&apos;inscription + 1 an</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3">Tokens Discord</td>
                <td className="py-3">Jusqu&apos;à suppression du bot par l&apos;utilisateur</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3">Logs d&apos;activité</td>
                <td className="py-3">30 jours</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3">Factures</td>
                <td className="py-3">10 ans (obligation légale)</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3">Cookies de session</td>
                <td className="py-3">Session de navigation</td>
              </tr>
              <tr>
                <td className="py-3">Cookies analytiques</td>
                <td className="py-3">13 mois maximum</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* User Rights */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Vos droits (RGPD)</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed">
          <p className="mb-3">Conformément au RGPD, vous disposez des droits suivants concernant vos données :</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-white font-medium text-sm">Droit d&apos;accès</p>
              <p className="text-xs">Obtenir une copie de vos données personnelles</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-white font-medium text-sm">Droit de rectification</p>
              <p className="text-xs">Corriger des données inexactes ou incomplètes</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-white font-medium text-sm">Droit à l&apos;effacement</p>
              <p className="text-xs">Demander la suppression de vos données (droit à l&apos;oubli)</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-white font-medium text-sm">Droit à la portabilité</p>
              <p className="text-xs">Récupérer vos données dans un format structuré</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-white font-medium text-sm">Droit d&apos;opposition</p>
              <p className="text-xs">Vous opposer à certains traitements (marketing)</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-white font-medium text-sm">Droit de limitation</p>
              <p className="text-xs">Restreindre temporairement le traitement</p>
            </div>
          </div>
          <p className="mt-4 text-xs">
            Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@synkrone.fr" className="text-violet-400 hover:underline">privacy@synkrone.fr</a>. 
            Nous répondrons dans un délai maximum d&apos;un mois.
          </p>
        </div>
      </section>

      {/* Security */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Sécurité des données</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-3">
          <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles :</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong className="text-white">Chiffrement</strong> : AES-256 pour les tokens, TLS 1.3 pour les transmissions</li>
            <li><strong className="text-white">Authentification</strong> : JWT avec expiration, 2FA disponible</li>
            <li><strong className="text-white">Hébergement</strong> : Serveurs sécurisés en Europe (Hetzner/OVH)</li>
            <li><strong className="text-white">Backups</strong> : Sauvegardes chiffrées quotidiennes</li>
            <li><strong className="text-white">Audit</strong> : Tests de sécurité réguliers, monitoring 24/7</li>
          </ul>
          <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
            <p className="text-xs text-amber-400 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              En cas de violation de données, vous serez notifié dans les 72 heures conformément au RGPD.
            </p>
          </div>
        </div>
      </section>

      {/* Cookies */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Server className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Cookies et traceurs</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed space-y-3">
          <p>Notre site utilise les cookies suivants :</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="text-white text-sm">Essentiels</p>
                <p className="text-xs">Session, authentification, sécurité</p>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Obligatoires</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="text-white text-sm">Analytiques</p>
                <p className="text-xs">Statistiques d&apos;utilisation anonymes</p>
              </div>
              <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">Consentement requis</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white text-sm">Préférences</p>
                <p className="text-xs">Langue, thème, paramètres</p>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Fonctionnels</span>
            </div>
          </div>
          <p className="text-xs mt-3">
            Vous pouvez modifier vos préférences cookies à tout moment via le lien en bas de page.
          </p>
        </div>
      </section>

      {/* Third Parties */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Server className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Sous-traitants et tiers</h2>
        </div>
        <div className="text-white/60 text-sm leading-relaxed">
          <p className="mb-3">Nous faisons appel aux sous-traitants suivants :</p>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-2 text-white">Prestataire</th>
                <th className="pb-2 text-white">Service</th>
                <th className="pb-2 text-white">Localisation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-2">Hetzner/OVH</td>
                <td className="py-2">Hébergement cloud</td>
                <td className="py-2">Allemagne/France (UE)</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Stripe</td>
                <td className="py-2">Paiement sécurisé</td>
                <td className="py-2">États-Unis (SCC EU-US)</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Discord Inc.</td>
                <td className="py-2">API Discord (bots)</td>
                <td className="py-2">États-Unis</td>
              </tr>
              <tr>
                <td className="py-2">Resend/Scaleway</td>
                <td className="py-2">Envoi d&apos;emails</td>
                <td className="py-2">France (UE)</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs mt-3">
            Tous nos sous-traitants respectent les normes de protection des données (RGPD, SCC pour les transferts hors UE).
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="card-featured p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">Contact DPO</h2>
        </div>
        <p className="text-white/60 text-sm mb-4">
          Pour toute question concernant la protection de vos données ou pour exercer vos droits, contactez notre Délégué à la Protection des Données :
        </p>
        <div className="flex flex-wrap gap-3">
          <a 
            href="mailto:privacy@synkrone.fr" 
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4" />
            privacy@synkrone.fr
          </a>
          <a 
            href="https://discord.gg/nuFNvVybGE" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            Discord Support
          </a>
        </div>
        <p className="text-xs text-white/40 mt-4">
          En cas de litige, vous avez le droit d&apos;introduire une réclamation auprès de la CNIL (France).
        </p>
      </section>
    </div>
  );
}

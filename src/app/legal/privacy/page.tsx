export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Politique de confidentialité</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-sm text-muted">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

        <h2 className="text-lg font-semibold text-foreground">1. Données collectées</h2>
        <p>
          Nous collectons : adresse email, nom d&apos;utilisateur, Discord ID (si lié), tokens de bots (chiffrés), données d&apos;utilisation des modules.
        </p>

        <h2 className="text-lg font-semibold text-foreground">2. Utilisation des données</h2>
        <p>
          Les données servent exclusivement à : fournir le service, améliorer l&apos;expérience utilisateur, facturer les abonnements, et assurer le support technique.
        </p>

        <h2 className="text-lg font-semibold text-foreground">3. Sécurité des tokens</h2>
        <p>
          Les tokens Discord sont chiffrés en repos et en transit. Seuls les systèmes autorisés de Synkrone y accèdent pour faire fonctionner vos bots.
        </p>

        <h2 className="text-lg font-semibold text-foreground">4. Partage des données</h2>
        <p>
          Vos données ne sont jamais vendues. Elles peuvent être partagées avec des prestataires techniques nécessaires au fonctionnement du service (hébergement, paiement).
        </p>

        <h2 className="text-lg font-semibold text-foreground">5. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données. Contactez-nous via notre Discord support.
        </p>

        <h2 className="text-lg font-semibold text-foreground">6. Cookies</h2>
        <p>
          Nous utilisons des cookies essentiels au fonctionnement du site. Aucun cookie publicitaire n&apos;est déposé.
        </p>

        <h2 className="text-lg font-semibold text-foreground">7. Conservation des données</h2>
        <p>
          Les données sont conservées tant que votre compte est actif, puis supprimées dans un délai de 30 jours après la fermeture du compte.
        </p>
      </div>
    </div>
  );
}

// Mapping ModuleDef.moduleId → liste de Cogs Python (notation pointée
// `category.name` exactement comme dans bot.config.json["commands"]).
//
// Source de vérité : les fichiers manifest.json dans
// `synkrone-bot/commands/<module>/<command>.manifest.json`. Voir
// `src/lib/command-manifests.ts` pour le loader.
//
// Cette table est conservée comme FALLBACK SYNCHRONE :
//   - utilisée par `provisionBot` qui tourne dans un context sync friendly
//     (et tolère l'absence du manifest, rare en prod).
//   - permet aux modules sans manifest (placeholders type "welcome",
//     "tickets") de rester visibles dans le dashboard sans commande.
//
// Pour lister vraiment les commandes (avec prix, permissions, etc.),
// utiliser `loadCommandManifests()` depuis command-manifests.ts.
export const MODULE_TO_COGS: Record<string, string[]> = {
  moderation: ["moderation.ban"],
  fun: ["fun.poll"],
  utility: ["utility.ping"],
  // Modules placeholders — pas encore de Cog livré
  autorole: [],
  generation: [],
  economy: [],
  music: [],
  tickets: [],
  welcome: [],
  giveaway: [],
};

export function cogsForModule(moduleId: string): string[] {
  return MODULE_TO_COGS[moduleId] ?? [];
}

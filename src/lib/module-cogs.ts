// Mapping ModuleDef.moduleId → liste de Cogs Python (notation pointée
// `category.name` exactement comme dans bot.config.json["commands"]).
//
// Quand un module est activé dans le dashboard, ses Cogs sont injectés dans
// bot.config.json puis le bot est redémarré. Les Cogs doivent exister dans
// /Partage/Synkrone/commands/ — sinon `bot.load_extension` log une erreur mais
// le bot continue à tourner.
//
// Modules sans Cog associé (ex. "welcome", "tickets" pas encore implémentés)
// retournent une liste vide : ils restent visibles dans le dashboard mais
// n'ajoutent aucune commande au bot tant qu'on n'a pas livré le Cog.
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

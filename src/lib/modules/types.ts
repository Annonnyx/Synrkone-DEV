export type ModuleCategory =
  | "moderation"
  | "utility"
  | "fun"
  | "economy"
  | "music"
  | "ai"
  | "management"
  | "web"
  | "custom";

export interface CommandDefinition {
  id: string;
  name: string;
  description: string;
  usage: string;
  premium: boolean;
  module: string;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  premium: boolean;
  enabled: boolean;
  category: ModuleCategory;
  pointCost: number;       // Coût en pts de module (1 = simple, 2-3 = complet)
  commands?: CommandDefinition[];
}

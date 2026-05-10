// Source of truth for the on-disk storage layout.
//
// All API routes that touch the filesystem must import STORAGE_ROOT from here
// instead of hard-coding paths, otherwise the API routes can disagree about
// where files live (e.g. /api/boxes creating a directory under one root and
// /api/files writing to a different root).
//
// The default matches the production layout described in the project README:
//   /Partage/Synkrone/
//     boxes/<userId>/        ← per-user developer boxes
//     projects/              ← shared project files
//     vps-root/              ← VPS-root files (OWNER only)
//     bots/<botId>/          ← bot working dirs (modules, configs)
//
// Override in development by setting VPS_STORAGE_PATH in .env.
export const STORAGE_ROOT =
  process.env.VPS_STORAGE_PATH ?? "/Partage/Synkrone";

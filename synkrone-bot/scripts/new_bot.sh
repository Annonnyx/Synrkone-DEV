#!/usr/bin/env bash
#
# Usage: bash new_bot.sh client_name
#
# Génère un nouveau bot dans /bots/<client_name>/ à partir du template, puis
# l'enregistre dans PM2 en utilisant le venv partagé /Partage/Synkrone/.venv/.
# Le bot est lancé immédiatement après création.
#
# Rien n'est cloné par bot — tous les bots partagent /Partage/Synkrone/.venv/
# et /Partage/Synkrone/commands/.
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <client_name>" >&2
  exit 1
fi

CLIENT_NAME="$1"
SAFE_NAME="$(echo -n "$CLIENT_NAME" | tr -c 'a-zA-Z0-9_-' '_' | sed 's/_\+/_/g')"

if [[ -z "$SAFE_NAME" ]]; then
  echo "Nom de client invalide après nettoyage." >&2
  exit 1
fi

BOTS_ROOT="${BOTS_ROOT:-/bots}"
SHARED_ROOT="${SHARED_ROOT:-/Partage/Synkrone}"
VENV_PYTHON="${SHARED_ROOT}/.venv/bin/python"
LOG_DIR="${LOG_DIR:-/var/log/synkrone}"
BOT_DIR="${BOTS_ROOT}/${SAFE_NAME}"
PM2_NAME="synkrone_${SAFE_NAME}"

if [[ -e "$BOT_DIR" ]]; then
  echo "Le dossier ${BOT_DIR} existe déjà." >&2
  exit 1
fi

if [[ ! -x "$VENV_PYTHON" ]]; then
  echo "Venv partagé introuvable: ${VENV_PYTHON}" >&2
  echo "Lance d'abord scripts/setup_shared_env.sh sur le VPS." >&2
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 n'est pas installé sur ce VPS." >&2
  exit 1
fi

mkdir -p "$BOT_DIR"
mkdir -p "$LOG_DIR"

# main.py — réutilise le template du bot exemple
TEMPLATE_DIR="$(cd "$(dirname "$0")/.." && pwd)/bots/client_example"
if [[ ! -f "${TEMPLATE_DIR}/main.py" ]]; then
  echo "Template introuvable: ${TEMPLATE_DIR}/main.py" >&2
  exit 1
fi
cp "${TEMPLATE_DIR}/main.py" "${BOT_DIR}/main.py"

# bot.config.json — config minimale, à éditer ensuite par l'admin
cat > "${BOT_DIR}/bot.config.json" <<JSON
{
  "name": "${SAFE_NAME}",
  "prefix": "!",
  "intents": ["default", "members", "message_content"],
  "commands": [
    "utility.ping"
  ]
}
JSON

# .enc — variables d'environnement (BOT_TOKEN à remplir)
cat > "${BOT_DIR}/.enc" <<ENV
BOT_TOKEN=replace_with_real_token
PREFIX=!
LOG_LEVEL=INFO
GUILD_ID=
MOD_LOG_CHANNEL_ID=
ENV
chmod 600 "${BOT_DIR}/.enc"

# Lance le bot avec PM2 (interpréteur = venv partagé)
pm2 start "${BOT_DIR}/main.py" \
  --name "${PM2_NAME}" \
  --interpreter "${VENV_PYTHON}" \
  --cwd "${BOT_DIR}" \
  --output "${LOG_DIR}/${SAFE_NAME}.out.log" \
  --error  "${LOG_DIR}/${SAFE_NAME}.err.log" \
  --merge-logs \
  --time \
  --update-env \
  --env SYNKRONE_SHARED_ROOT="${SHARED_ROOT}" \
  --env PYTHONUNBUFFERED=1

pm2 save

echo
echo "✓ Bot créé : ${BOT_DIR}"
echo "✓ Process PM2 : ${PM2_NAME}"
echo
echo "Étapes suivantes :"
echo "  1. Édite ${BOT_DIR}/.enc et renseigne BOT_TOKEN."
echo "  2. Édite ${BOT_DIR}/bot.config.json pour activer les commandes voulues."
echo "  3. pm2 restart ${PM2_NAME}"

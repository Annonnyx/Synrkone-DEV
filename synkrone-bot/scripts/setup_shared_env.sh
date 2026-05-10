#!/usr/bin/env bash
#
# Provisionne l'arborescence partagée Synkrone et le venv Python unique.
# À exécuter UNE SEULE FOIS sur le VPS, puis à chaque mise à jour des
# dépendances (`pip install -r requirements.txt`).
#
# Idempotent : on peut le relancer sans casser une installation existante.
set -euo pipefail

SHARED_ROOT="${SHARED_ROOT:-/Partage/Synkrone}"
BOTS_ROOT="${BOTS_ROOT:-/bots}"
LOG_DIR="${LOG_DIR:-/var/log/synkrone}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Création de l'arborescence partagée"
sudo mkdir -p \
  "${SHARED_ROOT}/.venv" \
  "${SHARED_ROOT}/commands" \
  "${SHARED_ROOT}/libs" \
  "${SHARED_ROOT}/boxes" \
  "${BOTS_ROOT}" \
  "${LOG_DIR}"

# Le user qui run l'app web (souvent www-data ou ubuntu) doit posséder ces dirs.
OWNER="${OWNER_USER:-$USER}"
sudo chown -R "${OWNER}:${OWNER}" "${SHARED_ROOT}" "${BOTS_ROOT}" "${LOG_DIR}"

echo "==> Synchronisation des commandes partagées"
# rsync préserve les .py existants et ne supprime rien d'inattendu.
rsync -a --delete \
  --exclude '__pycache__' \
  "${REPO_ROOT}/commands/" "${SHARED_ROOT}/commands/"

if [[ -d "${REPO_ROOT}/libs" ]]; then
  rsync -a --delete \
    --exclude '__pycache__' \
    "${REPO_ROOT}/libs/" "${SHARED_ROOT}/libs/"
fi

echo "==> Création du venv Python partagé (si manquant)"
if [[ ! -x "${SHARED_ROOT}/.venv/bin/python" ]]; then
  python3 -m venv "${SHARED_ROOT}/.venv"
fi

echo "==> Installation/MAJ des dépendances Python"
"${SHARED_ROOT}/.venv/bin/pip" install --upgrade pip
"${SHARED_ROOT}/.venv/bin/pip" install -r "${REPO_ROOT}/requirements.txt"

echo "==> Déploiement du bot exemple dans ${BOTS_ROOT}/client_example"
if [[ ! -d "${BOTS_ROOT}/client_example" ]]; then
  cp -r "${REPO_ROOT}/bots/client_example" "${BOTS_ROOT}/client_example"
  chmod 600 "${BOTS_ROOT}/client_example/.enc"
fi

echo "==> Déploiement de ecosystem.config.js et new_bot.sh dans /var/www/synkrone"
sudo install -m 0644 -o "${OWNER}" -g "${OWNER}" \
  "${REPO_ROOT}/ecosystem.config.js" /var/www/synkrone/ecosystem.config.js
sudo install -m 0755 -o "${OWNER}" -g "${OWNER}" \
  "${REPO_ROOT}/scripts/new_bot.sh" /var/www/synkrone/new_bot.sh

echo
echo "✓ Setup terminé."
echo
echo "Vérifs rapides :"
echo "  ${SHARED_ROOT}/.venv/bin/python -c 'import discord; print(discord.__version__)'"
echo "  ls ${SHARED_ROOT}/commands"
echo
echo "Démarrer le bot exemple :"
echo "  pm2 start /var/www/synkrone/ecosystem.config.js"

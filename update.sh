#!/usr/bin/env bash
# ==============================================================================
# CAKUE - 1-CLICK ALL-IN-ONE UPDATE SCRIPT
# Otomatis update Home Server (Mini PC) + Trigger Build APK & EXE di GitHub Cloud
# ==============================================================================

set -e

# Warna Terminal
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "\n${CYAN}${BOLD}====================================================${NC}"
echo -e "${CYAN}${BOLD}       🚀 CAKUE AUTO-DEPLOY & CLOUD BUILDER         ${NC}"
echo -e "${CYAN}${BOLD}====================================================${NC}\n"

# 1. Tentukan Pesan Commit
COMMIT_MSG="$1"
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="chore: update application $(date '+%Y-%m-%d %H:%M:%S')"
fi

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_USER="wargasipil"
SERVER_APP_DIR="/home/wargasipil/apps/cakue"

# 2. Deteksi Rute Koneksi Server (Lokal vs Tailscale)
echo -e "${YELLOW}🔍 [1/4] Mendeteksi rute koneksi ke Home Server...${NC}"
SERVER_IP=""

if ssh -o BatchMode=yes -o ConnectTimeout=2 ${SERVER_USER}@192.168.1.13 "exit" 2>/dev/null; then
    SERVER_IP="192.168.1.13"
    echo -e "${GREEN}✓ Terhubung via Jaringan Wi-Fi Rumah (${SERVER_IP})${NC}"
elif ssh -o BatchMode=yes -o ConnectTimeout=3 ${SERVER_USER}@100.88.200.16 "exit" 2>/dev/null; then
    SERVER_IP="100.88.200.16"
    echo -e "${GREEN}✓ Terhubung via Tailscale Mesh Network (${SERVER_IP})${NC}"
else
    echo -e "${RED}⚠️  Gagal menjangkau Mini PC (192.168.1.13 maupun 100.88.200.16).${NC}"
    echo -e "${YELLOW}Pastikan Mini PC menyala dan Tailscale Anda aktif jika sedang di luar rumah.${NC}"
    read -p "Lewati update server dan tetap push ke GitHub? (y/n): " SKIP_SERVER
    if [[ "$SKIP_SERVER" != "y" && "$SKIP_SERVER" != "Y" ]]; then
        exit 1
    fi
fi

# 3. Sinkronisasi & Reload Server Mini PC
if [ -n "$SERVER_IP" ]; then
    echo -e "\n${YELLOW}📦 [2/4] Mensinkronkan file ke Mini PC (${SERVER_IP})...${NC}"
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude 'dist' \
        --exclude 'release' \
        --exclude 'android' \
        --exclude 'auth_info_baileys' \
        "${PROJECT_DIR}/" "${SERVER_USER}@${SERVER_IP}:${SERVER_APP_DIR}/"

    echo -e "\n${YELLOW}🔄 [3/4] Membangun ulang container di Mini PC...${NC}"
    ssh ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_APP_DIR} && docker compose -f docker-compose.server.yml up -d --build frontend backend adminer"
    echo -e "${GREEN}✓ Server Mini PC berhasil diperbarui dan berjalan online!${NC}"
fi

# 4. Git Push & Trigger GitHub Actions (Build APK & EXE)
echo -e "\n${YELLOW}☁️  [4/4] Mengirim update ke GitHub & Menjalankan Build Cloud...${NC}"
cd "$PROJECT_DIR"

# Stage all changes
git add -A

# Check if there is anything to commit
if git diff --staged --quiet; then
    echo -e "${GREEN}✓ Tidak ada perubahan file lokal yang perlu dicommit.${NC}"
else
    git commit -m "$COMMIT_MSG"
fi

# Push ke main
echo -e "${CYAN}Mengunggah commit ke repository GitHub (thirza-rep/cakuev2)...${NC}"
git push origin main

echo -e "\n${GREEN}${BOLD}====================================================${NC}"
echo -e "${GREEN}${BOLD}   🎉 SEMUA PROSES UPDATE BERHASIL DIJALANKAN!      ${NC}"
echo -e "${GREEN}${BOLD}====================================================${NC}\n"
echo -e "📍 ${BOLD}Akses Server Mini PC Anda:${NC}"
echo -e "   • CAKUE Web App : ${CYAN}http://${SERVER_IP:-100.88.200.16}:5173${NC}"
echo -e "   • Adminer DB    : ${CYAN}http://${SERVER_IP:-100.88.200.16}:8088${NC}"
echo -e "   • WA Gateway    : ${CYAN}http://${SERVER_IP:-100.88.200.16}:3333${NC}"
echo -e "\n📱 ${BOLD}Pantau Build APK & Windows EXE di Cloud:${NC}"
echo -e "   • GitHub Actions: ${CYAN}https://github.com/thirza-rep/cakuev2/actions${NC}\n"

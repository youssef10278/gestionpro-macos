#!/bin/bash

# Script pour tester le build macOS localement
# Utilise les mêmes étapes que GitHub Actions

set -e  # Arrêter en cas d'erreur

echo "🍎 Build macOS Local - GestionPro"
echo "=================================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier que nous sommes sur macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    log_error "Ce script doit être exécuté sur macOS"
    exit 1
fi

log_success "Système macOS détecté"

# Vérifier les prérequis
log_info "Vérification des prérequis..."

# Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé"
    log_info "Installez Node.js depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
log_success "Node.js: $NODE_VERSION"

# npm
if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas disponible"
    exit 1
fi

NPM_VERSION=$(npm --version)
log_success "npm: $NPM_VERSION"

# Python (pour les modules natifs)
if ! command -v python3 &> /dev/null; then
    log_warning "Python3 non trouvé - peut causer des problèmes avec les modules natifs"
else
    PYTHON_VERSION=$(python3 --version)
    log_success "Python: $PYTHON_VERSION"
fi

# Homebrew
if ! command -v brew &> /dev/null; then
    log_warning "Homebrew non trouvé - certaines dépendances peuvent manquer"
    log_info "Installez Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
else
    log_success "Homebrew disponible"
fi

echo ""

# Installer les dépendances système
log_info "Installation des dépendances système..."

if command -v brew &> /dev/null; then
    # Liste des packages nécessaires
    BREW_PACKAGES=("pkg-config" "cairo" "pango" "libpng" "jpeg" "giflib" "librsvg")
    
    for package in "${BREW_PACKAGES[@]}"; do
        if brew list "$package" &> /dev/null; then
            log_success "$package déjà installé"
        else
            log_info "Installation de $package..."
            if brew install "$package"; then
                log_success "$package installé"
            else
                log_warning "Échec installation de $package - continuons"
            fi
        fi
    done
else
    log_warning "Homebrew non disponible - dépendances système ignorées"
fi

echo ""

# Naviguer vers le dossier du projet
if [ ! -d "projet-gestion-maitre" ]; then
    log_error "Dossier projet-gestion-maitre non trouvé"
    log_info "Exécutez ce script depuis la racine du projet"
    exit 1
fi

cd projet-gestion-maitre
log_success "Navigation vers projet-gestion-maitre"

# Vérifier package.json
if [ ! -f "package.json" ]; then
    log_error "package.json non trouvé"
    exit 1
fi

# Installer les dépendances
log_info "Installation des dépendances npm..."
if npm ci; then
    log_success "Dépendances installées"
else
    log_warning "npm ci a échoué, tentative avec npm install..."
    if npm install; then
        log_success "Dépendances installées avec npm install"
    else
        log_error "Impossible d'installer les dépendances"
        exit 1
    fi
fi

echo ""

# Configuration macOS
log_info "Configuration de l'environnement macOS..."
if npm run setup:macos; then
    log_success "Configuration macOS terminée"
else
    log_warning "Configuration macOS a échoué - continuons"
fi

echo ""

# Build CSS
log_info "Compilation des styles CSS..."
if npm run build-css; then
    log_success "CSS compilé"
else
    log_error "Échec de la compilation CSS"
    exit 1
fi

# Préparation de la base de données
log_info "Préparation de la base de données..."
if npm run create-clean-db; then
    log_success "Base de données préparée"
else
    log_warning "Préparation de la base de données a échoué - continuons"
fi

echo ""

# Menu de choix du type de build
echo "Choisissez le type de build:"
echo "1) Intel uniquement (x64)"
echo "2) Apple Silicon uniquement (arm64)"
echo "3) Universel (x64 + arm64)"
echo "4) Tous les types"
echo ""

read -p "Votre choix (1-4): " choice

case $choice in
    1)
        log_info "Build Intel (x64)..."
        BUILD_COMMAND="dist:mac --arch=x64"
        ;;
    2)
        log_info "Build Apple Silicon (arm64)..."
        BUILD_COMMAND="dist:mac --arch=arm64"
        ;;
    3)
        log_info "Build Universel..."
        BUILD_COMMAND="dist:mac-universal"
        ;;
    4)
        log_info "Build de tous les types..."
        BUILD_COMMAND="dist:mac"
        ;;
    *)
        log_warning "Choix invalide, utilisation du build par défaut (Intel + Apple Silicon)"
        BUILD_COMMAND="dist:mac"
        ;;
esac

echo ""

# Lancer le build
log_info "Lancement du build macOS..."
log_info "Commande: npm run $BUILD_COMMAND"
log_warning "Cela peut prendre plusieurs minutes..."

export NODE_ENV=production
export CSC_IDENTITY_AUTO_DISCOVERY=false

if npm run $BUILD_COMMAND; then
    log_success "Build terminé avec succès!"
else
    log_error "Échec du build"
    exit 1
fi

echo ""

# Afficher les résultats
log_info "Résultats du build:"
if [ -d "dist" ]; then
    echo ""
    echo "Contenu du dossier dist/:"
    ls -la dist/
    
    # Afficher les fichiers DMG créés
    if ls dist/*.dmg 1> /dev/null 2>&1; then
        echo ""
        log_success "Fichiers DMG créés:"
        ls -lh dist/*.dmg
    fi
    
    # Afficher les fichiers ZIP créés
    if ls dist/*.zip 1> /dev/null 2>&1; then
        echo ""
        log_success "Fichiers ZIP créés:"
        ls -lh dist/*.zip
    fi
    
    # Calculer la taille totale
    TOTAL_SIZE=$(du -sh dist/ | cut -f1)
    echo ""
    log_info "Taille totale du build: $TOTAL_SIZE"
    
else
    log_warning "Dossier dist/ non trouvé"
fi

echo ""
log_success "Build macOS terminé!"
log_info "Les fichiers sont disponibles dans le dossier dist/"

# Instructions pour tester
echo ""
echo "🧪 Pour tester l'application:"
echo "1. Ouvrez le fichier .dmg dans dist/"
echo "2. Glissez GestionPro vers Applications"
echo "3. Lancez l'application depuis Applications"
echo ""
echo "💡 Pour distribuer:"
echo "- Fichier .dmg: Installation classique"
echo "- Fichier .zip: Version portable"
echo ""

log_success "Script terminé!"

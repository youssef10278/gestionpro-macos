# 🍎 GestionPro - Build macOS

Guide complet pour générer une version macOS de GestionPro en utilisant GitHub Actions.

## 🎯 **Vue d'ensemble**

Ce projet inclut maintenant le support complet pour macOS avec :
- ✅ **Build automatique** via GitHub Actions
- ✅ **Support Intel et Apple Silicon** (architectures x64 et arm64)
- ✅ **Génération DMG** pour installation
- ✅ **Version ZIP** portable
- ✅ **Gestion des modules natifs** (better-sqlite3, bcrypt)
- ✅ **Configuration automatique** des dépendances

## 🚀 **Méthode 1: Build via GitHub Actions (Recommandé)**

### **Étapes simples:**

1. **Pusher votre code** sur GitHub
2. **Déclencher le workflow** automatiquement ou manuellement
3. **Télécharger les artifacts** générés

### **Déclenchement automatique:**
```bash
# Le build se lance automatiquement sur:
git push origin main        # Push sur main/master
git tag v2.1.0              # Création d'un tag
git push origin v2.1.0      # Push du tag
```

### **Déclenchement manuel:**
1. Allez sur GitHub → Actions
2. Sélectionnez "Build macOS App"
3. Cliquez "Run workflow"
4. Choisissez la branche et lancez

### **Récupération des builds:**
1. Allez dans Actions → Workflow terminé
2. Scrollez vers le bas → "Artifacts"
3. Téléchargez :
   - `gestionpro-macos-intel-[hash]` (Intel uniquement)
   - `gestionpro-macos-universal-[hash]` (Intel + Apple Silicon)

## 🛠️ **Méthode 2: Build local sur macOS**

Si vous avez accès à un Mac, vous pouvez builder localement :

### **Prérequis:**
```bash
# 1. Installer Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Installer Node.js (version 18+)
brew install node

# 3. Installer les dépendances système
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### **Build local:**
```bash
# 1. Cloner le projet
git clone [votre-repo]
cd projet-gestion-maitre

# 2. Installer les dépendances
npm install

# 3. Lancer le script de build
chmod +x build-macos-local.sh
./build-macos-local.sh
```

## 📦 **Types de builds disponibles**

### **1. Intel (x64)**
- Compatible avec les Macs Intel
- Taille plus petite
- Commande: `npm run dist:mac --arch=x64`

### **2. Apple Silicon (arm64)**
- Compatible avec les Macs M1/M2/M3
- Performance optimisée
- Commande: `npm run dist:mac --arch=arm64`

### **3. Universel**
- Compatible avec tous les Macs
- Taille plus importante (contient les deux architectures)
- Commande: `npm run dist:mac-universal`

## 🔧 **Configuration technique**

### **Modules natifs supportés:**
- ✅ **better-sqlite3** - Base de données SQLite
- ✅ **bcrypt** - Hachage des mots de passe
- ✅ **node-machine-id** - Identification machine

### **Formats de sortie:**
- 📦 **DMG** - Installateur macOS classique
- 🗜️ **ZIP** - Version portable
- 📁 **APP** - Application macOS non packagée

### **Sécurité macOS:**
- 🔒 **Hardened Runtime** activé
- 📝 **Entitlements** configurés pour les permissions nécessaires
- ⚠️ **Code signing** désactivé (peut être activé avec certificats)

## 🎨 **Personnalisation**

### **Icône de l'application:**
1. Placez votre icône PNG (512x512) dans `src/assets/icon.png`
2. Le script créera automatiquement l'icône .icns pour macOS
3. Ou utilisez le script: `node build/create-mac-icon.js`

### **Configuration DMG:**
Modifiez dans `package.json` → `build.dmg`:
```json
{
  "title": "GestionPro ${version}",
  "background": "build/dmg-background.png",
  "window": { "width": 540, "height": 380 }
}
```

## 🧪 **Test et validation**

### **Tests automatiques dans GitHub Actions:**
- ✅ Installation des dépendances
- ✅ Compilation des modules natifs
- ✅ Build de l'application
- ✅ Génération des artifacts
- ✅ Upload des résultats

### **Test local:**
```bash
# Après le build local
open dist/GestionPro-2.1.0.dmg    # Ouvrir le DMG
# Ou
open dist/mac/GestionPro.app       # Lancer directement l'app
```

## 🚨 **Résolution des problèmes**

### **Erreur: "better-sqlite3 compilation failed"**
```bash
# Solution 1: Reconstruire le module
npm rebuild better-sqlite3

# Solution 2: Réinstaller
npm uninstall better-sqlite3
npm install better-sqlite3

# Solution 3: Utiliser le script de setup
npm run setup:macos
```

### **Erreur: "No provisioning profile found"**
```bash
# Désactiver le code signing temporairement
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run dist:mac
```

### **Erreur: "Python not found"**
```bash
# Installer Python via Homebrew
brew install python@3.11
```

### **Build lent ou qui plante:**
```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules
npm install

# Augmenter la mémoire Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dist:mac
```

## 📊 **Monitoring des builds**

### **GitHub Actions:**
- 📈 **Durée moyenne:** 15-25 minutes
- 💾 **Taille artifacts:** 200-400 MB
- 🔄 **Retention:** 30 jours

### **Logs utiles:**
```bash
# Voir les logs détaillés
DEBUG=electron-builder npm run dist:mac

# Voir les modules natifs
npm ls better-sqlite3 bcrypt
```

## 🎉 **Distribution**

### **Pour vos clients:**
1. **Téléchargez** l'artifact depuis GitHub Actions
2. **Extrayez** le fichier ZIP
3. **Partagez** le fichier .dmg avec votre client
4. **Instructions client:**
   - Ouvrir le .dmg
   - Glisser GestionPro vers Applications
   - Lancer depuis Applications

### **Signature de code (optionnel):**
Pour la distribution publique, vous pouvez ajouter la signature:
```bash
# Avec certificat Apple Developer
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate-password"
npm run dist:mac
```

## 📞 **Support**

### **Problèmes de build:**
1. Vérifiez les logs GitHub Actions
2. Testez le build local si possible
3. Vérifiez les versions Node.js/npm
4. Consultez les issues GitHub

### **Problèmes client:**
1. Vérifiez la compatibilité macOS (10.15+)
2. Testez sur Intel et Apple Silicon
3. Vérifiez les permissions de sécurité macOS

---

**Version:** 2.1.0  
**Dernière mise à jour:** Janvier 2024  
**Support macOS:** 10.15+ (Catalina et plus récent)

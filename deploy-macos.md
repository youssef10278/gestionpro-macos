# 🚀 Guide de Déploiement macOS - GestionPro

## 📋 **Checklist de déploiement**

### ✅ **Étape 1: Préparation du repository**

1. **Vérifiez que tous les fichiers sont présents:**
   ```bash
   # Fichiers de configuration macOS
   ✅ projet-gestion-maitre/.github/workflows/build-macos.yml
   ✅ projet-gestion-maitre/.github/workflows/test-macos-build.yml
   ✅ projet-gestion-maitre/build/entitlements.mac.plist
   ✅ projet-gestion-maitre/build/create-mac-icon.js
   ✅ projet-gestion-maitre/build/setup-macos-build.js
   ✅ projet-gestion-maitre/build-macos-local.sh
   ✅ projet-gestion-maitre/README-MACOS.md
   ```

2. **Vérifiez package.json:**
   ```bash
   # Scripts ajoutés
   ✅ "dist:mac": "npm run create-clean-db && electron-builder --mac"
   ✅ "dist:mac-universal": "npm run create-clean-db && electron-builder --mac --universal"
   ✅ "setup:macos": "node build/setup-macos-build.js"
   
   # Configuration build.mac ajoutée
   ✅ Configuration DMG
   ✅ Entitlements
   ✅ Architectures (x64, arm64)
   ```

### ✅ **Étape 2: Test local (optionnel)**

Si vous avez un Mac disponible:
```bash
cd projet-gestion-maitre
chmod +x build-macos-local.sh
./build-macos-local.sh
```

### ✅ **Étape 3: Commit et push**

```bash
# Ajouter tous les nouveaux fichiers
git add .

# Commit avec message descriptif
git commit -m "feat: Add macOS build support with GitHub Actions

- Add GitHub Actions workflow for macOS builds (Intel + Apple Silicon)
- Add macOS-specific electron-builder configuration
- Add native modules setup for macOS (better-sqlite3, bcrypt)
- Add entitlements and DMG configuration
- Add local build script for testing
- Add comprehensive macOS documentation"

# Push vers GitHub
git push origin main
```

### ✅ **Étape 4: Déclencher le build**

**Option A: Build automatique**
```bash
# Le build se lance automatiquement après le push
# Allez sur GitHub → Actions pour voir le progrès
```

**Option B: Build manuel**
1. Allez sur GitHub → Actions
2. Sélectionnez "Build macOS App"
3. Cliquez "Run workflow"
4. Sélectionnez la branche `main`
5. Cliquez "Run workflow"

### ✅ **Étape 5: Surveillance du build**

1. **Allez sur GitHub Actions**
2. **Cliquez sur le workflow en cours**
3. **Surveillez les étapes:**
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Install system dependencies
   - ✅ Install dependencies
   - ✅ Build CSS
   - ✅ Build macOS app (Intel)
   - ✅ Build macOS app (Universal)
   - ✅ Upload artifacts

**Durée estimée:** 15-25 minutes

### ✅ **Étape 6: Télécharger les builds**

1. **Une fois le workflow terminé:**
   - Scrollez vers le bas de la page du workflow
   - Section "Artifacts"

2. **Téléchargez:**
   - `gestionpro-macos-intel-[hash].zip` (Intel uniquement)
   - `gestionpro-macos-universal-[hash].zip` (Intel + Apple Silicon)

3. **Contenu des archives:**
   ```
   gestionpro-macos-intel-[hash]/
   ├── GestionPro-2.1.0-x64.dmg      # Installateur Intel
   ├── GestionPro-2.1.0-x64.zip      # Version portable Intel
   └── mac/
       └── GestionPro.app             # Application non packagée
   ```

### ✅ **Étape 7: Test des builds**

**Si vous avez un Mac:**
1. Téléchargez et extrayez l'archive
2. Ouvrez le fichier .dmg
3. Glissez GestionPro vers Applications
4. Lancez l'application
5. Testez les fonctionnalités principales

**Si vous n'avez pas de Mac:**
1. Envoyez les fichiers à votre client
2. Demandez-lui de tester
3. Collectez les retours

## 🎯 **Livraison au client**

### **Fichiers à envoyer:**

1. **Pour installation classique:**
   - `GestionPro-2.1.0-universal.dmg` (recommandé)
   - Ou `GestionPro-2.1.0-x64.dmg` (Intel uniquement)

2. **Pour version portable:**
   - `GestionPro-2.1.0-universal.zip`
   - Ou `GestionPro-2.1.0-x64.zip`

### **Instructions client:**

```markdown
# Installation GestionPro sur macOS

## Méthode 1: Installation via DMG (Recommandé)
1. Double-cliquez sur GestionPro-2.1.0-universal.dmg
2. Glissez l'icône GestionPro vers le dossier Applications
3. Lancez GestionPro depuis Applications

## Méthode 2: Version portable
1. Décompressez GestionPro-2.1.0-universal.zip
2. Double-cliquez sur GestionPro.app pour lancer

## Première utilisation
- Utilisateur: proprietaire
- Mot de passe: admin
- ⚠️ Changez le mot de passe après la première connexion

## Compatibilité
- macOS 10.15 (Catalina) ou plus récent
- Compatible Intel et Apple Silicon (M1/M2/M3)
```

## 🔧 **Dépannage**

### **Build échoue sur GitHub Actions:**

1. **Vérifiez les logs:**
   - Cliquez sur l'étape qui a échoué
   - Lisez le message d'erreur

2. **Erreurs communes:**
   ```bash
   # Erreur: better-sqlite3 compilation
   # Solution: Vérifiez les dépendances système
   
   # Erreur: Python not found
   # Solution: Vérifiez la version Python dans le workflow
   
   # Erreur: Out of memory
   # Solution: Ajoutez NODE_OPTIONS="--max-old-space-size=4096"
   ```

3. **Re-déclencher le build:**
   - Allez sur Actions → Workflow échoué
   - Cliquez "Re-run all jobs"

### **Application ne se lance pas sur macOS:**

1. **Problème de sécurité macOS:**
   ```bash
   # Le client doit autoriser l'application
   # Système → Sécurité → Autoriser GestionPro
   ```

2. **Architecture incompatible:**
   - Utilisez la version universelle
   - Ou la version spécifique à l'architecture

## 📊 **Monitoring continu**

### **Automatisation future:**

1. **Build sur chaque release:**
   ```bash
   # Créer un tag pour déclencher le build
   git tag v2.1.1
   git push origin v2.1.1
   ```

2. **Tests automatiques:**
   - Le workflow de test se lance sur chaque PR
   - Valide la configuration avant le build

3. **Notifications:**
   - Configurez les notifications GitHub
   - Recevez un email quand le build est prêt

## 🎉 **Félicitations !**

Vous avez maintenant un système complet pour générer des versions macOS de GestionPro sans avoir besoin d'un Mac !

**Avantages:**
- ✅ Build automatique via GitHub Actions
- ✅ Support Intel et Apple Silicon
- ✅ Gestion des modules natifs
- ✅ Configuration professionnelle
- ✅ Tests automatiques
- ✅ Documentation complète

**Prochaines étapes possibles:**
- 🔐 Ajouter la signature de code Apple
- 📦 Automatiser la distribution
- 🧪 Ajouter plus de tests automatiques
- 📊 Monitoring des performances

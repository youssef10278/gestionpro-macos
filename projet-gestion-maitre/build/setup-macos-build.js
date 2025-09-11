#!/usr/bin/env node

/**
 * Script de configuration pour le build macOS
 * Gère les dépendances natives et la préparation du build
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🍎 Configuration du build macOS...');
console.log('');

// Fonction utilitaire pour exécuter des commandes
function runCommand(command, description, optional = false) {
    try {
        console.log(`🔄 ${description}...`);
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} - OK`);
        return true;
    } catch (error) {
        if (optional) {
            console.log(`⚠️  ${description} - Ignoré (optionnel)`);
            return false;
        } else {
            console.error(`❌ ${description} - ERREUR`);
            console.error(error.message);
            throw error;
        }
    }
}

// Vérifier l'environnement macOS
function checkMacOSEnvironment() {
    console.log('🔍 Vérification de l\'environnement macOS...');
    
    if (process.platform !== 'darwin') {
        console.log('⚠️  Ce script est optimisé pour macOS');
        console.log('💡 Continuons quand même pour la compatibilité CI/CD');
    }
    
    // Vérifier Node.js
    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        console.log(`✅ Node.js: ${nodeVersion}`);
    } catch (error) {
        throw new Error('Node.js n\'est pas installé');
    }
    
    // Vérifier npm
    try {
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        console.log(`✅ npm: ${npmVersion}`);
    } catch (error) {
        throw new Error('npm n\'est pas disponible');
    }
    
    // Vérifier Python (nécessaire pour les modules natifs)
    try {
        const pythonVersion = execSync('python3 --version', { encoding: 'utf8' }).trim();
        console.log(`✅ Python: ${pythonVersion}`);
    } catch (error) {
        console.log('⚠️  Python3 non trouvé - peut causer des problèmes avec les modules natifs');
    }
    
    console.log('');
}

// Installer les dépendances système macOS
function installSystemDependencies() {
    if (process.platform !== 'darwin') {
        console.log('⏭️  Dépendances système ignorées (pas sur macOS)');
        return;
    }
    
    console.log('📦 Installation des dépendances système macOS...');
    
    // Vérifier si Homebrew est installé
    try {
        execSync('which brew', { stdio: 'pipe' });
        console.log('✅ Homebrew détecté');
        
        // Installer les dépendances nécessaires pour les modules natifs
        const brewPackages = [
            'pkg-config',
            'cairo',
            'pango',
            'libpng',
            'jpeg',
            'giflib',
            'librsvg'
        ];
        
        for (const pkg of brewPackages) {
            try {
                execSync(`brew list ${pkg}`, { stdio: 'pipe' });
                console.log(`✅ ${pkg} déjà installé`);
            } catch {
                runCommand(`brew install ${pkg}`, `Installation de ${pkg}`, true);
            }
        }
        
    } catch (error) {
        console.log('⚠️  Homebrew non trouvé - installation manuelle des dépendances requise');
        console.log('💡 Installez Homebrew: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
    }
    
    console.log('');
}

// Configurer les modules natifs
function setupNativeModules() {
    console.log('🔧 Configuration des modules natifs...');
    
    // Variables d'environnement pour la compilation
    const buildEnv = {
        ...process.env,
        npm_config_build_from_source: 'true',
        npm_config_cache_lock_stale: '60000',
        npm_config_node_gyp: path.join(process.cwd(), 'node_modules', '.bin', 'node-gyp')
    };
    
    // Nettoyer le cache npm
    runCommand('npm cache clean --force', 'Nettoyage du cache npm', true);
    
    // Installer/mettre à jour node-gyp
    runCommand('npm install -g node-gyp', 'Installation de node-gyp', true);
    
    // Reconstruire better-sqlite3 spécifiquement
    try {
        console.log('🔄 Reconstruction de better-sqlite3 pour macOS...');
        execSync('npm rebuild better-sqlite3', { 
            stdio: 'inherit',
            env: buildEnv
        });
        console.log('✅ better-sqlite3 reconstruit avec succès');
    } catch (error) {
        console.log('⚠️  Erreur lors de la reconstruction de better-sqlite3');
        console.log('🔄 Tentative de réinstallation...');
        
        try {
            execSync('npm uninstall better-sqlite3', { stdio: 'inherit' });
            execSync('npm install better-sqlite3', { 
                stdio: 'inherit',
                env: buildEnv
            });
            console.log('✅ better-sqlite3 réinstallé avec succès');
        } catch (reinstallError) {
            console.error('❌ Impossible de configurer better-sqlite3');
            throw reinstallError;
        }
    }
    
    // Reconstruire bcrypt
    try {
        console.log('🔄 Reconstruction de bcrypt pour macOS...');
        execSync('npm rebuild bcrypt', { 
            stdio: 'inherit',
            env: buildEnv
        });
        console.log('✅ bcrypt reconstruit avec succès');
    } catch (error) {
        console.log('⚠️  Erreur lors de la reconstruction de bcrypt - continuons');
    }
    
    // Reconstruction générale avec electron-rebuild
    runCommand('npx electron-rebuild', 'Reconstruction générale des modules natifs');
    
    console.log('');
}

// Créer l'icône macOS
function createMacIcon() {
    console.log('🎨 Création de l\'icône macOS...');
    
    const iconScript = path.join(__dirname, 'create-mac-icon.js');
    if (fs.existsSync(iconScript)) {
        runCommand(`node "${iconScript}"`, 'Génération de l\'icône macOS', true);
    } else {
        console.log('⚠️  Script d\'icône non trouvé - icône par défaut sera utilisée');
    }
    
    console.log('');
}

// Valider la configuration
function validateConfiguration() {
    console.log('✅ Validation de la configuration...');
    
    // Vérifier que les fichiers essentiels existent
    const requiredFiles = [
        'main.js',
        'package.json',
        'database.js',
        'preload.js'
    ];
    
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            throw new Error(`Fichier requis manquant: ${file}`);
        }
    }
    
    // Vérifier la configuration electron-builder
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.build || !packageJson.build.mac) {
        throw new Error('Configuration macOS manquante dans package.json');
    }
    
    console.log('✅ Configuration validée');
    console.log('');
}

// Fonction principale
async function main() {
    try {
        checkMacOSEnvironment();
        installSystemDependencies();
        setupNativeModules();
        createMacIcon();
        validateConfiguration();
        
        console.log('🎉 Configuration macOS terminée avec succès !');
        console.log('');
        console.log('💡 Vous pouvez maintenant exécuter:');
        console.log('   npm run dist:mac        # Build macOS (Intel + Apple Silicon)');
        console.log('   npm run dist:mac-universal # Build universel macOS');
        console.log('');
        
    } catch (error) {
        console.error('❌ Erreur lors de la configuration:', error.message);
        process.exit(1);
    }
}

// Exécuter si appelé directement
if (require.main === module) {
    main();
}

module.exports = {
    checkMacOSEnvironment,
    installSystemDependencies,
    setupNativeModules,
    createMacIcon,
    validateConfiguration
};

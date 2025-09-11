#!/usr/bin/env node

/**
 * Script de validation de la configuration macOS
 * Vérifie que tous les fichiers et configurations sont en place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validation de la configuration macOS pour GestionPro');
console.log('='.repeat(60));
console.log('');

let errors = [];
let warnings = [];
let success = [];

// Fonction utilitaire pour vérifier l'existence d'un fichier
function checkFile(filePath, description, required = true) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        success.push(`✅ ${description}: ${filePath}`);
        return true;
    } else {
        if (required) {
            errors.push(`❌ ${description} manquant: ${filePath}`);
        } else {
            warnings.push(`⚠️  ${description} optionnel manquant: ${filePath}`);
        }
        return false;
    }
}

// Fonction pour vérifier le contenu d'un fichier JSON
function checkJsonContent(filePath, checks, description) {
    try {
        const content = JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'));
        let allChecksPass = true;
        
        for (const [key, expectedValue] of Object.entries(checks)) {
            const keys = key.split('.');
            let current = content;
            
            for (const k of keys) {
                if (current && typeof current === 'object' && k in current) {
                    current = current[k];
                } else {
                    current = undefined;
                    break;
                }
            }
            
            if (current === undefined) {
                errors.push(`❌ ${description}: Clé manquante '${key}'`);
                allChecksPass = false;
            } else if (expectedValue !== null && current !== expectedValue) {
                warnings.push(`⚠️  ${description}: '${key}' = '${current}' (attendu: '${expectedValue}')`);
            }
        }
        
        if (allChecksPass) {
            success.push(`✅ ${description}: Configuration valide`);
        }
        
        return allChecksPass;
    } catch (error) {
        errors.push(`❌ ${description}: Erreur de lecture - ${error.message}`);
        return false;
    }
}

console.log('📁 Vérification des fichiers de configuration...');
console.log('');

// Vérifier les fichiers GitHub Actions
checkFile('projet-gestion-maitre/.github/workflows/build-macos.yml', 'Workflow GitHub Actions macOS');
checkFile('projet-gestion-maitre/.github/workflows/test-macos-build.yml', 'Workflow de test macOS');

// Vérifier les fichiers de build
checkFile('projet-gestion-maitre/build/entitlements.mac.plist', 'Entitlements macOS');
checkFile('projet-gestion-maitre/build/create-mac-icon.js', 'Script de création d\'icône');
checkFile('projet-gestion-maitre/build/setup-macos-build.js', 'Script de setup macOS');

// Vérifier les scripts
checkFile('projet-gestion-maitre/build-macos-local.sh', 'Script de build local');
checkFile('projet-gestion-maitre/README-MACOS.md', 'Documentation macOS');

// Vérifier les fichiers optionnels
checkFile('projet-gestion-maitre/src/assets/icon.png', 'Icône source PNG', false);
checkFile('projet-gestion-maitre/src/assets/icon.icns', 'Icône macOS', false);

console.log('');
console.log('⚙️  Vérification de la configuration package.json...');
console.log('');

// Vérifier package.json
const packageJsonPath = 'projet-gestion-maitre/package.json';
if (checkFile(packageJsonPath, 'package.json')) {
    // Vérifier les scripts
    checkJsonContent(packageJsonPath, {
        'scripts.dist:mac': null,
        'scripts.dist:mac-universal': null,
        'scripts.setup:macos': null,
        'scripts.predist:mac': null,
        'scripts.predist:mac-universal': null
    }, 'Scripts macOS dans package.json');
    
    // Vérifier la configuration build
    checkJsonContent(packageJsonPath, {
        'build.mac': null,
        'build.mac.target': null,
        'build.mac.category': 'public.app-category.business',
        'build.dmg': null,
        'build.dmg.title': null
    }, 'Configuration build macOS');
    
    // Vérifier les dépendances critiques
    checkJsonContent(packageJsonPath, {
        'dependencies.better-sqlite3': null,
        'dependencies.bcrypt': null,
        'devDependencies.electron': null,
        'devDependencies.electron-builder': null
    }, 'Dépendances critiques');
}

console.log('');
console.log('🔧 Vérification des workflows GitHub Actions...');
console.log('');

// Vérifier le contenu du workflow
const workflowPath = 'projet-gestion-maitre/.github/workflows/build-macos.yml';
if (fs.existsSync(path.join(__dirname, workflowPath))) {
    const workflowContent = fs.readFileSync(path.join(__dirname, workflowPath), 'utf8');
    
    // Vérifications du contenu du workflow
    const workflowChecks = [
        { pattern: /runs-on:\s*macos-latest/, description: 'Runner macOS' },
        { pattern: /node-version:\s*\[18\.x\]/, description: 'Version Node.js 18' },
        { pattern: /npm run setup:macos/, description: 'Appel du script setup' },
        { pattern: /npm run dist:mac/, description: 'Commande de build macOS' },
        { pattern: /CSC_IDENTITY_AUTO_DISCOVERY:\s*false/, description: 'Code signing désactivé' },
        { pattern: /actions\/upload-artifact@v4/, description: 'Upload des artifacts' }
    ];
    
    for (const check of workflowChecks) {
        if (check.pattern.test(workflowContent)) {
            success.push(`✅ Workflow: ${check.description}`);
        } else {
            warnings.push(`⚠️  Workflow: ${check.description} non trouvé`);
        }
    }
}

console.log('');
console.log('📋 Résumé de la validation...');
console.log('');

// Afficher les résultats
if (success.length > 0) {
    console.log('🎉 Éléments configurés correctement:');
    success.forEach(item => console.log(`   ${item}`));
    console.log('');
}

if (warnings.length > 0) {
    console.log('⚠️  Avertissements (non bloquants):');
    warnings.forEach(item => console.log(`   ${item}`));
    console.log('');
}

if (errors.length > 0) {
    console.log('❌ Erreurs à corriger:');
    errors.forEach(item => console.log(`   ${item}`));
    console.log('');
}

// Statistiques
console.log('📊 Statistiques:');
console.log(`   ✅ Succès: ${success.length}`);
console.log(`   ⚠️  Avertissements: ${warnings.length}`);
console.log(`   ❌ Erreurs: ${errors.length}`);
console.log('');

// Conclusion
if (errors.length === 0) {
    console.log('🎉 VALIDATION RÉUSSIE !');
    console.log('');
    console.log('✅ Votre configuration macOS est prête');
    console.log('🚀 Vous pouvez maintenant:');
    console.log('   1. Commiter et pusher vos changements');
    console.log('   2. Déclencher le build GitHub Actions');
    console.log('   3. Télécharger les artifacts générés');
    console.log('');
    console.log('💡 Commandes utiles:');
    console.log('   git add .');
    console.log('   git commit -m "feat: Add macOS build support"');
    console.log('   git push origin main');
    console.log('');
    process.exit(0);
} else {
    console.log('❌ VALIDATION ÉCHOUÉE');
    console.log('');
    console.log('🔧 Corrigez les erreurs ci-dessus avant de continuer');
    console.log('💡 Consultez le README-MACOS.md pour plus d\'informations');
    console.log('');
    process.exit(1);
}

#!/usr/bin/env node

/**
 * Script pour générer les modules natifs pré-compilés pour macOS
 * À exécuter sur une machine macOS avec Node.js 18.x
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Génération des modules natifs pré-compilés pour macOS...');

// Vérifier l'environnement
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

if (process.platform !== 'darwin') {
    console.error('❌ Ce script doit être exécuté sur macOS');
    process.exit(1);
}

// Nettoyer et installer les dépendances
console.log('\n📦 Installation des dépendances...');
try {
    execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
    execSync('npm install', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Erreur lors de l\'installation:', error.message);
    process.exit(1);
}

// Vérifier que les modules natifs fonctionnent
console.log('\n✅ Vérification des modules natifs...');
try {
    require('better-sqlite3');
    console.log('✅ better-sqlite3 OK');
    
    require('bcrypt');
    console.log('✅ bcrypt OK');
} catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    process.exit(1);
}

// Créer le dossier de destination
const precompiledDir = path.join(__dirname, 'precompiled-modules', 'darwin-x64');
if (fs.existsSync(precompiledDir)) {
    fs.rmSync(precompiledDir, { recursive: true });
}
fs.mkdirSync(precompiledDir, { recursive: true });

// Copier les modules natifs compilés
console.log('\n📋 Copie des modules natifs compilés...');

const modulesToCopy = [
    {
        name: 'better-sqlite3',
        source: 'node_modules/better-sqlite3',
        files: ['build/', 'package.json']
    },
    {
        name: 'bcrypt',
        source: 'node_modules/bcrypt',
        files: ['build/', 'lib/', 'package.json']
    }
];

modulesToCopy.forEach(module => {
    console.log(`Copie de ${module.name}...`);
    
    const moduleDir = path.join(precompiledDir, module.name);
    fs.mkdirSync(moduleDir, { recursive: true });
    
    module.files.forEach(file => {
        const sourcePath = path.join(module.source, file);
        const destPath = path.join(moduleDir, file);
        
        if (fs.existsSync(sourcePath)) {
            if (fs.statSync(sourcePath).isDirectory()) {
                execSync(`cp -r "${sourcePath}" "${destPath}"`, { stdio: 'inherit' });
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
            console.log(`  ✅ ${file}`);
        } else {
            console.log(`  ⚠️  ${file} non trouvé`);
        }
    });
});

console.log('\n🎉 Modules pré-compilés générés avec succès !');
console.log(`📁 Dossier: ${precompiledDir}`);
console.log('\n📝 Prochaines étapes:');
console.log('1. Commitez le dossier precompiled-modules/');
console.log('2. Pushez vers GitHub');
console.log('3. Le workflow GitHub Actions utilisera ces modules pré-compilés');

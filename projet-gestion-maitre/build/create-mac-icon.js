#!/usr/bin/env node

/**
 * Script pour créer une icône macOS (.icns) à partir d'une image PNG
 * Utilise iconutil (outil macOS natif) pour créer l'icône
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Création de l\'icône macOS...');

// Vérifier si nous sommes sur macOS
if (process.platform !== 'darwin') {
    console.log('⚠️  Ce script doit être exécuté sur macOS pour créer l\'icône .icns');
    console.log('💡 L\'icône sera créée automatiquement par GitHub Actions sur macOS');
    process.exit(0);
}

// Chemins des fichiers
const srcDir = path.join(__dirname, '..', 'src', 'assets');
const buildDir = __dirname;
const iconsetDir = path.join(buildDir, 'icon.iconset');
const outputIcon = path.join(srcDir, 'icon.icns');

// Créer le dossier iconset
if (!fs.existsSync(iconsetDir)) {
    fs.mkdirSync(iconsetDir, { recursive: true });
}

// Tailles d'icônes requises pour macOS
const iconSizes = [
    { size: 16, name: 'icon_16x16.png' },
    { size: 32, name: 'icon_16x16@2x.png' },
    { size: 32, name: 'icon_32x32.png' },
    { size: 64, name: 'icon_32x32@2x.png' },
    { size: 128, name: 'icon_128x128.png' },
    { size: 256, name: 'icon_128x128@2x.png' },
    { size: 256, name: 'icon_256x256.png' },
    { size: 512, name: 'icon_256x256@2x.png' },
    { size: 512, name: 'icon_512x512.png' },
    { size: 1024, name: 'icon_512x512@2x.png' }
];

try {
    // Chercher une image source (PNG de préférence)
    let sourceImage = null;
    const possibleSources = [
        path.join(srcDir, 'icon.png'),
        path.join(srcDir, 'logo.png'),
        path.join(srcDir, 'app-icon.png'),
        path.join(__dirname, '..', 'icon.png'),
        path.join(__dirname, '..', 'logo.png')
    ];

    for (const source of possibleSources) {
        if (fs.existsSync(source)) {
            sourceImage = source;
            console.log(`✅ Image source trouvée: ${source}`);
            break;
        }
    }

    if (!sourceImage) {
        console.log('❌ Aucune image source trouvée');
        console.log('💡 Créez un fichier icon.png dans src/assets/ ou à la racine du projet');
        
        // Créer une icône par défaut simple
        console.log('🎨 Création d\'une icône par défaut...');
        createDefaultIcon();
        return;
    }

    // Générer toutes les tailles d'icônes
    console.log('🔄 Génération des différentes tailles...');
    for (const { size, name } of iconSizes) {
        const outputPath = path.join(iconsetDir, name);
        try {
            execSync(`sips -z ${size} ${size} "${sourceImage}" --out "${outputPath}"`, { stdio: 'pipe' });
            console.log(`   ✅ ${name} (${size}x${size})`);
        } catch (error) {
            console.log(`   ⚠️  Erreur pour ${name}: ${error.message}`);
        }
    }

    // Créer le fichier .icns
    console.log('📦 Création du fichier .icns...');
    execSync(`iconutil -c icns "${iconsetDir}" -o "${outputIcon}"`, { stdio: 'pipe' });
    
    // Nettoyer le dossier temporaire
    execSync(`rm -rf "${iconsetDir}"`);
    
    console.log(`✅ Icône macOS créée: ${outputIcon}`);

} catch (error) {
    console.error('❌ Erreur lors de la création de l\'icône:', error.message);
    console.log('💡 Création d\'une icône par défaut...');
    createDefaultIcon();
}

function createDefaultIcon() {
    // Créer une icône SVG simple puis la convertir
    const svgIcon = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="64" fill="#2563eb"/>
    <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" font-weight="bold" text-anchor="middle" fill="white">GP</text>
</svg>`;
    
    const svgPath = path.join(buildDir, 'temp-icon.svg');
    const pngPath = path.join(srcDir, 'icon.png');
    
    try {
        fs.writeFileSync(svgPath, svgIcon);
        
        // Convertir SVG en PNG (nécessite rsvg-convert ou similar)
        try {
            execSync(`rsvg-convert -w 512 -h 512 "${svgPath}" -o "${pngPath}"`, { stdio: 'pipe' });
        } catch {
            // Si rsvg-convert n'est pas disponible, utiliser sips avec le SVG
            execSync(`sips -s format png "${svgPath}" --out "${pngPath}"`, { stdio: 'pipe' });
        }
        
        // Maintenant créer l'icône .icns
        const iconsetDir = path.join(buildDir, 'icon.iconset');
        fs.mkdirSync(iconsetDir, { recursive: true });
        
        for (const { size, name } of iconSizes) {
            const outputPath = path.join(iconsetDir, name);
            execSync(`sips -z ${size} ${size} "${pngPath}" --out "${outputPath}"`, { stdio: 'pipe' });
        }
        
        const outputIcon = path.join(srcDir, 'icon.icns');
        execSync(`iconutil -c icns "${iconsetDir}" -o "${outputIcon}"`, { stdio: 'pipe' });
        
        // Nettoyer
        fs.unlinkSync(svgPath);
        execSync(`rm -rf "${iconsetDir}"`);
        
        console.log('✅ Icône par défaut créée avec succès');
        
    } catch (error) {
        console.error('❌ Impossible de créer l\'icône par défaut:', error.message);
    }
}

console.log('🎉 Script d\'icône terminé');

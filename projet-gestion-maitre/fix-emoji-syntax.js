#!/usr/bin/env node

/**
 * Script pour supprimer les emojis qui causent des erreurs de syntaxe
 */

const fs = require('fs');
const path = require('path');

console.log('=== NETTOYAGE DES EMOJIS ===\n');

const filePath = path.join(__dirname, 'simple-db-replacement.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Suppression des emojis...');

// Remplacer tous les emojis par du texte simple
const emojiReplacements = [
    { emoji: /📝/g, replacement: '[DB]' },
    { emoji: /✅/g, replacement: '[OK]' },
    { emoji: /❌/g, replacement: '[ERR]' },
    { emoji: /📊/g, replacement: '[INFO]' },
    { emoji: /⚠️/g, replacement: '[WARN]' },
    { emoji: /🔧/g, replacement: '[FIX]' }
];

let totalReplacements = 0;

emojiReplacements.forEach((replacement, index) => {
    const matches = content.match(replacement.emoji);
    if (matches) {
        content = content.replace(replacement.emoji, replacement.replacement);
        totalReplacements += matches.length;
        console.log(`   ${replacement.replacement}: ${matches.length} remplacement(s)`);
    }
});

// Sauvegarder
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n${totalReplacements} emojis supprimés`);
console.log('Fichier nettoyé avec succès !');

console.log('\n=== NETTOYAGE TERMINÉ ===');

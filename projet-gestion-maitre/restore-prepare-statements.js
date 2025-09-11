#!/usr/bin/env node

/**
 * Script pour restaurer les db.prepare() dans database.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 === RESTAURATION DES PREPARE STATEMENTS ===\n');

const dbFilePath = path.join(__dirname, 'database.js');
let content = fs.readFileSync(dbFilePath, 'utf8');

console.log('📝 Restauration des db.prepare()...');

// Remplacer convertPreparedStatement( par db.prepare(
content = content.replace(/convertPreparedStatement\(/g, 'db.prepare(');

// Supprimer les async/await inutiles maintenant que c'est synchrone
const asyncFixes = [
    // Supprimer les await ensureDbInitialized()
    {
        search: /await ensureDbInitialized\(\);\s*/g,
        replace: ''
    },
    
    // Convertir les fonctions async en fonctions normales
    {
        search: /const (\w+) = async \(/g,
        replace: 'const $1 = ('
    },
    
    // Supprimer les await devant db.get, db.run, db.all
    {
        search: /await (db\.(get|run|all))/g,
        replace: '$1'
    }
];

let fixCount = 0;

asyncFixes.forEach((fix, index) => {
    const matches = content.match(fix.search);
    if (matches) {
        content = content.replace(fix.search, fix.replace);
        fixCount += matches.length;
        console.log(`   ✅ Fix async ${index + 1}: ${matches.length} remplacement(s)`);
    }
});

// Sauvegarder
fs.writeFileSync(dbFilePath, content, 'utf8');

console.log(`\n✅ ${fixCount} corrections appliquées`);
console.log('📁 Fichier database.js restauré');

console.log('\n🎯 Testez maintenant avec: npm start');
console.log('🔧 === RESTAURATION TERMINÉE ===');

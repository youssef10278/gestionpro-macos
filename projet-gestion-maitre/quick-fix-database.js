#!/usr/bin/env node

/**
 * Script de correction rapide pour database.js
 * Remplace les principales utilisations de db.prepare() par les méthodes de DatabaseAdapter
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 === CORRECTION RAPIDE DATABASE.JS ===\n');

const dbFilePath = path.join(__dirname, 'database.js');

if (!fs.existsSync(dbFilePath)) {
    console.error('❌ Fichier database.js non trouvé');
    process.exit(1);
}

let content = fs.readFileSync(dbFilePath, 'utf8');

console.log('📝 Application des corrections...');

// Corrections principales pour les fonctions les plus utilisées
const corrections = [
    // Correction des getAllUsers
    {
        search: /const getAllUsers = \(\) => db\.prepare\("SELECT id, username, role FROM users WHERE role = 'Vendeur'"\)\.all\(\);/g,
        replace: 'const getAllUsers = async () => { await ensureDbInitialized(); return db.all("SELECT id, username, role FROM users WHERE role = \'Vendeur\'"); };'
    },
    
    // Correction des deleteUser
    {
        search: /const deleteUser = \(id\) => \{ db\.prepare\("DELETE FROM users WHERE id = \?"\)\.run\(id\); return true; \};/g,
        replace: 'const deleteUser = async (id) => { await ensureDbInitialized(); db.run("DELETE FROM users WHERE id = ?", [id]); return true; };'
    },
    
    // Correction des getDebtors
    {
        search: /const getDebtors = \(\) => db\.prepare\(`SELECT id, name, phone, credit_balance FROM clients WHERE credit_balance > 0\.01 ORDER BY name ASC`\)\.all\(\);/g,
        replace: 'const getDebtors = async () => { await ensureDbInitialized(); return db.all(`SELECT id, name, phone, credit_balance FROM clients WHERE credit_balance > 0.01 ORDER BY name ASC`); };'
    },
    
    // Correction simple des db.prepare() isolés vers convertPreparedStatement
    {
        search: /db\.prepare\(/g,
        replace: 'convertPreparedStatement('
    }
];

let correctionCount = 0;

corrections.forEach((correction, index) => {
    const matches = content.match(correction.search);
    if (matches) {
        content = content.replace(correction.search, correction.replace);
        correctionCount += matches.length;
        console.log(`   ✅ Correction ${index + 1}: ${matches.length} remplacement(s)`);
    }
});

// Ajouter ensureDbInitialized() aux fonctions qui en ont besoin
const functionsNeedingInit = [
    'getAllProducts',
    'getProductById',
    'addProduct',
    'updateProduct',
    'deleteProduct',
    'getAllClients',
    'getClientById',
    'addClient',
    'updateClient',
    'deleteClient'
];

functionsNeedingInit.forEach(funcName => {
    // Chercher les fonctions qui n'ont pas encore ensureDbInitialized
    const regex = new RegExp(`const ${funcName} = \\(([^)]*)\\) => \\{([^}]*(?:\\{[^}]*\\}[^}]*)*)\\}`, 'g');
    content = content.replace(regex, (match, params, body) => {
        if (!body.includes('ensureDbInitialized')) {
            return `const ${funcName} = async (${params}) => { await ensureDbInitialized(); ${body.trim()} }`;
        }
        return match;
    });
});

// Sauvegarder le fichier corrigé
fs.writeFileSync(dbFilePath, content, 'utf8');

console.log(`\n✅ ${correctionCount} corrections appliquées`);
console.log('📁 Fichier database.js mis à jour');

// Créer une sauvegarde
const backupPath = path.join(__dirname, 'database.js.backup');
if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(dbFilePath, backupPath);
    console.log('💾 Sauvegarde créée: database.js.backup');
}

console.log('\n🎯 Prochaines étapes:');
console.log('1. Testez l\'application avec: npm start');
console.log('2. Si erreurs persistent, vérifiez les logs');
console.log('3. Les fonctions async nécessitent await dans l\'application');

console.log('\n🔧 === CORRECTION TERMINÉE ===');

#!/usr/bin/env node

/**
 * Script pour corriger TOUTES les utilisations de db.prepare() dans database.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 === CORRECTION COMPLÈTE DES PREPARE STATEMENTS ===\n');

const dbFilePath = path.join(__dirname, 'database.js');
let content = fs.readFileSync(dbFilePath, 'utf8');

console.log('📝 Correction des patterns problématiques...');

// 1. Corriger les fonctions qui utilisent encore db.prepare() directement
const patterns = [
    // Pattern: const result = db.prepare("SQL").get(params)
    {
        regex: /const\s+(\w+)\s+=\s+db\.prepare\(([^)]+)\)\.get\(([^)]*)\);?/g,
        replacement: 'const $1 = await db.get($2, [$3]);'
    },
    
    // Pattern: const result = db.prepare("SQL").all(params)
    {
        regex: /const\s+(\w+)\s+=\s+db\.prepare\(([^)]+)\)\.all\(([^)]*)\);?/g,
        replacement: 'const $1 = await db.all($2, [$3]);'
    },
    
    // Pattern: db.prepare("SQL").run(params)
    {
        regex: /db\.prepare\(([^)]+)\)\.run\(([^)]*)\);?/g,
        replacement: 'await db.run($1, [$2]);'
    },
    
    // Pattern: const stmt = db.prepare("SQL"); stmt.run(params)
    {
        regex: /const\s+(\w+)\s+=\s+db\.prepare\(([^)]+)\);\s*\1\.run\(([^)]*)\);?/g,
        replacement: 'await db.run($2, [$3]);'
    }
];

let totalReplacements = 0;

patterns.forEach((pattern, index) => {
    const matches = content.match(pattern.regex);
    if (matches) {
        content = content.replace(pattern.regex, pattern.replacement);
        totalReplacements += matches.length;
        console.log(`   ✅ Pattern ${index + 1}: ${matches.length} remplacement(s)`);
    }
});

// 2. Corriger les fonctions spécifiques qui posent problème
const specificFixes = [
    // updateUserCredentials function
    {
        search: /const updateUserCredentials = \(data\) => \{/g,
        replace: 'const updateUserCredentials = async (data) => { await ensureDbInitialized();'
    },
    
    // Autres fonctions critiques
    {
        search: /const user = db\.prepare\("SELECT \* FROM users WHERE id = \?"\)\.get\(id\);/g,
        replace: 'const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);'
    },
    
    {
        search: /const existingUser = db\.prepare\("SELECT id FROM users WHERE username = \? AND id != \?"\)\.get\(newUsername, id\);/g,
        replace: 'const existingUser = await db.get("SELECT id FROM users WHERE username = ? AND id != ?", [newUsername, id]);'
    },
    
    {
        search: /db\.prepare\(sql\)\.run\(\.\.\.params\);/g,
        replace: 'await db.run(sql, params);'
    }
];

specificFixes.forEach((fix, index) => {
    const matches = content.match(fix.search);
    if (matches) {
        content = content.replace(fix.search, fix.replace);
        totalReplacements += matches.length;
        console.log(`   ✅ Fix spécifique ${index + 1}: ${matches.length} remplacement(s)`);
    }
});

// 3. S'assurer que toutes les fonctions exportées sont async
const functionExports = [
    'getAllProducts', 'getProductById', 'addProduct', 'updateProduct', 'deleteProduct',
    'getAllClients', 'getClientById', 'addClient', 'updateClient', 'deleteClient',
    'getAllUsers', 'addUser', 'updateUserPassword', 'deleteUser', 'updateUserCredentials',
    'authenticateUser', 'getDebtors', 'recordCreditPayment', 'addManualCredit'
];

functionExports.forEach(funcName => {
    // Chercher les fonctions qui ne sont pas async
    const asyncRegex = new RegExp(`const ${funcName} = \\(`, 'g');
    const nonAsyncRegex = new RegExp(`const ${funcName} = \\(([^)]*)\\) => \\{`, 'g');
    
    if (content.match(nonAsyncRegex) && !content.includes(`const ${funcName} = async (`)) {
        content = content.replace(nonAsyncRegex, `const ${funcName} = async ($1) => { await ensureDbInitialized();`);
        console.log(`   ✅ Fonction ${funcName} convertie en async`);
        totalReplacements++;
    }
});

// Sauvegarder
fs.writeFileSync(dbFilePath, content, 'utf8');

console.log(`\n✅ ${totalReplacements} corrections appliquées au total`);
console.log('📁 Fichier database.js complètement mis à jour');

console.log('\n🎯 Testez maintenant avec: npm start');
console.log('🔧 === CORRECTION TERMINÉE ===');

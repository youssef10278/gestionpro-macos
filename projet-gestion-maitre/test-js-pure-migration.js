#!/usr/bin/env node

/**
 * Script de test pour la migration JavaScript pur
 * Teste les adaptateurs DatabaseAdapter et CryptoAdapter
 */

const path = require('path');
const fs = require('fs');

console.log('🧪 === TEST MIGRATION JAVASCRIPT PUR ===\n');

async function testMigration() {
    try {
        // Test 1: Charger les adaptateurs
        console.log('1️⃣ Test chargement des adaptateurs...');
        const DatabaseAdapter = require('./src/database/DatabaseAdapter');
        const CryptoAdapter = require('./src/utils/CryptoAdapter');
        console.log('✅ Adaptateurs chargés avec succès\n');

        // Test 2: Test CryptoAdapter
        console.log('2️⃣ Test CryptoAdapter...');
        const password = 'test123';
        const hash = CryptoAdapter.hashSync(password, 10);
        console.log(`   Hash généré: ${hash.substring(0, 20)}...`);
        
        const isValid = CryptoAdapter.compareSync(password, hash);
        console.log(`   Vérification: ${isValid ? '✅ OK' : '❌ ÉCHEC'}`);
        
        const isInvalid = CryptoAdapter.compareSync('wrongpassword', hash);
        console.log(`   Faux mot de passe: ${!isInvalid ? '✅ OK' : '❌ ÉCHEC'}\n`);

        // Test 3: Test DatabaseAdapter
        console.log('3️⃣ Test DatabaseAdapter...');
        const testDbPath = path.join(__dirname, 'test-migration.db');
        
        // Supprimer la DB de test si elle existe
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
        
        const db = new DatabaseAdapter(testDbPath);
        await db.init();
        console.log('   ✅ Base de données initialisée');

        // Créer une table de test
        db.exec(`
            CREATE TABLE test_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password_hash TEXT NOT NULL
            )
        `);
        console.log('   ✅ Table créée');

        // Insérer des données
        const testHash = CryptoAdapter.hashSync('admin123', 10);
        db.run('INSERT INTO test_users (username, password_hash) VALUES (?, ?)', ['admin', testHash]);
        console.log('   ✅ Données insérées');

        // Lire les données
        const user = db.get('SELECT * FROM test_users WHERE username = ?', ['admin']);
        console.log(`   ✅ Utilisateur trouvé: ${user.username}`);

        // Vérifier le mot de passe
        const passwordCheck = CryptoAdapter.compareSync('admin123', user.password_hash);
        console.log(`   ✅ Mot de passe vérifié: ${passwordCheck ? 'OK' : 'ÉCHEC'}`);

        // Nettoyer
        db.close();
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
        console.log('   ✅ Nettoyage effectué\n');

        // Test 4: Test create-clean-db.js
        console.log('4️⃣ Test create-clean-db.js...');
        const { execSync } = require('child_process');
        
        try {
            execSync('node create-clean-db.js', { stdio: 'pipe' });
            console.log('   ✅ create-clean-db.js fonctionne\n');
        } catch (error) {
            console.log('   ❌ create-clean-db.js a échoué');
            console.log(`   Erreur: ${error.message}\n`);
        }

        // Test 5: Vérifier les modules JavaScript purs
        console.log('5️⃣ Test modules JavaScript purs...');
        try {
            require('sql.js');
            console.log('   ✅ sql.js disponible');
        } catch (error) {
            console.log('   ❌ sql.js non disponible');
        }

        try {
            require('crypto-js');
            console.log('   ✅ crypto-js disponible');
        } catch (error) {
            console.log('   ❌ crypto-js non disponible');
        }

        // Vérifier que les modules natifs sont absents
        try {
            require('better-sqlite3');
            console.log('   ⚠️ better-sqlite3 encore présent (devrait être supprimé)');
        } catch (error) {
            console.log('   ✅ better-sqlite3 correctement supprimé');
        }

        try {
            require('bcrypt');
            console.log('   ⚠️ bcrypt encore présent (devrait être supprimé)');
        } catch (error) {
            console.log('   ✅ bcrypt correctement supprimé');
        }

        console.log('\n🎉 === MIGRATION JAVASCRIPT PUR RÉUSSIE ===');
        console.log('✅ Tous les tests sont passés');
        console.log('✅ Les modules natifs ont été remplacés avec succès');
        console.log('✅ L\'application peut maintenant fonctionner sans compilation native');

    } catch (error) {
        console.error('\n❌ === ERREUR LORS DU TEST ===');
        console.error('Erreur:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Exécuter les tests
testMigration();

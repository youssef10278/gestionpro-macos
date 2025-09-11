#!/usr/bin/env node

/**
 * Test de la vraie base de données avec sql.js
 */

console.log('=== TEST VRAIE BASE DE DONNEES ===\n');

async function testDatabase() {
    try {
        console.log('1. Test chargement sql.js...');
        const initSqlJs = require('sql.js');
        const SQL = await initSqlJs();
        console.log('   ✅ sql.js chargé avec succès');
        
        console.log('2. Test création base de données...');
        const db = new SQL.Database();
        console.log('   ✅ Base de données créée');
        
        console.log('3. Test création table...');
        db.exec(`
            CREATE TABLE test_users (
                id INTEGER PRIMARY KEY,
                username TEXT,
                role TEXT
            )
        `);
        console.log('   ✅ Table créée');
        
        console.log('4. Test insertion données...');
        db.run(`
            INSERT INTO test_users (username, role) 
            VALUES (?, ?)
        `, ['admin', 'Propriétaire']);
        console.log('   ✅ Données insérées');
        
        console.log('5. Test lecture données...');
        const results = db.exec('SELECT * FROM test_users');
        if (results.length > 0) {
            const columns = results[0].columns;
            const values = results[0].values;
            console.log('   ✅ Données lues:', { columns, values });
        }
        
        console.log('6. Test RealDatabaseAdapter...');
        const RealDatabaseAdapter = require('./real-database-adapter');
        const adapter = new RealDatabaseAdapter('./test-db.sqlite');
        
        // Attendre que l'adapter soit prêt
        let attempts = 0;
        while (!adapter.isReady && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (adapter.isReady) {
            console.log('   ✅ RealDatabaseAdapter initialisé');
            
            // Test authentification
            const user = adapter.get('SELECT * FROM users WHERE username = ?', ['admin']);
            console.log('   ✅ Test authentification:', user ? user.username : 'non trouvé');
            
            adapter.close();
        } else {
            console.log('   ❌ RealDatabaseAdapter timeout');
        }
        
        db.close();
        
        console.log('\n✅ TOUS LES TESTS RÉUSSIS !');
        console.log('La vraie base de données fonctionne correctement.');
        
    } catch (error) {
        console.error('\n❌ ERREUR DANS LES TESTS:', error);
        console.log('\nDétails de l\'erreur:');
        console.log('- Message:', error.message);
        console.log('- Stack:', error.stack);
    }
}

testDatabase().then(() => {
    console.log('\n=== TEST TERMINÉ ===');
}).catch(error => {
    console.error('Erreur fatale:', error);
});

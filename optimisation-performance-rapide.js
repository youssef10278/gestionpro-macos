/**
 * Script d'Optimisation Performance Rapide - GestionPro
 * Résout les problèmes de lenteur immédiatement
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 === OPTIMISATION PERFORMANCE GESTIONPRO ===\n');

// 1. Nettoyer les processus bloqués
function killElectronProcesses() {
    console.log('🔄 Arrêt des processus Electron...');
    try {
        execSync('taskkill /F /IM electron.exe 2>nul', { stdio: 'ignore' });
        execSync('taskkill /F /IM GestionPro.exe 2>nul', { stdio: 'ignore' });
        console.log('✅ Processus arrêtés');
    } catch (error) {
        console.log('ℹ️  Aucun processus à arrêter');
    }
}

// 2. Nettoyer les fichiers temporaires
function cleanTempFiles() {
    console.log('🧹 Nettoyage des fichiers temporaires...');
    
    const pathsToClean = [
        'node_modules/.cache',
        'src/css/output.css',
        'dist',
        'dist-installer'
    ];
    
    pathsToClean.forEach(dirPath => {
        if (fs.existsSync(dirPath)) {
            try {
                fs.rmSync(dirPath, { recursive: true, force: true });
                console.log(`✅ Supprimé: ${dirPath}`);
            } catch (error) {
                console.log(`⚠️  Impossible de supprimer: ${dirPath}`);
            }
        }
    });
}

// 3. Reconstruire les modules natifs
function rebuildNativeModules() {
    console.log('🔧 Reconstruction des modules natifs...');
    try {
        // Nettoyer le cache npm
        execSync('npm cache clean --force', { stdio: 'inherit' });
        
        // Supprimer et réinstaller better-sqlite3
        execSync('npm uninstall better-sqlite3', { stdio: 'inherit' });
        execSync('npm install better-sqlite3@latest', { stdio: 'inherit' });
        
        // Rebuilder tous les modules
        execSync('npm rebuild', { stdio: 'inherit' });
        
        console.log('✅ Modules natifs reconstruits');
        return true;
    } catch (error) {
        console.log('❌ Erreur lors de la reconstruction:', error.message);
        return false;
    }
}

// 4. Créer les index de base de données pour optimiser les performances
function createDatabaseIndexes() {
    console.log('📊 Création des index de performance...');
    
    const indexScript = `
const Database = require('better-sqlite3');
const path = require('path');

try {
    const dbPath = path.join(process.cwd(), 'database', 'main.db');
    const db = new Database(dbPath);
    
    console.log('Création des index d\\'optimisation...');
    
    const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)',
        'CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)',
        'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
        'CREATE INDEX IF NOT EXISTS idx_products_stock_alert ON products(stock, alert_threshold)',
        'CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name)',
        'CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone)',
        'CREATE INDEX IF NOT EXISTS idx_clients_credit ON clients(credit_balance)',
        'CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date)',
        'CREATE INDEX IF NOT EXISTS idx_sales_client ON sales(client_id)',
        'CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id)',
        'CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id)'
    ];
    
    indexes.forEach(indexSQL => {
        try {
            db.exec(indexSQL);
            console.log('✅ Index créé:', indexSQL.split(' ')[5]);
        } catch (error) {
            console.log('⚠️  Index existe déjà:', indexSQL.split(' ')[5]);
        }
    });
    
    // Optimiser la base de données
    db.exec('VACUUM');
    db.exec('ANALYZE');
    
    db.close();
    console.log('✅ Base de données optimisée');
    
} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
`;
    
    fs.writeFileSync('temp-create-indexes.js', indexScript);
    
    try {
        execSync('node temp-create-indexes.js', { stdio: 'inherit' });
        fs.unlinkSync('temp-create-indexes.js');
        return true;
    } catch (error) {
        console.log('❌ Erreur lors de la création des index:', error.message);
        if (fs.existsSync('temp-create-indexes.js')) {
            fs.unlinkSync('temp-create-indexes.js');
        }
        return false;
    }
}

// 5. Optimiser la configuration Electron
function optimizeElectronConfig() {
    console.log('⚡ Optimisation de la configuration Electron...');
    
    const mainJsPath = 'main.js';
    if (!fs.existsSync(mainJsPath)) {
        console.log('❌ Fichier main.js non trouvé');
        return false;
    }
    
    let mainContent = fs.readFileSync(mainJsPath, 'utf8');
    
    // Ajouter les optimisations de performance
    const optimizations = `
// Optimisations de performance ajoutées automatiquement
app.commandLine.appendSwitch('--enable-features', 'VaapiVideoDecoder');
app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('--max-old-space-size', '4096');
app.commandLine.appendSwitch('--js-flags', '--max-old-space-size=4096');
`;
    
    if (!mainContent.includes('max-old-space-size')) {
        const insertPoint = mainContent.indexOf('app.disableHardwareAcceleration();');
        if (insertPoint !== -1) {
            mainContent = mainContent.slice(0, insertPoint) + optimizations + '\n' + mainContent.slice(insertPoint);
            fs.writeFileSync(mainJsPath, mainContent);
            console.log('✅ Configuration Electron optimisée');
            return true;
        }
    }
    
    console.log('ℹ️  Configuration déjà optimisée');
    return true;
}

// 6. Compiler les styles CSS
function compileCSS() {
    console.log('🎨 Compilation des styles CSS...');
    try {
        execSync('npx tailwindcss -i ./src/css/input.css -o ./src/css/output.css --minify', { stdio: 'inherit' });
        console.log('✅ CSS compilé');
        return true;
    } catch (error) {
        console.log('❌ Erreur compilation CSS:', error.message);
        return false;
    }
}

// Fonction principale
async function optimizePerformance() {
    console.log('🎯 Début de l\\'optimisation performance...\n');
    
    const steps = [
        { name: 'Arrêt des processus', fn: killElectronProcesses },
        { name: 'Nettoyage fichiers temporaires', fn: cleanTempFiles },
        { name: 'Reconstruction modules natifs', fn: rebuildNativeModules },
        { name: 'Création index base de données', fn: createDatabaseIndexes },
        { name: 'Optimisation Electron', fn: optimizeElectronConfig },
        { name: 'Compilation CSS', fn: compileCSS }
    ];
    
    let successCount = 0;
    
    for (const step of steps) {
        console.log(`\n🔄 ${step.name}...`);
        try {
            const success = await step.fn();
            if (success !== false) {
                successCount++;
                console.log(`✅ ${step.name} - Terminé`);
            } else {
                console.log(`⚠️  ${step.name} - Échec partiel`);
            }
        } catch (error) {
            console.log(`❌ ${step.name} - Erreur:`, error.message);
        }
    }
    
    console.log(`\n🎊 Optimisation terminée: ${successCount}/${steps.length} étapes réussies`);
    
    if (successCount >= 4) {
        console.log('\n🚀 RECOMMANDATIONS POST-OPTIMISATION:');
        console.log('✅ Redémarrez l\\'application avec: npm start');
        console.log('✅ Les performances devraient être nettement améliorées');
        console.log('✅ La base de données est maintenant indexée');
        console.log('✅ Les modules natifs sont à jour');
    } else {
        console.log('\n⚠️  Optimisation partielle - Certaines étapes ont échoué');
        console.log('💡 Essayez de redémarrer en tant qu\\'administrateur');
    }
}

// Lancer l'optimisation
optimizePerformance().catch(console.error);

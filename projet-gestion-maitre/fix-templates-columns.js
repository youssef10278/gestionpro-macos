const Database = require('better-sqlite3');
const path = require('path');

console.log('🔧 === CORRECTION COLONNES TEMPLATES ===');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'database', 'main.db');
console.log('📂 Chemin de la base de données:', dbPath);

try {
    // Ouvrir la base de données
    const db = new Database(dbPath);
    console.log('✅ Base de données ouverte avec succès');

    // Vérifier la structure actuelle de la table
    console.log('\n🔍 Vérification de la structure actuelle...');
    const columns = db.prepare("PRAGMA table_info(invoice_templates)").all();
    
    console.log('📋 Colonnes actuelles:');
    columns.forEach(col => {
        console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });

    // Vérifier si les colonnes existent
    const hasElementsConfig = columns.some(col => col.name === 'elements_config');
    const hasFooterContent = columns.some(col => col.name === 'footer_content');

    console.log('\n📊 État des colonnes:');
    console.log(`   elements_config: ${hasElementsConfig ? '✅ Existe' : '❌ Manquante'}`);
    console.log(`   footer_content: ${hasFooterContent ? '✅ Existe' : '❌ Manquante'}`);

    let migrationsNeeded = 0;

    // Ajouter elements_config si manquante
    if (!hasElementsConfig) {
        console.log('\n➕ Ajout de la colonne elements_config...');
        try {
            db.exec("ALTER TABLE invoice_templates ADD COLUMN elements_config TEXT NOT NULL DEFAULT '{}'");
            console.log('✅ Colonne elements_config ajoutée avec succès');
            migrationsNeeded++;
        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout de elements_config:', error.message);
        }
    }

    // Ajouter footer_content si manquante
    if (!hasFooterContent) {
        console.log('\n➕ Ajout de la colonne footer_content...');
        try {
            db.exec("ALTER TABLE invoice_templates ADD COLUMN footer_content TEXT NOT NULL DEFAULT '{}'");
            console.log('✅ Colonne footer_content ajoutée avec succès');
            migrationsNeeded++;
        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout de footer_content:', error.message);
        }
    }

    // Initialiser les données par défaut si des migrations ont été effectuées
    if (migrationsNeeded > 0) {
        console.log('\n🔄 Initialisation des données par défaut...');
        
        // Initialiser elements_config pour les templates existants
        const updateElementsConfig = db.prepare(`
            UPDATE invoice_templates 
            SET elements_config = ? 
            WHERE elements_config = '{}' OR elements_config IS NULL
        `);
        
        const defaultElementsConfig = JSON.stringify({
            show_logo: true,
            show_line_numbers: true,
            show_unit_badges: true,
            show_due_date: true,
            show_legal_mentions: true
        });
        
        const elementsResult = updateElementsConfig.run(defaultElementsConfig);
        console.log(`✅ ${elementsResult.changes} templates mis à jour avec elements_config par défaut`);

        // Initialiser footer_content pour les templates existants
        const updateFooterContent = db.prepare(`
            UPDATE invoice_templates 
            SET footer_content = ? 
            WHERE footer_content = '{}' OR footer_content IS NULL
        `);
        
        const defaultFooterContent = JSON.stringify({
            thank_you_message: "Merci pour votre confiance",
            payment_terms: "Conditions de paiement: 30 jours",
            custom_message: "Cette facture est générée automatiquement par le système de gestion.",
            legal_info: "ICE: 123456789012345 • RC: 12345 • CNSS: 67890"
        });
        
        const footerResult = updateFooterContent.run(defaultFooterContent);
        console.log(`✅ ${footerResult.changes} templates mis à jour avec footer_content par défaut`);
    }

    // Vérification finale
    console.log('\n🔍 Vérification finale...');
    const finalColumns = db.prepare("PRAGMA table_info(invoice_templates)").all();
    const finalHasElementsConfig = finalColumns.some(col => col.name === 'elements_config');
    const finalHasFooterContent = finalColumns.some(col => col.name === 'footer_content');

    console.log('📊 État final des colonnes:');
    console.log(`   elements_config: ${finalHasElementsConfig ? '✅ Existe' : '❌ Manquante'}`);
    console.log(`   footer_content: ${finalHasFooterContent ? '✅ Existe' : '❌ Manquante'}`);

    // Compter les templates
    const templateCount = db.prepare("SELECT COUNT(*) as count FROM invoice_templates").get();
    console.log(`📄 Nombre de templates dans la base: ${templateCount.count}`);

    // Fermer la base de données
    db.close();
    console.log('\n✅ Base de données fermée');

    if (migrationsNeeded > 0) {
        console.log('\n🎉 MIGRATION TERMINÉE AVEC SUCCÈS !');
        console.log('📝 Actions effectuées:');
        if (!hasElementsConfig) console.log('   ✅ Colonne elements_config ajoutée');
        if (!hasFooterContent) console.log('   ✅ Colonne footer_content ajoutée');
        console.log('   ✅ Données par défaut initialisées');
        console.log('\n🚀 Vous pouvez maintenant redémarrer l\'application et tester la sauvegarde !');
    } else {
        console.log('\n✅ AUCUNE MIGRATION NÉCESSAIRE');
        console.log('📝 Toutes les colonnes requises sont déjà présentes.');
        console.log('\n🤔 Si vous avez encore des erreurs, le problème pourrait être ailleurs...');
    }

} catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    
    if (error.code === 'SQLITE_CANTOPEN') {
        console.log('\n💡 SOLUTIONS POSSIBLES:');
        console.log('1. Fermez complètement l\'application GestionPro');
        console.log('2. Vérifiez que le fichier database/main.db existe');
        console.log('3. Vérifiez les permissions du fichier');
    } else if (error.message.includes('duplicate column')) {
        console.log('\n✅ Les colonnes existent déjà - c\'est normal !');
        console.log('🔄 Redémarrez l\'application et testez la sauvegarde.');
    }
}

console.log('\n🔚 === FIN DE LA CORRECTION ===');

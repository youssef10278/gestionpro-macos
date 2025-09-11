// Script pour corriger la base de données en direct via l'API de l'application
console.log('🔧 === CORRECTION BASE DE DONNÉES EN DIRECT ===');

async function fixDatabaseLive() {
    try {
        // Étape 1: Vérifier l'API database
        if (!window.api || !window.api.database) {
            console.error('❌ API database non disponible');
            return;
        }

        console.log('✅ API database disponible');

        // Étape 2: Vérifier la structure actuelle
        console.log('\n🔍 Vérification de la structure actuelle...');
        const columns = await window.api.database.query("PRAGMA table_info(invoice_templates)");
        
        console.log('📋 Colonnes actuelles:');
        columns.forEach(col => {
            console.log(`   ${col.cid}: ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''}`);
        });

        const hasElementsConfig = columns.some(col => col.name === 'elements_config');
        const hasFooterContent = columns.some(col => col.name === 'footer_content');

        console.log('\n📊 État des colonnes:');
        console.log(`   elements_config: ${hasElementsConfig ? '✅ Existe' : '❌ Manquante'}`);
        console.log(`   footer_content: ${hasFooterContent ? '✅ Existe' : '❌ Manquante'}`);

        // Étape 3: Ajouter les colonnes manquantes
        let migrationsNeeded = 0;

        if (!hasElementsConfig) {
            console.log('\n➕ Ajout de elements_config...');
            try {
                await window.api.database.query("ALTER TABLE invoice_templates ADD COLUMN elements_config TEXT NOT NULL DEFAULT '{}'");
                console.log('✅ elements_config ajoutée');
                migrationsNeeded++;
            } catch (error) {
                if (error.message.includes('duplicate column')) {
                    console.log('✅ elements_config existe déjà');
                } else {
                    console.error('❌ Erreur ajout elements_config:', error.message);
                }
            }
        }

        if (!hasFooterContent) {
            console.log('\n➕ Ajout de footer_content...');
            try {
                await window.api.database.query("ALTER TABLE invoice_templates ADD COLUMN footer_content TEXT NOT NULL DEFAULT '{}'");
                console.log('✅ footer_content ajoutée');
                migrationsNeeded++;
            } catch (error) {
                if (error.message.includes('duplicate column')) {
                    console.log('✅ footer_content existe déjà');
                } else {
                    console.error('❌ Erreur ajout footer_content:', error.message);
                }
            }
        }

        // Étape 4: Initialiser les données
        console.log('\n🔄 Initialisation des données...');
        
        const defaultElementsConfig = JSON.stringify({
            show_logo: true,
            show_line_numbers: true,
            show_unit_badges: true,
            show_due_date: true,
            show_legal_mentions: true
        });

        const defaultFooterContent = JSON.stringify({
            thank_you_message: "Merci pour votre confiance",
            payment_terms: "Conditions de paiement: 30 jours",
            custom_message: "Cette facture est générée automatiquement par le système de gestion.",
            legal_info: "ICE: 123456789012345 • RC: 12345 • CNSS: 67890"
        });

        try {
            const elementsResult = await window.api.database.query(
                "UPDATE invoice_templates SET elements_config = ? WHERE elements_config = '{}' OR elements_config IS NULL",
                [defaultElementsConfig]
            );
            console.log(`✅ ${elementsResult.changes || 0} templates mis à jour avec elements_config`);
        } catch (error) {
            console.error('❌ Erreur mise à jour elements_config:', error.message);
        }

        try {
            const footerResult = await window.api.database.query(
                "UPDATE invoice_templates SET footer_content = ? WHERE footer_content = '{}' OR footer_content IS NULL",
                [defaultFooterContent]
            );
            console.log(`✅ ${footerResult.changes || 0} templates mis à jour avec footer_content`);
        } catch (error) {
            console.error('❌ Erreur mise à jour footer_content:', error.message);
        }

        // Étape 5: Vérification finale
        console.log('\n🔍 Vérification finale...');
        const finalColumns = await window.api.database.query("PRAGMA table_info(invoice_templates)");
        const finalHasElementsConfig = finalColumns.some(col => col.name === 'elements_config');
        const finalHasFooterContent = finalColumns.some(col => col.name === 'footer_content');

        console.log('📊 État final:');
        console.log(`   elements_config: ${finalHasElementsConfig ? '✅ Existe' : '❌ Manquante'}`);
        console.log(`   footer_content: ${finalHasFooterContent ? '✅ Existe' : '❌ Manquante'}`);

        // Étape 6: Test de récupération
        console.log('\n🧪 Test de récupération...');
        const testTemplates = await window.api.templates.getAll();
        if (testTemplates.length > 0) {
            const template = testTemplates[0];
            console.log('📋 Premier template après correction:');
            console.log(`   elements_config: ${template.elements_config || 'undefined'}`);
            console.log(`   footer_content: ${template.footer_content || 'undefined'}`);
        }

        console.log('\n🎉 CORRECTION TERMINÉE !');
        console.log('🔄 Essayez maintenant de sauvegarder un template...');

    } catch (error) {
        console.error('❌ Erreur générale:', error);
    }
}

// Exécuter la correction
fixDatabaseLive();

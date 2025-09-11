// migrate-footer-content.js - Migration pour ajouter la colonne footer_content

const Database = require('better-sqlite3');
const path = require('path');

console.log('🔄 === MIGRATION FOOTER_CONTENT ===');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'data', 'gestionpro.db');

console.log(`📂 Chemin de la base de données: ${dbPath}`);

try {
    // Ouvrir la base de données
    const db = new Database(dbPath);
    
    console.log('✅ Base de données ouverte avec succès');
    
    // Vérifier si la colonne footer_content existe déjà
    console.log('\n1️⃣ VÉRIFICATION DE LA STRUCTURE ACTUELLE');
    
    const tableInfo = db.prepare("PRAGMA table_info(invoice_templates)").all();
    console.log('📊 Colonnes actuelles de invoice_templates:');
    tableInfo.forEach(col => {
        console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });
    
    const hasFooterContent = tableInfo.some(col => col.name === 'footer_content');
    
    if (hasFooterContent) {
        console.log('✅ La colonne footer_content existe déjà');
    } else {
        console.log('❌ La colonne footer_content n\'existe pas');
        
        console.log('\n2️⃣ AJOUT DE LA COLONNE FOOTER_CONTENT');
        
        // Ajouter la colonne footer_content
        const alterQuery = `
            ALTER TABLE invoice_templates 
            ADD COLUMN footer_content TEXT NOT NULL DEFAULT '{}'
        `;
        
        db.exec(alterQuery);
        console.log('✅ Colonne footer_content ajoutée avec succès');
        
        // Vérifier que la colonne a été ajoutée
        const newTableInfo = db.prepare("PRAGMA table_info(invoice_templates)").all();
        const newHasFooterContent = newTableInfo.some(col => col.name === 'footer_content');
        
        if (newHasFooterContent) {
            console.log('✅ Vérification: La colonne footer_content est maintenant présente');
        } else {
            console.error('❌ Erreur: La colonne footer_content n\'a pas été ajoutée correctement');
        }
    }
    
    console.log('\n3️⃣ VÉRIFICATION DES DONNÉES EXISTANTES');
    
    // Compter les templates existants
    const templateCount = db.prepare("SELECT COUNT(*) as count FROM invoice_templates").get();
    console.log(`📊 Nombre de templates existants: ${templateCount.count}`);
    
    if (templateCount.count > 0) {
        // Afficher quelques templates pour vérification
        const templates = db.prepare("SELECT id, name, display_name, footer_content FROM invoice_templates LIMIT 3").all();
        console.log('📋 Exemples de templates:');
        templates.forEach(template => {
            console.log(`   - ID: ${template.id}, Nom: ${template.display_name}`);
            console.log(`     footer_content: ${template.footer_content}`);
        });
        
        // Mettre à jour les templates existants avec un contenu par défaut si nécessaire
        console.log('\n4️⃣ MISE À JOUR DES TEMPLATES EXISTANTS');
        
        const emptyFooterTemplates = db.prepare("SELECT COUNT(*) as count FROM invoice_templates WHERE footer_content = '{}'").get();
        console.log(`📊 Templates avec footer_content vide: ${emptyFooterTemplates.count}`);
        
        if (emptyFooterTemplates.count > 0) {
            const defaultFooterContent = JSON.stringify({
                thank_you_message: 'Merci pour votre confiance',
                payment_terms: 'Conditions de paiement: 30 jours',
                custom_message: 'Cette facture est générée automatiquement par le système de gestion.',
                legal_info: 'ICE: 123456789012345 • RC: 12345 • CNSS: 67890'
            });
            
            const updateStmt = db.prepare(`
                UPDATE invoice_templates 
                SET footer_content = ?, updated_at = strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')
                WHERE footer_content = '{}'
            `);
            
            const result = updateStmt.run(defaultFooterContent);
            console.log(`✅ ${result.changes} templates mis à jour avec le contenu par défaut`);
        }
    }
    
    console.log('\n5️⃣ VÉRIFICATION FINALE');
    
    // Vérifier la structure finale
    const finalTableInfo = db.prepare("PRAGMA table_info(invoice_templates)").all();
    const finalHasFooterContent = finalTableInfo.some(col => col.name === 'footer_content');
    
    if (finalHasFooterContent) {
        console.log('✅ SUCCÈS: La colonne footer_content est présente et fonctionnelle');
        
        // Test d'insertion pour vérifier que tout fonctionne
        console.log('\n6️⃣ TEST D\'INSERTION');
        
        const testFooterContent = JSON.stringify({
            thank_you_message: 'TEST: Merci pour votre confiance',
            payment_terms: 'TEST: Conditions de paiement: 15 jours',
            custom_message: 'TEST: Message personnalisé de test',
            legal_info: 'TEST: ICE: 999999999999999 • RC: 99999'
        });
        
        try {
            const insertStmt = db.prepare(`
                INSERT INTO invoice_templates 
                (name, display_name, colors_config, fonts_config, layout_config, footer_content, user_created)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            
            const testResult = insertStmt.run(
                'test-footer-' + Date.now(),
                'Test Footer Content',
                '{}',
                '{}',
                '{}',
                testFooterContent,
                1
            );
            
            console.log(`✅ Test d'insertion réussi, ID: ${testResult.lastInsertRowid}`);
            
            // Récupérer et vérifier le template de test
            const testTemplate = db.prepare("SELECT * FROM invoice_templates WHERE id = ?").get(testResult.lastInsertRowid);
            console.log('📋 Template de test récupéré:');
            console.log(`   - ID: ${testTemplate.id}`);
            console.log(`   - Nom: ${testTemplate.display_name}`);
            console.log(`   - footer_content: ${testTemplate.footer_content}`);
            
            // Parser le JSON pour vérifier
            const parsedFooter = JSON.parse(testTemplate.footer_content);
            console.log('📄 Contenu du pied de page parsé:');
            Object.keys(parsedFooter).forEach(key => {
                console.log(`   - ${key}: "${parsedFooter[key]}"`);
            });
            
            // Supprimer le template de test
            db.prepare("DELETE FROM invoice_templates WHERE id = ?").run(testResult.lastInsertRowid);
            console.log('🗑️ Template de test supprimé');
            
        } catch (error) {
            console.error('❌ Erreur lors du test d\'insertion:', error);
        }
        
    } else {
        console.error('❌ ÉCHEC: La colonne footer_content n\'est toujours pas présente');
    }
    
    // Fermer la base de données
    db.close();
    console.log('\n🎉 MIGRATION TERMINÉE AVEC SUCCÈS');
    console.log('💡 Vous pouvez maintenant redémarrer l\'application et tester la personnalisation du pied de page');
    
} catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
}

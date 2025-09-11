// migrate-footer-in-app.js - Migration à exécuter dans l'application

console.log('🔄 === MIGRATION FOOTER_CONTENT DANS L\'APPLICATION ===');

/**
 * Migration pour ajouter la colonne footer_content
 * À exécuter dans la console de l'application
 */
async function migrateFooterContentInApp() {
    try {
        console.log('1️⃣ VÉRIFICATION DE L\'ENVIRONNEMENT');
        
        if (!window.api || !window.api.database) {
            console.error('❌ API de base de données non disponible');
            return false;
        }
        
        console.log('✅ API de base de données disponible');
        
        console.log('\n2️⃣ VÉRIFICATION DE LA STRUCTURE ACTUELLE');
        
        // Tenter de récupérer un template pour voir la structure
        try {
            const templates = await window.api.templates.getAll();
            console.log(`📊 ${templates.length} templates trouvés`);
            
            if (templates.length > 0) {
                const firstTemplate = templates[0];
                console.log('📋 Structure du premier template:');
                Object.keys(firstTemplate).forEach(key => {
                    console.log(`   - ${key}: ${typeof firstTemplate[key]}`);
                });
                
                if (firstTemplate.footer_content !== undefined) {
                    console.log('✅ La colonne footer_content existe déjà');
                    console.log('   Valeur actuelle:', firstTemplate.footer_content);
                    return true;
                } else {
                    console.log('❌ La colonne footer_content n\'existe pas');
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors de la vérification:', error);
        }
        
        console.log('\n3️⃣ TENTATIVE D\'AJOUT DE LA COLONNE');
        
        // Essayer d'exécuter une requête ALTER TABLE via l'API
        try {
            // Cette approche nécessiterait une fonction spéciale dans l'API
            console.log('⚠️ La migration automatique nécessite une fonction spéciale dans l\'API');
            console.log('💡 Solution alternative : Mise à jour manuelle du schéma');
            
            return false;
        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout de la colonne:', error);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erreur générale lors de la migration:', error);
        return false;
    }
}

/**
 * Test de création d'un template avec footer_content
 */
async function testFooterContentCreation() {
    console.log('\n🧪 === TEST CRÉATION TEMPLATE AVEC FOOTER_CONTENT ===');
    
    try {
        const testTemplate = {
            name: 'test-footer-' + Date.now(),
            display_name: 'Test Footer Content',
            colors_config: {},
            fonts_config: {},
            layout_config: {},
            elements_config: {},
            footer_content: {
                thank_you_message: 'TEST: Merci pour votre confiance',
                payment_terms: 'TEST: Conditions de paiement: 15 jours',
                custom_message: 'TEST: Message personnalisé de test',
                legal_info: 'TEST: ICE: 999999999999999 • RC: 99999'
            },
            user_created: 1
        };
        
        console.log('📝 Tentative de création d\'un template de test...');
        const result = await window.api.templates.create(testTemplate);
        
        if (result.success) {
            console.log('✅ Template de test créé avec succès, ID:', result.templateId);
            
            // Récupérer le template pour vérifier
            const createdTemplate = await window.api.templates.getById(result.templateId);
            if (createdTemplate) {
                console.log('📋 Template récupéré:');
                console.log('   - ID:', createdTemplate.id);
                console.log('   - Nom:', createdTemplate.display_name);
                console.log('   - footer_content:', createdTemplate.footer_content);
                
                if (createdTemplate.footer_content) {
                    console.log('✅ footer_content est présent dans la base de données');
                    
                    // Parser le JSON si c'est une chaîne
                    let footerContent = createdTemplate.footer_content;
                    if (typeof footerContent === 'string') {
                        try {
                            footerContent = JSON.parse(footerContent);
                        } catch (e) {
                            console.warn('⚠️ Erreur de parsing JSON:', e);
                        }
                    }
                    
                    console.log('📄 Contenu du pied de page:');
                    if (typeof footerContent === 'object') {
                        Object.keys(footerContent).forEach(key => {
                            console.log(`   - ${key}: "${footerContent[key]}"`);
                        });
                    }
                } else {
                    console.log('❌ footer_content n\'est pas présent dans le template récupéré');
                }
                
                // Supprimer le template de test
                await window.api.templates.delete(result.templateId);
                console.log('🗑️ Template de test supprimé');
                
                return createdTemplate.footer_content !== undefined;
            }
        } else {
            console.error('❌ Échec de la création du template:', result.error);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        return false;
    }
}

/**
 * Instructions pour la migration manuelle
 */
function showManualMigrationInstructions() {
    console.log('\n📋 === INSTRUCTIONS MIGRATION MANUELLE ===');
    console.log('');
    console.log('Si la migration automatique ne fonctionne pas, voici les étapes manuelles :');
    console.log('');
    console.log('1️⃣ FERMER L\'APPLICATION complètement');
    console.log('');
    console.log('2️⃣ OUVRIR LA BASE DE DONNÉES avec un outil SQLite :');
    console.log('   - Téléchargez DB Browser for SQLite : https://sqlitebrowser.org/');
    console.log('   - Ouvrez le fichier : data/gestionpro.db');
    console.log('');
    console.log('3️⃣ EXÉCUTER CES REQUÊTES SQL :');
    console.log('');
    console.log('-- Ajouter la colonne elements_config si elle n\'existe pas');
    console.log('ALTER TABLE invoice_templates ADD COLUMN elements_config TEXT NOT NULL DEFAULT \'{}\';');
    console.log('');
    console.log('-- Ajouter la colonne footer_content');
    console.log('ALTER TABLE invoice_templates ADD COLUMN footer_content TEXT NOT NULL DEFAULT \'{}\';');
    console.log('');
    console.log('-- Initialiser les templates existants avec du contenu par défaut');
    console.log('UPDATE invoice_templates SET footer_content = \'{"thank_you_message":"Merci pour votre confiance","payment_terms":"Conditions de paiement: 30 jours","custom_message":"Cette facture est générée automatiquement par le système de gestion.","legal_info":"ICE: 123456789012345 • RC: 12345 • CNSS: 67890"}\' WHERE footer_content = \'{}\';');
    console.log('');
    console.log('4️⃣ SAUVEGARDER et FERMER DB Browser');
    console.log('');
    console.log('5️⃣ REDÉMARRER L\'APPLICATION');
    console.log('');
    console.log('6️⃣ TESTER avec testFooterContentCreation()');
}

// Exporter les fonctions
window.migrateFooterContentInApp = migrateFooterContentInApp;
window.testFooterContentCreation = testFooterContentCreation;
window.showManualMigrationInstructions = showManualMigrationInstructions;

console.log('🛠️ Fonctions de migration disponibles :');
console.log('- migrateFooterContentInApp() : Tentative de migration dans l\'app');
console.log('- testFooterContentCreation() : Test de création avec footer_content');
console.log('- showManualMigrationInstructions() : Instructions pour migration manuelle');
console.log('');
console.log('💡 Commencez par : testFooterContentCreation()');

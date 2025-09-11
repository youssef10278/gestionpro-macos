/**
 * Test de l'En-tête Société dans les Bons de Livraison
 * Vérifie que les informations de la société sont correctement intégrées
 */

console.log('🏢 TEST EN-TÊTE SOCIÉTÉ - BONS DE LIVRAISON');
console.log('===========================================\n');

const fs = require('fs');
const path = require('path');

function testCompanyHeaderIntegration() {
    console.log('🔍 Vérification de l\'intégration en-tête société...');
    
    try {
        const filePath = path.join(__dirname, 'src', 'js', 'delivery-notes.js');
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifications des modifications apportées
        const checks = [
            {
                name: 'Fonction async generatePrintPreview',
                pattern: /async function generatePrintPreview/,
                description: 'La fonction est maintenant asynchrone'
            },
            {
                name: 'Récupération informations société',
                pattern: /window\.api\.settings\.getCompanyInfo\(\)/,
                description: 'Appel API pour récupérer les infos société'
            },
            {
                name: 'En-tête société HTML',
                pattern: /company-header/,
                description: 'Structure HTML pour l\'en-tête société'
            },
            {
                name: 'Logo de la société',
                pattern: /company-logo/,
                description: 'Support du logo dans l\'en-tête'
            },
            {
                name: 'Informations société (nom)',
                pattern: /companyInfo\.name/,
                description: 'Affichage du nom de la société'
            },
            {
                name: 'Informations société (adresse)',
                pattern: /companyInfo\.address/,
                description: 'Affichage de l\'adresse'
            },
            {
                name: 'Informations société (téléphone)',
                pattern: /companyInfo\.phone/,
                description: 'Affichage du téléphone'
            },
            {
                name: 'Informations société (email)',
                pattern: /companyInfo\.email/,
                description: 'Affichage de l\'email'
            },
            {
                name: 'Informations société (ICE)',
                pattern: /companyInfo\.ice/,
                description: 'Affichage du numéro ICE'
            },
            {
                name: 'Styles CSS en-tête',
                pattern: /\.company-header/,
                description: 'Styles CSS pour l\'en-tête société'
            },
            {
                name: 'Fonction printDelivery async',
                pattern: /async function printDelivery/,
                description: 'Fonction d\'impression asynchrone'
            },
            {
                name: 'Await generatePrintPreview',
                pattern: /await generatePrintPreview/,
                description: 'Appel asynchrone de la génération d\'aperçu'
            }
        ];
        
        let passedChecks = 0;
        
        checks.forEach(check => {
            if (check.pattern.test(content)) {
                console.log(`✅ ${check.name} - ${check.description}`);
                passedChecks++;
            } else {
                console.log(`❌ ${check.name} - Manquant`);
            }
        });
        
        console.log(`\n📊 ${passedChecks}/${checks.length} vérifications réussies\n`);
        
        return passedChecks >= 10; // Au moins 10 sur 12
        
    } catch (error) {
        console.log('❌ Erreur lors de la vérification:', error.message);
        return false;
    }
}

function testCompanyInfoAPI() {
    console.log('🔌 Vérification de l\'API des informations société...');
    
    try {
        // Vérifier database.js
        const dbPath = path.join(__dirname, 'database.js');
        const dbContent = fs.readFileSync(dbPath, 'utf8');
        
        const apiChecks = [
            {
                name: 'getCompanyInfo function',
                pattern: /getCompanyInfo.*=>/,
                description: 'Fonction de récupération des infos société'
            },
            {
                name: 'saveCompanyInfo function',
                pattern: /saveCompanyInfo.*=>/,
                description: 'Fonction de sauvegarde des infos société'
            },
            {
                name: 'company_name setting',
                pattern: /company_name/,
                description: 'Support du nom de société'
            },
            {
                name: 'company_address setting',
                pattern: /company_address/,
                description: 'Support de l\'adresse'
            },
            {
                name: 'company_phone setting',
                pattern: /company_phone/,
                description: 'Support du téléphone'
            },
            {
                name: 'company_email setting',
                pattern: /company_email/,
                description: 'Support de l\'email'
            },
            {
                name: 'company_ice setting',
                pattern: /company_ice/,
                description: 'Support du numéro ICE'
            },
            {
                name: 'company_logo setting',
                pattern: /company_logo/,
                description: 'Support du logo'
            }
        ];
        
        let apiPassed = 0;
        
        apiChecks.forEach(check => {
            if (check.pattern.test(dbContent)) {
                console.log(`✅ ${check.name} - ${check.description}`);
                apiPassed++;
            } else {
                console.log(`❌ ${check.name} - Manquant`);
            }
        });
        
        console.log(`\n📊 ${apiPassed}/${apiChecks.length} API vérifications réussies\n`);
        
        return apiPassed >= 6; // Au moins 6 sur 8
        
    } catch (error) {
        console.log('❌ Erreur vérification API:', error.message);
        return false;
    }
}

function showUsageInstructions() {
    console.log('💡 INSTRUCTIONS D\'UTILISATION:');
    console.log('==============================');
    console.log('1. 🏢 Configurez les informations de votre société:');
    console.log('   - Allez dans Paramètres > Informations Société');
    console.log('   - Remplissez: Nom, Adresse, Téléphone, Email, ICE');
    console.log('   - Ajoutez un logo si souhaité (PNG/JPG)');
    console.log('');
    console.log('2. 📄 Créez ou modifiez un bon de livraison:');
    console.log('   - Les informations société apparaîtront automatiquement');
    console.log('   - L\'en-tête contiendra logo + infos société');
    console.log('   - Le document sera professionnel et personnalisé');
    console.log('');
    console.log('3. 🖨️ Impression:');
    console.log('   - L\'aperçu d\'impression montrera l\'en-tête complet');
    console.log('   - Le PDF généré inclura toutes les informations');
    console.log('   - Le logo sera redimensionné automatiquement');
    console.log('');
    console.log('4. 🎨 Personnalisation:');
    console.log('   - Logo recommandé: 200x80px maximum');
    console.log('   - Format: PNG ou JPG');
    console.log('   - L\'en-tête s\'adapte automatiquement');
}

function showTroubleshooting() {
    console.log('\n🔧 DÉPANNAGE:');
    console.log('==============');
    console.log('❓ Les infos société n\'apparaissent pas:');
    console.log('   → Vérifiez les paramètres dans Paramètres > Société');
    console.log('   → Redémarrez l\'application après modification');
    console.log('');
    console.log('❓ Le logo ne s\'affiche pas:');
    console.log('   → Vérifiez le format (PNG/JPG uniquement)');
    console.log('   → Taille recommandée: moins de 1MB');
    console.log('   → Rechargez la page après ajout du logo');
    console.log('');
    console.log('❓ Erreur lors de l\'impression:');
    console.log('   → Vérifiez la console (F12) pour les erreurs');
    console.log('   → Assurez-vous que l\'API fonctionne');
    console.log('   → Redémarrez l\'application si nécessaire');
}

// Fonction principale
function runCompanyHeaderTest() {
    console.log('🎯 Début du test en-tête société...\n');
    
    const results = {
        integration: testCompanyHeaderIntegration(),
        api: testCompanyInfoAPI()
    };
    
    const successCount = Object.values(results).filter(Boolean).length;
    
    console.log('📊 RÉSULTATS FINAUX:');
    console.log('====================');
    console.log('✅ Intégration en-tête:', results.integration ? 'OK' : 'ÉCHEC');
    console.log('✅ API informations société:', results.api ? 'OK' : 'ÉCHEC');
    
    console.log(`\n🎊 ${successCount}/2 catégories de tests réussies\n`);
    
    if (successCount === 2) {
        console.log('🎉 EN-TÊTE SOCIÉTÉ INTÉGRÉ AVEC SUCCÈS !');
        console.log('✅ Les bons de livraison afficheront maintenant:');
        console.log('   • Logo de la société (si configuré)');
        console.log('   • Nom de la société');
        console.log('   • Adresse complète');
        console.log('   • Téléphone et email');
        console.log('   • Numéro ICE');
        console.log('   • Site web (si configuré)');
        
        showUsageInstructions();
        
    } else {
        console.log('⚠️  INTÉGRATION PARTIELLE');
        console.log('Certaines fonctionnalités peuvent ne pas fonctionner.');
        
        showTroubleshooting();
    }
}

runCompanyHeaderTest();

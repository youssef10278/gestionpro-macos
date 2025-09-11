// test-pied-page-factures.js - Test de la personnalisation du pied de page des factures

console.log('📄 === TEST PIED DE PAGE FACTURES ===');

/**
 * Test complet de la personnalisation du pied de page
 */
async function testFooterCustomization() {
    try {
        console.log('\n1️⃣ VÉRIFICATION DE L\'ENVIRONNEMENT');
        
        // Vérifier qu'on est sur la page de personnalisation
        if (window.location.href.includes('template-designer.html')) {
            console.log('✅ Page de personnalisation des templates détectée');
            await testFooterDesigner();
        } else if (window.location.href.includes('invoices.html')) {
            console.log('✅ Page des factures détectée');
            await testFooterInInvoices();
        } else {
            console.log('⚠️ Page non reconnue, test générique');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

/**
 * Test des contrôles du pied de page dans le designer
 */
async function testFooterDesigner() {
    console.log('\n2️⃣ TEST DES CONTRÔLES DU PIED DE PAGE');
    
    // Vérifier que les éléments existent
    const footerInputs = {
        thankYou: document.getElementById('footerThankYou'),
        paymentTerms: document.getElementById('footerPaymentTerms'),
        customMessage: document.getElementById('footerCustomMessage'),
        legalInfo: document.getElementById('footerLegalInfo')
    };
    
    const resetBtn = document.getElementById('resetFooterBtn');
    
    console.log('🔍 Vérification des éléments DOM:');
    Object.keys(footerInputs).forEach(key => {
        const element = footerInputs[key];
        console.log(`   - ${key}: ${element ? '✅' : '❌'}`);
    });
    console.log(`   - Bouton reset: ${resetBtn ? '✅' : '❌'}`);
    
    if (!Object.values(footerInputs).every(el => el)) {
        console.error('❌ Certains éléments du pied de page sont manquants');
        return;
    }
    
    console.log('\n3️⃣ TEST DES VALEURS PAR DÉFAUT');
    
    // Vérifier les valeurs par défaut
    const defaultValues = {
        thankYou: 'Merci pour votre confiance',
        paymentTerms: 'Conditions de paiement: 30 jours',
        customMessage: 'Cette facture est générée automatiquement par le système de gestion.',
        legalInfo: 'ICE: 123456789012345 • RC: 12345 • CNSS: 67890'
    };
    
    Object.keys(defaultValues).forEach(key => {
        const element = footerInputs[key];
        const expectedValue = defaultValues[key];
        const actualValue = element.value;
        
        console.log(`📝 ${key}:`);
        console.log(`   Attendu: "${expectedValue}"`);
        console.log(`   Actuel: "${actualValue}"`);
        console.log(`   Status: ${actualValue.includes(expectedValue.split(' ')[0]) ? '✅' : '⚠️'}`);
    });
    
    console.log('\n4️⃣ TEST DE MODIFICATION DES VALEURS');
    
    // Tester la modification des valeurs
    const testValues = {
        thankYou: 'Merci beaucoup pour votre confiance !',
        paymentTerms: 'Paiement sous 15 jours',
        customMessage: 'Facture générée par GestionPro - Système de gestion moderne.',
        legalInfo: 'ICE: 987654321098765 • RC: 54321 • CNSS: 09876 • Patente: 12345678'
    };
    
    Object.keys(testValues).forEach(key => {
        const element = footerInputs[key];
        const testValue = testValues[key];
        
        // Sauvegarder la valeur originale
        const originalValue = element.value;
        
        // Modifier la valeur
        element.value = testValue;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log(`✏️ ${key}: "${testValue}" ${element.value === testValue ? '✅' : '❌'}`);
        
        // Restaurer la valeur originale après un délai
        setTimeout(() => {
            element.value = originalValue;
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }, 2000);
    });
    
    console.log('\n5️⃣ TEST DU BOUTON DE RÉINITIALISATION');
    
    if (resetBtn) {
        console.log('🔄 Test du bouton de réinitialisation...');
        
        // Modifier quelques valeurs
        footerInputs.thankYou.value = 'Test modifié';
        footerInputs.paymentTerms.value = 'Test modifié';
        
        // Cliquer sur reset
        resetBtn.click();
        
        // Vérifier après un délai
        setTimeout(() => {
            const isReset = footerInputs.thankYou.value.includes('Merci') && 
                           footerInputs.paymentTerms.value.includes('Conditions');
            console.log(`   Réinitialisation: ${isReset ? '✅' : '❌'}`);
        }, 500);
    }
    
    console.log('\n6️⃣ TEST DE SAUVEGARDE');
    
    // Tester la fonction de récupération des données
    if (window.templateDesigner && window.templateDesigner.getTemplateDataFromForm) {
        try {
            const templateData = window.templateDesigner.getTemplateDataFromForm();
            
            console.log('💾 Données du template récupérées:');
            console.log('   - footer_content:', templateData.footer_content);
            
            if (templateData.footer_content) {
                console.log('✅ Le contenu du pied de page est inclus dans la sauvegarde');
                Object.keys(templateData.footer_content).forEach(key => {
                    console.log(`     - ${key}: "${templateData.footer_content[key]}"`);
                });
            } else {
                console.warn('⚠️ Le contenu du pied de page n\'est pas inclus dans la sauvegarde');
            }
        } catch (error) {
            console.warn('⚠️ Impossible de tester la sauvegarde:', error.message);
        }
    }
}

/**
 * Test du pied de page dans les factures générées
 */
async function testFooterInInvoices() {
    console.log('\n2️⃣ TEST DU PIED DE PAGE DANS LES FACTURES');
    
    // Vérifier les fonctions disponibles
    const functions = {
        getFooterContent: typeof getFooterContent === 'function',
        getDefaultFooterContent: typeof getDefaultFooterContent === 'function',
        generatePrintableInvoice: typeof generatePrintableInvoice === 'function'
    };
    
    console.log('🔍 Fonctions disponibles:');
    Object.keys(functions).forEach(key => {
        console.log(`   - ${key}: ${functions[key] ? '✅' : '❌'}`);
    });
    
    if (functions.getFooterContent) {
        console.log('\n3️⃣ TEST DE RÉCUPÉRATION DU CONTENU');
        
        try {
            const footerContent = await getFooterContent();
            console.log('📄 Contenu du pied de page récupéré:');
            console.log(`   - Message de remerciement: "${footerContent.thank_you_message}"`);
            console.log(`   - Conditions de paiement: "${footerContent.payment_terms}"`);
            console.log(`   - Message personnalisé: "${footerContent.custom_message}"`);
            console.log(`   - Informations légales: "${footerContent.legal_info}"`);
            
            console.log('✅ Récupération du contenu du pied de page réussie');
        } catch (error) {
            console.error('❌ Erreur lors de la récupération:', error);
        }
    }
    
    if (functions.getDefaultFooterContent) {
        console.log('\n4️⃣ TEST DU CONTENU PAR DÉFAUT');
        
        const defaultContent = getDefaultFooterContent();
        console.log('📄 Contenu par défaut:');
        Object.keys(defaultContent).forEach(key => {
            console.log(`   - ${key}: "${defaultContent[key]}"`);
        });
        
        console.log('✅ Contenu par défaut disponible');
    }
    
    console.log('\n5️⃣ TEST DE GÉNÉRATION HTML');
    
    // Créer un aperçu du pied de page
    if (functions.getFooterContent) {
        try {
            const footerContent = await getFooterContent();
            
            const footerHTML = `
                <div class="footer-preview" style="
                    border: 2px solid #ddd; 
                    padding: 15px; 
                    margin: 20px; 
                    background: #f9f9f9;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                ">
                    <h4 style="margin: 0 0 10px 0; color: #333;">📄 Aperçu du Pied de Page</h4>
                    <div class="legal-mentions" style="margin-bottom: 10px;">
                        <div style="margin-bottom: 5px; font-weight: 500;">${footerContent.thank_you_message}</div>
                        <div style="margin-bottom: 5px; font-weight: 500;">${footerContent.payment_terms}</div>
                    </div>
                    <div class="custom-message" style="margin-bottom: 10px; font-style: italic; color: #555;">
                        ${footerContent.custom_message}
                    </div>
                    <div class="legal-info" style="font-size: 10px; color: #777; text-align: center; border-top: 1px solid #eee; padding-top: 8px;">
                        ${footerContent.legal_info}
                    </div>
                    <button onclick="this.parentElement.remove()" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; padding: 2px 6px; cursor: pointer;">✕</button>
                </div>
            `;
            
            // Ajouter l'aperçu à la page
            const previewContainer = document.createElement('div');
            previewContainer.innerHTML = footerHTML;
            previewContainer.style.position = 'fixed';
            previewContainer.style.top = '50px';
            previewContainer.style.right = '50px';
            previewContainer.style.zIndex = '10000';
            previewContainer.style.maxWidth = '400px';
            
            document.body.appendChild(previewContainer);
            
            console.log('✅ Aperçu du pied de page créé (coin supérieur droit)');
            
        } catch (error) {
            console.error('❌ Erreur lors de la création de l\'aperçu:', error);
        }
    }
}

/**
 * Test rapide du pied de page
 */
async function testQuickFooter() {
    console.log('\n🚀 === TEST RAPIDE PIED DE PAGE ===');
    
    if (window.location.href.includes('template-designer.html')) {
        // Test rapide du designer
        const inputs = ['footerThankYou', 'footerPaymentTerms', 'footerCustomMessage', 'footerLegalInfo'];
        const found = inputs.filter(id => document.getElementById(id));
        
        console.log(`📝 Contrôles trouvés: ${found.length}/${inputs.length}`);
        found.forEach(id => {
            const element = document.getElementById(id);
            console.log(`   - ${id}: "${element.value.substring(0, 30)}..."`);
        });
        
    } else if (window.location.href.includes('invoices.html')) {
        // Test rapide des factures
        if (typeof getFooterContent === 'function') {
            try {
                const content = await getFooterContent();
                console.log('📄 Contenu récupéré avec succès');
                console.log(`   - Remerciement: "${content.thank_you_message.substring(0, 20)}..."`);
                console.log(`   - Conditions: "${content.payment_terms.substring(0, 20)}..."`);
            } catch (error) {
                console.error('❌ Erreur:', error.message);
            }
        } else {
            console.error('❌ Fonction getFooterContent non disponible');
        }
    }
}

/**
 * Test spécifique pour diagnostiquer le problème de sauvegarde
 */
async function debugFooterSave() {
    console.log('\n🔧 === DEBUG SAUVEGARDE PIED DE PAGE ===');

    if (!window.location.href.includes('template-designer.html')) {
        console.error('❌ Ce test doit être exécuté sur la page de personnalisation');
        return;
    }

    // Vérifier les éléments
    const footerInputs = {
        thankYou: document.getElementById('footerThankYou'),
        paymentTerms: document.getElementById('footerPaymentTerms'),
        customMessage: document.getElementById('footerCustomMessage'),
        legalInfo: document.getElementById('footerLegalInfo')
    };

    console.log('1️⃣ ÉTAT ACTUEL DES CHAMPS:');
    Object.keys(footerInputs).forEach(key => {
        const element = footerInputs[key];
        if (element) {
            console.log(`   - ${key}: "${element.value}"`);
        } else {
            console.log(`   - ${key}: ❌ ÉLÉMENT NON TROUVÉ`);
        }
    });

    console.log('\n2️⃣ MODIFICATION DES VALEURS:');
    const testValues = {
        thankYou: 'TEST: Merci pour votre confiance modifié',
        paymentTerms: 'TEST: Paiement sous 15 jours',
        customMessage: 'TEST: Message personnalisé modifié pour le test',
        legalInfo: 'TEST: ICE: 999999999999999 • RC: 99999 • CNSS: 99999'
    };

    // Modifier les valeurs
    Object.keys(testValues).forEach(key => {
        const element = footerInputs[key];
        if (element) {
            element.value = testValues[key];
            element.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`   ✏️ ${key} modifié: "${testValues[key]}"`);
        }
    });

    console.log('\n3️⃣ VÉRIFICATION APRÈS MODIFICATION:');
    Object.keys(footerInputs).forEach(key => {
        const element = footerInputs[key];
        if (element) {
            console.log(`   - ${key}: "${element.value}"`);
        }
    });

    console.log('\n4️⃣ TEST DE LA FONCTION getTemplateDataFromForm():');
    if (window.templateDesigner && window.templateDesigner.getTemplateDataFromForm) {
        try {
            const templateData = window.templateDesigner.getTemplateDataFromForm();
            console.log('📊 Données récupérées:');
            console.log('   - footer_content:', templateData.footer_content);

            if (templateData.footer_content) {
                Object.keys(templateData.footer_content).forEach(key => {
                    console.log(`     - ${key}: "${templateData.footer_content[key]}"`);
                });
            }
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des données:', error);
        }
    } else {
        console.error('❌ templateDesigner.getTemplateDataFromForm non disponible');
    }

    console.log('\n5️⃣ SIMULATION DE SAUVEGARDE:');
    if (window.templateDesigner && window.templateDesigner.saveTemplate) {
        console.log('💾 Tentative de sauvegarde...');
        try {
            await window.templateDesigner.saveTemplate();
            console.log('✅ Sauvegarde terminée');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
        }
    } else {
        console.warn('⚠️ Fonction de sauvegarde non disponible pour le test');
    }

    console.log('\n6️⃣ VÉRIFICATION APRÈS SAUVEGARDE:');
    setTimeout(() => {
        Object.keys(footerInputs).forEach(key => {
            const element = footerInputs[key];
            if (element) {
                const isStillModified = element.value.includes('TEST:');
                console.log(`   - ${key}: "${element.value}" ${isStillModified ? '✅ CONSERVÉ' : '❌ RÉINITIALISÉ'}`);
            }
        });

        console.log('\n🎯 DIAGNOSTIC:');
        const allConserved = Object.keys(footerInputs).every(key => {
            const element = footerInputs[key];
            return element && element.value.includes('TEST:');
        });

        if (allConserved) {
            console.log('✅ PROBLÈME RÉSOLU: Les valeurs sont conservées après sauvegarde');
        } else {
            console.log('❌ PROBLÈME PERSISTANT: Les valeurs sont réinitialisées après sauvegarde');
            console.log('🔍 Causes possibles:');
            console.log('   1. Le template est rechargé après sauvegarde');
            console.log('   2. Les données ne sont pas correctement sauvegardées en base');
            console.log('   3. Le parsing JSON échoue lors du rechargement');
            console.log('   4. Les événements de rechargement écrasent les valeurs');
        }
    }, 2000);
}

// Exporter les fonctions
window.testFooterCustomization = testFooterCustomization;
window.testFooterDesigner = testFooterDesigner;
window.testFooterInInvoices = testFooterInInvoices;
window.testQuickFooter = testQuickFooter;
window.debugFooterSave = debugFooterSave;
window.testFooterSaveFix = testFooterSaveFix;

/**
 * Test de vérification de la correction
 */
async function testFooterSaveFix() {
    console.log('\n🔧 === TEST CORRECTION SAUVEGARDE PIED DE PAGE ===');

    if (!window.location.href.includes('template-designer.html')) {
        console.error('❌ Ce test doit être exécuté sur la page de personnalisation');
        return;
    }

    console.log('1️⃣ VÉRIFICATION DU TEMPLATE MANAGER');

    // Vérifier que le template manager parse footer_content
    if (window.templateManager) {
        console.log('✅ TemplateManager disponible');

        // Tester le rechargement d'un template
        try {
            const currentTemplate = await window.templateManager.getCurrentTemplate();
            if (currentTemplate) {
                console.log('📋 Template actuel:', currentTemplate.display_name);
                console.log('📄 footer_content type:', typeof currentTemplate.footer_content);
                console.log('📄 footer_content value:', currentTemplate.footer_content);

                if (typeof currentTemplate.footer_content === 'object') {
                    console.log('✅ footer_content est correctement parsé en objet');
                } else {
                    console.log('⚠️ footer_content n\'est pas un objet, parsing nécessaire');
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors de la récupération du template:', error);
        }
    } else {
        console.error('❌ TemplateManager non disponible');
    }

    console.log('\n2️⃣ TEST DE SAUVEGARDE COMPLÈTE');

    const footerInputs = {
        thankYou: document.getElementById('footerThankYou'),
        paymentTerms: document.getElementById('footerPaymentTerms'),
        customMessage: document.getElementById('footerCustomMessage'),
        legalInfo: document.getElementById('footerLegalInfo')
    };

    // Valeurs de test uniques
    const timestamp = Date.now();
    const testValues = {
        thankYou: `TEST-${timestamp}: Merci pour votre confiance`,
        paymentTerms: `TEST-${timestamp}: Paiement sous 15 jours`,
        customMessage: `TEST-${timestamp}: Message personnalisé pour le test`,
        legalInfo: `TEST-${timestamp}: ICE: 999999999999999 • RC: 99999`
    };

    console.log('📝 Modification des valeurs avec timestamp:', timestamp);

    // Modifier les valeurs
    Object.keys(testValues).forEach(key => {
        const element = footerInputs[key];
        if (element) {
            element.value = testValues[key];
            element.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`   ✏️ ${key}: "${testValues[key]}"`);
        }
    });

    console.log('\n3️⃣ SAUVEGARDE ET VÉRIFICATION');

    if (window.templateDesigner && window.templateDesigner.saveTemplate) {
        try {
            console.log('💾 Sauvegarde en cours...');
            await window.templateDesigner.saveTemplate();
            console.log('✅ Sauvegarde terminée');

            // Attendre un peu pour que le rechargement se termine
            setTimeout(async () => {
                console.log('\n4️⃣ VÉRIFICATION APRÈS RECHARGEMENT');

                let allPreserved = true;
                Object.keys(testValues).forEach(key => {
                    const element = footerInputs[key];
                    if (element) {
                        const isPreserved = element.value.includes(`TEST-${timestamp}`);
                        console.log(`   - ${key}: "${element.value}" ${isPreserved ? '✅ CONSERVÉ' : '❌ PERDU'}`);
                        if (!isPreserved) allPreserved = false;
                    }
                });

                console.log('\n🎯 RÉSULTAT FINAL:');
                if (allPreserved) {
                    console.log('🎉 SUCCÈS: La correction fonctionne ! Les valeurs sont conservées après sauvegarde.');
                    console.log('✅ Le problème de réinitialisation du pied de page est résolu.');
                } else {
                    console.log('❌ ÉCHEC: Le problème persiste. Les valeurs sont encore perdues.');
                    console.log('🔍 Vérifiez les logs de debug pour plus d\'informations.');
                }

                // Vérifier aussi dans la base de données
                try {
                    const currentTemplate = await window.templateManager.getCurrentTemplate();
                    if (currentTemplate && currentTemplate.footer_content) {
                        console.log('\n📊 VÉRIFICATION BASE DE DONNÉES:');
                        console.log('   - footer_content en base:', currentTemplate.footer_content);

                        const hasTestData = JSON.stringify(currentTemplate.footer_content).includes(`TEST-${timestamp}`);
                        console.log(`   - Données de test en base: ${hasTestData ? '✅ PRÉSENTES' : '❌ ABSENTES'}`);
                    }
                } catch (error) {
                    console.warn('⚠️ Impossible de vérifier la base de données:', error);
                }

            }, 3000); // Attendre 3 secondes pour le rechargement

        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
        }
    } else {
        console.error('❌ Fonction de sauvegarde non disponible');
    }
}

console.log('🛠️ Fonctions de test disponibles:');
console.log('- testFooterCustomization() : Test complet de la personnalisation du pied de page');
console.log('- testQuickFooter() : Test rapide du pied de page');
console.log('- debugFooterSave() : Diagnostic du problème de sauvegarde');
console.log('- testFooterSaveFix() : Test de vérification de la correction');
console.log('\n💡 Pour tester la correction: testFooterSaveFix()');

// test-marges-factures-generees.js - Test des marges dans les factures générées

console.log('📄 === TEST MARGES FACTURES GÉNÉRÉES ===');

/**
 * Test complet des marges dans les factures générées
 */
async function testInvoiceMarginsGeneration() {
    try {
        console.log('\n1️⃣ VÉRIFICATION DE L\'ENVIRONNEMENT');
        
        // Vérifier qu'on est sur la page des factures
        if (!window.location.href.includes('invoices.html')) {
            console.error('❌ Ce test doit être exécuté sur la page des factures');
            return;
        }
        
        console.log('✅ Page des factures détectée');
        
        console.log('\n2️⃣ VÉRIFICATION DU TEMPLATE ACTUEL');
        
        // Vérifier la fonction de récupération des styles
        if (typeof getCurrentTemplateStyles !== 'function') {
            console.error('❌ Fonction getCurrentTemplateStyles non disponible');
            return;
        }
        
        console.log('✅ Fonction getCurrentTemplateStyles disponible');
        
        // Récupérer les styles du template actuel
        console.log('🎨 Récupération des styles du template...');
        const templateStyles = await getCurrentTemplateStyles();
        
        console.log('📊 Styles récupérés:');
        console.log(`   - Longueur: ${templateStyles.length} caractères`);
        
        // Analyser les marges dans le CSS
        const marginRegex = /padding:\s*([^;]+);/g;
        const pageMarginRegex = /@page\s*\{[^}]*margin:\s*([^;]+);/g;
        
        let paddingMatches = [];
        let pageMarginMatches = [];
        let match;
        
        // Chercher les paddings
        while ((match = marginRegex.exec(templateStyles)) !== null) {
            paddingMatches.push(match[1]);
        }
        
        // Chercher les marges @page
        while ((match = pageMarginRegex.exec(templateStyles)) !== null) {
            pageMarginMatches.push(match[1]);
        }
        
        console.log('📏 Marges trouvées dans le CSS:');
        console.log(`   - Paddings: ${paddingMatches.length} trouvé(s)`);
        paddingMatches.forEach((padding, index) => {
            console.log(`     ${index + 1}. ${padding}`);
        });
        
        console.log(`   - Marges @page: ${pageMarginMatches.length} trouvé(s)`);
        pageMarginMatches.forEach((margin, index) => {
            console.log(`     ${index + 1}. ${margin}`);
        });
        
        console.log('\n3️⃣ TEST DE GÉNÉRATION CSS AVEC MARGES PERSONNALISÉES');
        
        // Tester la fonction generateTemplateCSS directement si disponible
        if (typeof generateTemplateCSS === 'function') {
            console.log('🧪 Test de génération CSS avec marges personnalisées...');
            
            const testColors = { primary: '#2c5aa0', secondary: '#f97316', header_gradient_start: '#2c5aa0', header_gradient_end: '#1e40af' };
            const testFonts = { primary_font: 'Arial, sans-serif', title_size: '24px', body_size: '14px' };
            const testLayout = {
                header_height: '80px',
                section_spacing: '25px',
                page_margins: {
                    top: '30mm',
                    right: '25mm',
                    bottom: '30mm',
                    left: '25mm'
                }
            };
            const testElements = { show_logo: true, show_line_numbers: true };
            
            const customCSS = generateTemplateCSS(testColors, testFonts, testLayout, testElements);
            
            console.log('✅ CSS personnalisé généré');
            console.log(`📏 Longueur: ${customCSS.length} caractères`);
            
            // Vérifier que les marges personnalisées sont présentes
            const hasCustomPadding = customCSS.includes('padding: 30mm 25mm 30mm 25mm');
            const hasCustomPageMargin = customCSS.includes('margin: 30mm 25mm 30mm 25mm');
            
            console.log('🔍 Vérification des marges personnalisées:');
            console.log(`   - Padding personnalisé: ${hasCustomPadding ? '✅' : '❌'}`);
            console.log(`   - Marge @page personnalisée: ${hasCustomPageMargin ? '✅' : '❌'}`);
            
            if (hasCustomPadding || hasCustomPageMargin) {
                console.log('✅ Les marges personnalisées sont correctement appliquées');
            } else {
                console.warn('⚠️ Les marges personnalisées ne semblent pas être appliquées');
            }
            
        } else {
            console.warn('⚠️ Fonction generateTemplateCSS non accessible pour le test direct');
        }
        
        console.log('\n4️⃣ TEST AVEC TEMPLATE RÉEL');
        
        // Tester avec un template réel s'il y en a un de chargé
        try {
            const templateManager = window.templateManager;
            if (templateManager && templateManager.getCurrentTemplate) {
                const currentTemplate = await templateManager.getCurrentTemplate();
                
                if (currentTemplate) {
                    console.log('📋 Template actuel:', currentTemplate.display_name);
                    
                    // Parser la configuration
                    let layoutConfig = {};
                    try {
                        if (typeof currentTemplate.layout_config === 'string') {
                            layoutConfig = JSON.parse(currentTemplate.layout_config);
                        } else {
                            layoutConfig = currentTemplate.layout_config || {};
                        }
                    } catch (e) {
                        console.warn('⚠️ Erreur parsing layout_config:', e);
                    }
                    
                    console.log('📊 Configuration du layout:');
                    console.log('   - Layout config:', layoutConfig);
                    console.log('   - Page margins:', layoutConfig.page_margins);
                    
                    if (layoutConfig.page_margins) {
                        const margins = layoutConfig.page_margins;
                        console.log('📏 Marges du template:');
                        console.log(`   - Haut: ${margins.top || 'non défini'}`);
                        console.log(`   - Droite: ${margins.right || 'non défini'}`);
                        console.log(`   - Bas: ${margins.bottom || 'non défini'}`);
                        console.log(`   - Gauche: ${margins.left || 'non défini'}`);
                    } else {
                        console.log('📏 Aucune marge personnalisée définie dans le template');
                    }
                } else {
                    console.log('📋 Aucun template actuellement sélectionné');
                }
            } else {
                console.warn('⚠️ TemplateManager non disponible');
            }
        } catch (error) {
            console.warn('⚠️ Erreur lors de la récupération du template:', error);
        }
        
        console.log('\n5️⃣ TEST D\'APERÇU AVEC MARGES');
        
        // Créer un aperçu de test pour vérifier les marges
        console.log('🖼️ Création d\'un aperçu de test...');
        
        const testHTML = `
            <div class="invoice-container" style="border: 2px dashed #ccc; background: #f9f9f9;">
                <div style="background: white; padding: 20px; margin: 10px 0;">
                    <h1>FACTURE TEST</h1>
                    <p>Cette zone représente le contenu de la facture.</p>
                    <p>Les marges grises autour montrent l'espace des marges.</p>
                    <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
                        <strong>Zone de contenu principal</strong>
                    </div>
                </div>
            </div>
        `;
        
        // Créer un conteneur de test
        let testContainer = document.getElementById('marginTestContainer');
        if (!testContainer) {
            testContainer = document.createElement('div');
            testContainer.id = 'marginTestContainer';
            testContainer.style.cssText = `
                position: fixed;
                top: 50px;
                right: 50px;
                width: 300px;
                height: 400px;
                background: white;
                border: 2px solid #333;
                z-index: 10000;
                overflow: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(testContainer);
        }
        
        // Ajouter le CSS actuel et le HTML de test
        testContainer.innerHTML = `
            <style>${templateStyles}</style>
            <div style="transform: scale(0.3); transform-origin: top left; width: 333%;">
                ${testHTML}
            </div>
            <div style="position: absolute; top: 5px; right: 5px;">
                <button onclick="document.getElementById('marginTestContainer').remove()" 
                        style="background: red; color: white; border: none; padding: 5px;">✕</button>
            </div>
        `;
        
        console.log('✅ Aperçu de test créé (coin supérieur droit)');
        console.log('👁️ Vérifiez visuellement les marges dans l\'aperçu');
        
        console.log('\n6️⃣ INSTRUCTIONS POUR TEST MANUEL');
        
        console.log('📋 Pour tester complètement les marges:');
        console.log('1. Allez dans Personnalisation des Factures');
        console.log('2. Modifiez les marges (ex: 30mm partout)');
        console.log('3. Sauvegardez le template');
        console.log('4. Revenez sur cette page et relancez ce test');
        console.log('5. Créez/imprimez une facture pour voir le résultat final');
        
        console.log('\n🎯 RÉSULTAT FINAL');
        console.log('✅ Test des marges terminé');
        console.log('📋 Vérifiez les résultats ci-dessus et l\'aperçu visuel');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

/**
 * Test rapide des marges
 */
async function testQuickInvoiceMargins() {
    console.log('\n🚀 === TEST RAPIDE MARGES ===');
    
    try {
        if (typeof getCurrentTemplateStyles === 'function') {
            const styles = await getCurrentTemplateStyles();
            
            // Chercher les marges dans le CSS
            const paddingMatch = styles.match(/\.invoice-container[^}]*padding:\s*([^;]+);/);
            const pageMarginMatch = styles.match(/@page[^}]*margin:\s*([^;]+);/);
            
            console.log('📏 Marges détectées:');
            console.log(`   - Container padding: ${paddingMatch ? paddingMatch[1] : 'Non trouvé'}`);
            console.log(`   - Page margin: ${pageMarginMatch ? pageMarginMatch[1] : 'Non trouvé'}`);
            
            if (paddingMatch || pageMarginMatch) {
                console.log('✅ Marges personnalisées détectées');
            } else {
                console.log('⚠️ Marges par défaut utilisées');
            }
        } else {
            console.error('❌ Fonction getCurrentTemplateStyles non disponible');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

/**
 * Afficher les marges du template actuel
 */
async function showCurrentTemplateMargins() {
    console.log('\n📊 === MARGES DU TEMPLATE ACTUEL ===');
    
    try {
        const templateManager = window.templateManager;
        if (templateManager && templateManager.getCurrentTemplate) {
            const template = await templateManager.getCurrentTemplate();
            
            if (template) {
                console.log(`📋 Template: ${template.display_name}`);
                
                let layoutConfig = {};
                try {
                    if (typeof template.layout_config === 'string') {
                        layoutConfig = JSON.parse(template.layout_config);
                    } else {
                        layoutConfig = template.layout_config || {};
                    }
                } catch (e) {
                    console.error('❌ Erreur parsing layout_config:', e);
                    return;
                }
                
                const margins = layoutConfig.page_margins;
                if (margins) {
                    console.log('📏 Marges configurées:');
                    console.log(`   🔝 Haut: ${margins.top}`);
                    console.log(`   ➡️ Droite: ${margins.right}`);
                    console.log(`   🔽 Bas: ${margins.bottom}`);
                    console.log(`   ⬅️ Gauche: ${margins.left}`);
                } else {
                    console.log('📏 Aucune marge personnalisée (utilise les valeurs par défaut)');
                }
            } else {
                console.log('❌ Aucun template sélectionné');
            }
        } else {
            console.error('❌ TemplateManager non disponible');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

// Exporter les fonctions
window.testInvoiceMarginsGeneration = testInvoiceMarginsGeneration;
window.testQuickInvoiceMargins = testQuickInvoiceMargins;
window.showCurrentTemplateMargins = showCurrentTemplateMargins;

console.log('🛠️ Fonctions de test disponibles:');
console.log('- testInvoiceMarginsGeneration() : Test complet des marges dans les factures');
console.log('- testQuickInvoiceMargins() : Test rapide des marges');
console.log('- showCurrentTemplateMargins() : Afficher les marges du template actuel');
console.log('\n💡 Commencez par: testInvoiceMarginsGeneration()');

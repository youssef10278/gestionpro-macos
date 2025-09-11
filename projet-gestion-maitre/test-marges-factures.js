// test-marges-factures.js - Test des contrôles de marges dans la personnalisation des factures

console.log('📏 === TEST CONTRÔLES DE MARGES FACTURES ===');

/**
 * Test complet des contrôles de marges
 */
async function testMarginControls() {
    try {
        console.log('\n1️⃣ VÉRIFICATION DE L\'ENVIRONNEMENT');
        
        // Vérifier qu'on est sur la page de personnalisation
        if (!window.location.href.includes('template-designer.html')) {
            console.error('❌ Ce test doit être exécuté sur la page de personnalisation des factures');
            return;
        }
        
        console.log('✅ Page de personnalisation détectée');
        
        console.log('\n2️⃣ VÉRIFICATION DES CONTRÔLES DE MARGES');
        
        // Vérifier que tous les contrôles de marges existent
        const marginControls = {
            marginTop: document.getElementById('marginTop'),
            marginTopValue: document.getElementById('marginTopValue'),
            marginRight: document.getElementById('marginRight'),
            marginRightValue: document.getElementById('marginRightValue'),
            marginBottom: document.getElementById('marginBottom'),
            marginBottomValue: document.getElementById('marginBottomValue'),
            marginLeft: document.getElementById('marginLeft'),
            marginLeftValue: document.getElementById('marginLeftValue'),
            resetBtn: document.getElementById('resetMarginsBtn')
        };
        
        console.log('📊 Contrôles trouvés:');
        Object.entries(marginControls).forEach(([name, element]) => {
            console.log(`   - ${name}: ${element ? '✅' : '❌'}`);
        });
        
        // Vérifier que tous les contrôles sont présents
        const missingControls = Object.entries(marginControls)
            .filter(([name, element]) => !element)
            .map(([name]) => name);
            
        if (missingControls.length > 0) {
            console.error('❌ Contrôles manquants:', missingControls);
            return;
        }
        
        console.log('✅ Tous les contrôles de marges sont présents');
        
        console.log('\n3️⃣ TEST DES VALEURS INITIALES');
        
        // Vérifier les valeurs initiales
        const initialValues = {
            top: marginControls.marginTop.value,
            topDisplay: marginControls.marginTopValue.textContent,
            right: marginControls.marginRight.value,
            rightDisplay: marginControls.marginRightValue.textContent,
            bottom: marginControls.marginBottom.value,
            bottomDisplay: marginControls.marginBottomValue.textContent,
            left: marginControls.marginLeft.value,
            leftDisplay: marginControls.marginLeftValue.textContent
        };
        
        console.log('📊 Valeurs initiales:');
        console.log(`   - Haut: ${initialValues.top} (affiché: ${initialValues.topDisplay})`);
        console.log(`   - Droite: ${initialValues.right} (affiché: ${initialValues.rightDisplay})`);
        console.log(`   - Bas: ${initialValues.bottom} (affiché: ${initialValues.bottomDisplay})`);
        console.log(`   - Gauche: ${initialValues.left} (affiché: ${initialValues.leftDisplay})`);
        
        console.log('\n4️⃣ TEST DE MODIFICATION DES MARGES');
        
        // Tester la modification de chaque marge
        const testValues = {
            marginTop: 30,
            marginRight: 25,
            marginBottom: 35,
            marginLeft: 15
        };
        
        for (const [controlName, testValue] of Object.entries(testValues)) {
            console.log(`🔧 Test ${controlName} = ${testValue}mm`);
            
            const slider = marginControls[controlName];
            const valueDisplay = marginControls[controlName + 'Value'];
            
            // Modifier la valeur
            slider.value = testValue;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Attendre un peu pour que l'affichage se mette à jour
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Vérifier que l'affichage s'est mis à jour
            const displayedValue = valueDisplay.textContent;
            const expectedDisplay = testValue + 'mm';
            
            console.log(`   - Valeur slider: ${slider.value}`);
            console.log(`   - Affichage: ${displayedValue}`);
            console.log(`   - Attendu: ${expectedDisplay}`);
            console.log(`   - Correct: ${displayedValue === expectedDisplay ? '✅' : '❌'}`);
        }
        
        console.log('\n5️⃣ TEST DE L\'APERÇU');
        
        // Vérifier que l'aperçu se met à jour
        const previewContainer = document.getElementById('invoicePreview');
        if (previewContainer) {
            console.log('✅ Conteneur d\'aperçu trouvé');
            
            // Vérifier les styles appliqués
            const computedStyle = window.getComputedStyle(previewContainer.querySelector('.preview-invoice') || previewContainer);
            const padding = computedStyle.padding;
            
            console.log('📊 Styles d\'aperçu:');
            console.log(`   - Padding: ${padding}`);
            
            // Vérifier que les marges sont appliquées dans le CSS
            const styleElements = document.querySelectorAll('style');
            let marginStyleFound = false;
            
            styleElements.forEach(style => {
                if (style.textContent.includes('preview-invoice') && style.textContent.includes('padding:')) {
                    marginStyleFound = true;
                    console.log('✅ Styles de marges trouvés dans le CSS');
                }
            });
            
            if (!marginStyleFound) {
                console.warn('⚠️ Styles de marges non trouvés dans le CSS');
            }
            
        } else {
            console.warn('⚠️ Conteneur d\'aperçu non trouvé');
        }
        
        console.log('\n6️⃣ TEST DU BOUTON DE RÉINITIALISATION');
        
        // Tester le bouton de réinitialisation
        console.log('🔄 Test du bouton de réinitialisation...');
        
        marginControls.resetBtn.click();
        
        // Attendre que la réinitialisation se fasse
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Vérifier que les valeurs sont revenues aux valeurs par défaut
        const resetValues = {
            top: marginControls.marginTop.value,
            right: marginControls.marginRight.value,
            bottom: marginControls.marginBottom.value,
            left: marginControls.marginLeft.value
        };
        
        console.log('📊 Valeurs après réinitialisation:');
        console.log(`   - Haut: ${resetValues.top}mm`);
        console.log(`   - Droite: ${resetValues.right}mm`);
        console.log(`   - Bas: ${resetValues.bottom}mm`);
        console.log(`   - Gauche: ${resetValues.left}mm`);
        
        // Vérifier que toutes les valeurs sont à 20 (valeur par défaut)
        const allReset = Object.values(resetValues).every(value => value == '20');
        console.log(`🎯 Réinitialisation: ${allReset ? '✅ Succès' : '❌ Échec'}`);
        
        console.log('\n7️⃣ TEST DE SAUVEGARDE');
        
        // Tester que les marges sont incluses dans les données du template
        if (typeof window.templateDesigner !== 'undefined' && window.templateDesigner.getTemplateDataFromForm) {
            console.log('🧪 Test de récupération des données...');
            
            // Modifier quelques valeurs
            marginControls.marginTop.value = 25;
            marginControls.marginRight.value = 30;
            marginControls.marginBottom.value = 25;
            marginControls.marginLeft.value = 30;
            
            // Récupérer les données
            const templateData = window.templateDesigner.getTemplateDataFromForm();
            
            console.log('📊 Données du template:');
            console.log('   - Layout config:', templateData.layout_config);
            console.log('   - Page margins:', templateData.layout_config?.page_margins);
            
            // Vérifier que les marges sont incluses
            const margins = templateData.layout_config?.page_margins;
            if (margins) {
                console.log('✅ Marges incluses dans les données:');
                console.log(`   - Haut: ${margins.top}`);
                console.log(`   - Droite: ${margins.right}`);
                console.log(`   - Bas: ${margins.bottom}`);
                console.log(`   - Gauche: ${margins.left}`);
            } else {
                console.error('❌ Marges non incluses dans les données');
            }
        } else {
            console.warn('⚠️ templateDesigner non disponible pour le test de sauvegarde');
        }
        
        console.log('\n🎯 RÉSULTAT FINAL');
        console.log('✅ Test des contrôles de marges terminé');
        console.log('📋 Vérifiez les résultats ci-dessus pour identifier les problèmes');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

/**
 * Test rapide des marges
 */
function testQuickMargins() {
    console.log('\n🚀 === TEST RAPIDE MARGES ===');
    
    const controls = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
    
    controls.forEach(controlName => {
        const element = document.getElementById(controlName);
        const valueElement = document.getElementById(controlName + 'Value');
        
        if (element && valueElement) {
            console.log(`✅ ${controlName}: ${element.value} (${valueElement.textContent})`);
        } else {
            console.log(`❌ ${controlName}: Contrôle manquant`);
        }
    });
    
    const resetBtn = document.getElementById('resetMarginsBtn');
    console.log(`🔄 Bouton reset: ${resetBtn ? '✅' : '❌'}`);
}

/**
 * Définir des marges personnalisées
 */
function setCustomMargins(top = 25, right = 20, bottom = 25, left = 20) {
    console.log('\n🎨 === DÉFINITION MARGES PERSONNALISÉES ===');
    console.log(`📏 Marges: ${top}mm ${right}mm ${bottom}mm ${left}mm`);
    
    const margins = {
        marginTop: top,
        marginRight: right,
        marginBottom: bottom,
        marginLeft: left
    };
    
    Object.entries(margins).forEach(([controlName, value]) => {
        const element = document.getElementById(controlName);
        if (element) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`✅ ${controlName} défini à ${value}mm`);
        } else {
            console.error(`❌ Contrôle ${controlName} non trouvé`);
        }
    });
    
    console.log('🎯 Marges personnalisées appliquées');
}

// Exporter les fonctions
window.testMarginControls = testMarginControls;
window.testQuickMargins = testQuickMargins;
window.setCustomMargins = setCustomMargins;

console.log('🛠️ Fonctions de test disponibles:');
console.log('- testMarginControls() : Test complet des contrôles de marges');
console.log('- testQuickMargins() : Test rapide des contrôles');
console.log('- setCustomMargins(top, right, bottom, left) : Définir des marges personnalisées');
console.log('\n💡 Commencez par: testMarginControls()');

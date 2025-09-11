// test-recherche-produits-factures.js - Test de la recherche de produits dans les factures

console.log('🔍 === TEST RECHERCHE PRODUITS FACTURES ===');

/**
 * Test complet de la fonctionnalité de recherche de produits
 */
async function testProductSearchInInvoices() {
    try {
        console.log('\n1️⃣ VÉRIFICATION DES MODULES ET DONNÉES');
        
        // Vérifier que nous sommes sur la page des factures
        if (!window.location.href.includes('invoices.html')) {
            console.error('❌ Ce test doit être exécuté sur la page des factures');
            return;
        }
        
        // Vérifier les variables globales
        console.log('- allProducts disponible:', !!window.allProducts);
        console.log('- Nombre de produits:', window.allProducts?.length || 0);
        
        if (!window.allProducts || window.allProducts.length === 0) {
            console.warn('⚠️ Aucun produit chargé, tentative de rechargement...');
            if (typeof loadProducts === 'function') {
                await loadProducts();
                console.log('✅ Produits rechargés:', window.allProducts?.length || 0);
            } else {
                console.error('❌ Fonction loadProducts non disponible');
                return;
            }
        }
        
        console.log('\n2️⃣ VÉRIFICATION DE L\'INTERFACE');
        
        // Vérifier qu'il y a une facture en cours d'édition
        const descriptionInputs = document.querySelectorAll('.description-input');
        console.log('- Champs de description trouvés:', descriptionInputs.length);
        
        if (descriptionInputs.length === 0) {
            console.warn('⚠️ Aucun champ de description trouvé');
            console.log('💡 Créez une nouvelle facture ou modifiez une facture existante');
            return;
        }
        
        // Vérifier les conteneurs de résultats
        const searchContainers = document.querySelectorAll('.search-results-container');
        console.log('- Conteneurs de résultats trouvés:', searchContainers.length);
        
        console.log('\n3️⃣ TEST DE RECHERCHE AUTOMATIQUE');
        
        // Tester avec le premier champ de description
        const firstInput = descriptionInputs[0];
        const firstContainer = firstInput.parentElement.querySelector('.search-results-container');
        
        if (!firstContainer) {
            console.error('❌ Conteneur de résultats non trouvé pour le premier champ');
            return;
        }
        
        // Test avec différents termes de recherche
        const testQueries = ['ord', 'sou', 'cla', 'pro'];
        
        for (const query of testQueries) {
            console.log(`🔍 Test avec "${query}":`);
            
            // Simuler la saisie
            firstInput.value = query;
            firstInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Attendre un peu pour que la recherche se fasse
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Vérifier les résultats
            const isVisible = !firstContainer.classList.contains('hidden');
            const resultItems = firstContainer.querySelectorAll('.search-result-item');
            
            console.log(`   - Résultats visibles: ${isVisible ? '✅' : '❌'}`);
            console.log(`   - Nombre de résultats: ${resultItems.length}`);
            
            if (resultItems.length > 0) {
                const firstResult = resultItems[0];
                const productName = firstResult.dataset.productName;
                const productPrice = firstResult.dataset.productPrice;
                console.log(`   - Premier résultat: ${productName} (${productPrice} MAD)`);
            }
        }
        
        console.log('\n4️⃣ TEST DE SÉLECTION DE PRODUIT');
        
        // Tester la sélection d'un produit
        firstInput.value = 'ord';
        firstInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const resultItems = firstContainer.querySelectorAll('.search-result-item');
        if (resultItems.length > 0) {
            const firstResult = resultItems[0];
            const productName = firstResult.dataset.productName;
            const productPrice = firstResult.dataset.productPrice;
            
            console.log(`🎯 Test de sélection: ${productName}`);
            
            // Simuler le clic
            firstResult.click();
            
            // Vérifier que le champ a été rempli
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log(`   - Champ rempli: ${firstInput.value === productName ? '✅' : '❌'}`);
            console.log(`   - Valeur: "${firstInput.value}"`);
            
            // Vérifier que le prix a été rempli
            const row = firstInput.closest('.invoice-item-row');
            if (row) {
                const priceInput = row.querySelector('[name="item_price"]');
                if (priceInput) {
                    console.log(`   - Prix rempli: ${priceInput.value === productPrice ? '✅' : '❌'}`);
                    console.log(`   - Prix: ${priceInput.value} MAD`);
                } else {
                    console.warn('   - ⚠️ Champ prix non trouvé');
                }
            }
            
            // Vérifier que les résultats sont cachés
            const isHidden = firstContainer.classList.contains('hidden');
            console.log(`   - Résultats cachés: ${isHidden ? '✅' : '❌'}`);
        } else {
            console.warn('⚠️ Aucun résultat pour tester la sélection');
        }
        
        console.log('\n5️⃣ TEST DE CALCUL AUTOMATIQUE');
        
        // Tester que les totaux se recalculent
        const row = firstInput.closest('.invoice-item-row');
        if (row) {
            const qtyInput = row.querySelector('[name="quantity"]');
            const priceInput = row.querySelector('[name="item_price"]');
            const totalElement = row.querySelector('.line-total');
            
            if (qtyInput && priceInput && totalElement) {
                // Définir des valeurs de test
                qtyInput.value = '3';
                priceInput.value = '25.50';
                
                // Déclencher le recalcul
                qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                const expectedTotal = (3 * 25.50).toFixed(2);
                const actualTotal = totalElement.textContent;
                
                console.log(`🧮 Test de calcul:`);
                console.log(`   - Quantité: ${qtyInput.value}`);
                console.log(`   - Prix: ${priceInput.value} MAD`);
                console.log(`   - Total attendu: ${expectedTotal} MAD`);
                console.log(`   - Total calculé: ${actualTotal} MAD`);
                console.log(`   - Calcul correct: ${actualTotal === expectedTotal ? '✅' : '❌'}`);
            } else {
                console.warn('⚠️ Éléments de calcul non trouvés');
            }
        }
        
        console.log('\n6️⃣ TEST DE FERMETURE DES RÉSULTATS');
        
        // Tester que les résultats se ferment quand on clique ailleurs
        firstInput.value = 'test';
        firstInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Cliquer ailleurs
        document.body.click();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const allContainers = document.querySelectorAll('.search-results-container');
        const allHidden = Array.from(allContainers).every(container => 
            container.classList.contains('hidden')
        );
        
        console.log(`🖱️ Test de fermeture:`);
        console.log(`   - Tous les résultats cachés: ${allHidden ? '✅' : '❌'}`);
        
        console.log('\n🎯 RÉSULTAT FINAL');
        console.log('✅ TOUS LES TESTS TERMINÉS');
        console.log('📋 Vérifiez les résultats ci-dessus pour identifier les problèmes');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

/**
 * Test rapide de la recherche
 */
async function testQuickSearch() {
    console.log('\n🚀 === TEST RAPIDE ===');
    
    try {
        const input = document.querySelector('.description-input');
        if (!input) {
            console.error('❌ Aucun champ de description trouvé');
            return;
        }
        
        console.log('🔍 Test avec "ordinateur"...');
        input.value = 'ordinateur';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const container = input.parentElement.querySelector('.search-results-container');
        if (container) {
            const isVisible = !container.classList.contains('hidden');
            const results = container.querySelectorAll('.search-result-item');
            
            console.log(`✅ Résultats: ${isVisible ? 'Visibles' : 'Cachés'}`);
            console.log(`📊 Nombre: ${results.length}`);
            
            if (results.length > 0) {
                console.log('🎯 Premier résultat:', results[0].dataset.productName);
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur test rapide:', error);
    }
}

/**
 * Afficher les produits disponibles
 */
function showAvailableProducts() {
    console.log('\n📦 === PRODUITS DISPONIBLES ===');
    
    if (!window.allProducts || window.allProducts.length === 0) {
        console.log('❌ Aucun produit chargé');
        return;
    }
    
    console.log(`📊 Total: ${window.allProducts.length} produits`);
    
    // Afficher les 10 premiers
    window.allProducts.slice(0, 10).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   - Prix: ${product.price_retail || 0} MAD`);
        console.log(`   - Stock: ${product.stock || 'N/A'}`);
        console.log(`   - Référence: ${product.reference || 'N/A'}`);
    });
    
    if (window.allProducts.length > 10) {
        console.log(`... et ${window.allProducts.length - 10} autres produits`);
    }
}

// Exporter les fonctions de test
window.testProductSearchInInvoices = testProductSearchInInvoices;
window.testQuickSearch = testQuickSearch;
window.showAvailableProducts = showAvailableProducts;

console.log('🛠️ Fonctions de test disponibles:');
console.log('- testProductSearchInInvoices() : Test complet de la recherche');
console.log('- testQuickSearch() : Test rapide');
console.log('- showAvailableProducts() : Afficher les produits disponibles');
console.log('\n💡 Commencez par: testProductSearchInInvoices()');

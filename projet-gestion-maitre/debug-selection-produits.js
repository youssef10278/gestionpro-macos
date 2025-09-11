// debug-selection-produits.js - Debug spécifique pour la sélection de produits

console.log('🐛 === DEBUG SÉLECTION PRODUITS ===');

/**
 * Test spécifique de la sélection de produits
 */
async function debugProductSelection() {
    try {
        console.log('\n1️⃣ VÉRIFICATION DE L\'ENVIRONNEMENT');
        
        // Vérifier qu'on est sur la page factures
        if (!window.location.href.includes('invoices.html')) {
            console.error('❌ Ce test doit être exécuté sur la page des factures');
            return;
        }
        
        // Vérifier qu'il y a une facture en cours d'édition
        const descriptionInputs = document.querySelectorAll('.description-input');
        if (descriptionInputs.length === 0) {
            console.error('❌ Aucun champ de description trouvé. Créez une nouvelle facture d\'abord.');
            return;
        }
        
        console.log('✅ Environnement OK');
        console.log('📝 Champs de description trouvés:', descriptionInputs.length);
        
        console.log('\n2️⃣ TEST DE RECHERCHE');
        
        const firstInput = descriptionInputs[0];
        const container = firstInput.parentElement.querySelector('.search-results-container');
        
        if (!container) {
            console.error('❌ Conteneur de résultats non trouvé');
            return;
        }
        
        // Effectuer une recherche
        console.log('🔍 Recherche avec "ord"...');
        firstInput.value = 'ord';
        firstInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Attendre que les résultats apparaissent
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const isVisible = !container.classList.contains('hidden');
        const resultItems = container.querySelectorAll('.search-result-item');
        
        console.log('📊 Résultats visibles:', isVisible);
        console.log('📊 Nombre de résultats:', resultItems.length);
        
        if (resultItems.length === 0) {
            console.error('❌ Aucun résultat trouvé. Vérifiez que des produits sont chargés.');
            return;
        }
        
        console.log('\n3️⃣ ANALYSE DES RÉSULTATS');
        
        resultItems.forEach((item, index) => {
            console.log(`📦 Résultat ${index + 1}:`);
            console.log(`   - Nom: ${item.dataset.productName}`);
            console.log(`   - Prix: ${item.dataset.productPrice}`);
            console.log(`   - Unité: ${item.dataset.productUnit}`);
            console.log(`   - Classes CSS: ${item.className}`);
            console.log(`   - Événements attachés:`, getEventListeners ? getEventListeners(item) : 'Non disponible');
        });
        
        console.log('\n4️⃣ TEST DE SÉLECTION MANUELLE');
        
        const firstResult = resultItems[0];
        const productName = firstResult.dataset.productName;
        
        console.log(`🎯 Test de sélection manuelle: ${productName}`);
        
        // Tester la fonction selectProduct directement
        if (typeof selectProduct === 'function') {
            console.log('✅ Fonction selectProduct disponible');
            
            // Appeler directement la fonction
            selectProduct(firstResult, firstInput);
            
            // Vérifier le résultat
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log('📝 Valeur du champ après sélection:', firstInput.value);
            
            // Vérifier le prix
            const row = firstInput.closest('.invoice-item-row');
            if (row) {
                const priceInput = row.querySelector('[name="unit_price"]');
                console.log('💰 Prix après sélection:', priceInput?.value);
            }
            
        } else {
            console.error('❌ Fonction selectProduct non disponible');
        }
        
        console.log('\n5️⃣ TEST DE CLIC SIMULÉ');
        
        // Remettre la recherche
        firstInput.value = 'ord';
        firstInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const newResultItems = container.querySelectorAll('.search-result-item');
        if (newResultItems.length > 0) {
            const testItem = newResultItems[0];
            
            console.log('🖱️ Simulation de clic...');
            
            // Essayer différents types d'événements
            const events = ['click', 'mousedown', 'mouseup'];
            
            for (const eventType of events) {
                console.log(`   - Test ${eventType}...`);
                
                const event = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                
                testItem.dispatchEvent(event);
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                console.log(`   - Valeur après ${eventType}:`, firstInput.value);
            }
        }
        
        console.log('\n6️⃣ VÉRIFICATION DES ÉVÉNEMENTS');
        
        // Vérifier que les événements sont bien attachés
        const testContainer = firstInput.parentElement.querySelector('.search-results-container');
        const testItems = testContainer.querySelectorAll('.search-result-item');
        
        console.log('🔗 Vérification des événements attachés:');
        testItems.forEach((item, index) => {
            console.log(`   Item ${index + 1}:`);
            console.log(`   - onclick:`, item.onclick);
            console.log(`   - addEventListener:`, item._listeners || 'Non visible');
            
            // Tester l'ajout manuel d'événement
            item.style.backgroundColor = '#ffeb3b'; // Jaune pour identifier
            item.addEventListener('click', function testClick() {
                console.log('🎉 CLIC MANUEL DÉTECTÉ sur:', this.dataset.productName);
                firstInput.value = this.dataset.productName;
                testContainer.classList.add('hidden');
            });
        });
        
        console.log('\n7️⃣ INSTRUCTIONS POUR TEST MANUEL');
        console.log('🖱️ Les éléments avec fond jaune ont maintenant des événements de test');
        console.log('👆 Essayez de cliquer sur un élément jaune dans les suggestions');
        console.log('📝 Le champ devrait se remplir avec le nom du produit');
        
        console.log('\n🎯 RÉSULTAT DU DEBUG');
        console.log('✅ Debug terminé - Vérifiez les logs ci-dessus');
        console.log('💡 Si les éléments jaunes fonctionnent, le problème est dans l\'attachement initial des événements');
        
    } catch (error) {
        console.error('❌ Erreur lors du debug:', error);
    }
}

/**
 * Forcer le rechargement des événements
 */
function forceReloadEvents() {
    console.log('\n🔄 === RECHARGEMENT FORCÉ DES ÉVÉNEMENTS ===');
    
    try {
        // Réattacher les événements sur tous les conteneurs existants
        const containers = document.querySelectorAll('.search-results-container');
        
        containers.forEach((container, containerIndex) => {
            console.log(`🔗 Rechargement conteneur ${containerIndex + 1}`);
            
            const items = container.querySelectorAll('.search-result-item');
            items.forEach((item, itemIndex) => {
                console.log(`   - Item ${itemIndex + 1}: ${item.dataset.productName}`);
                
                // Supprimer les anciens événements (si possible)
                const newItem = item.cloneNode(true);
                item.parentNode.replaceChild(newItem, item);
                
                // Ajouter les nouveaux événements
                newItem.addEventListener('click', function(e) {
                    console.log('🎯 NOUVEAU CLIC sur:', this.dataset.productName);
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Trouver l'input associé
                    const input = this.closest('.invoice-item-row')?.querySelector('.description-input');
                    if (input) {
                        selectProduct(this, input);
                    } else {
                        console.error('❌ Input non trouvé');
                    }
                });
                
                // Style pour identifier les éléments rechargés
                newItem.style.borderLeft = '4px solid #4caf50';
            });
        });
        
        console.log('✅ Événements rechargés');
        console.log('💡 Les éléments avec bordure verte ont des événements frais');
        
    } catch (error) {
        console.error('❌ Erreur lors du rechargement:', error);
    }
}

/**
 * Test simple de sélection
 */
function testSimpleSelection() {
    console.log('\n🚀 === TEST SIMPLE ===');
    
    const input = document.querySelector('.description-input');
    if (!input) {
        console.error('❌ Aucun champ trouvé');
        return;
    }
    
    // Créer un faux item de test
    const fakeItem = {
        dataset: {
            productName: 'Produit Test',
            productPrice: '99.99',
            productUnit: 'retail'
        }
    };
    
    console.log('🧪 Test avec produit fictif...');
    selectProduct(fakeItem, input);
    
    console.log('📝 Résultat:', input.value);
}

// Exporter les fonctions
window.debugProductSelection = debugProductSelection;
window.forceReloadEvents = forceReloadEvents;
window.testSimpleSelection = testSimpleSelection;

console.log('🛠️ Fonctions de debug disponibles:');
console.log('- debugProductSelection() : Debug complet de la sélection');
console.log('- forceReloadEvents() : Recharger les événements de clic');
console.log('- testSimpleSelection() : Test simple avec produit fictif');
console.log('\n💡 Commencez par: debugProductSelection()');

// test-ajouter-ligne-facture.js - Test du bouton "Ajouter une ligne"

console.log('➕ === TEST BOUTON AJOUTER UNE LIGNE ===');

/**
 * Test complet du bouton "Ajouter une ligne"
 */
async function testAddLineButton() {
    try {
        console.log('\n1️⃣ VÉRIFICATION DE L\'ENVIRONNEMENT');
        
        // Vérifier qu'on est sur la page factures
        if (!window.location.href.includes('invoices.html')) {
            console.error('❌ Ce test doit être exécuté sur la page des factures');
            return;
        }
        
        // Vérifier qu'on est en mode édition
        const editorView = document.getElementById('editorView');
        if (!editorView || editorView.classList.contains('hidden')) {
            console.error('❌ Aucune facture en cours d\'édition. Créez une nouvelle facture d\'abord.');
            return;
        }
        
        console.log('✅ Environnement OK - Facture en cours d\'édition');
        
        console.log('\n2️⃣ VÉRIFICATION DU BOUTON');
        
        const addBtn = document.getElementById('addItemBtn');
        if (!addBtn) {
            console.error('❌ Bouton "Ajouter une ligne" non trouvé');
            return;
        }
        
        console.log('✅ Bouton trouvé:', addBtn.textContent.trim());
        console.log('📊 Classes CSS:', addBtn.className);
        console.log('🔗 Événements attachés:', addBtn.onclick ? 'onclick présent' : 'Pas d\'onclick');
        
        // Vérifier les événements avec getEventListeners si disponible
        if (typeof getEventListeners === 'function') {
            const listeners = getEventListeners(addBtn);
            console.log('🎧 Event listeners:', listeners);
        }
        
        console.log('\n3️⃣ ÉTAT INITIAL DU TABLEAU');
        
        const tbody = document.getElementById('invoiceItemsTable');
        if (!tbody) {
            console.error('❌ Tableau des articles non trouvé');
            return;
        }
        
        const initialRows = tbody.querySelectorAll('.invoice-item-row');
        console.log('📊 Nombre de lignes initial:', initialRows.length);
        
        initialRows.forEach((row, index) => {
            const desc = row.querySelector('.description-input')?.value || '(vide)';
            console.log(`   Ligne ${index + 1}: ${desc}`);
        });
        
        console.log('\n4️⃣ TEST DE CLIC SUR LE BOUTON');
        
        console.log('🖱️ Simulation du clic...');
        
        // Simuler le clic
        addBtn.click();
        
        // Attendre un peu pour que l'ajout se fasse
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('\n5️⃣ VÉRIFICATION APRÈS CLIC');
        
        const newRows = tbody.querySelectorAll('.invoice-item-row');
        console.log('📊 Nombre de lignes après clic:', newRows.length);
        
        if (newRows.length > initialRows.length) {
            console.log('✅ SUCCÈS - Nouvelle ligne ajoutée !');
            
            // Analyser la nouvelle ligne
            const lastRow = newRows[newRows.length - 1];
            const descInput = lastRow.querySelector('.description-input');
            const qtyInput = lastRow.querySelector('[name="quantity"]');
            const priceInput = lastRow.querySelector('[name="unit_price"]');
            
            console.log('📝 Nouvelle ligne:');
            console.log(`   - Description: "${descInput?.value || '(vide)'}"`);
            console.log(`   - Quantité: ${qtyInput?.value || 'N/A'}`);
            console.log(`   - Prix: ${priceInput?.value || 'N/A'}`);
            console.log(`   - Focus sur description: ${document.activeElement === descInput ? '✅' : '❌'}`);
            
            // Tester les événements sur la nouvelle ligne
            console.log('\n6️⃣ TEST DES ÉVÉNEMENTS SUR LA NOUVELLE LIGNE');
            
            if (qtyInput && priceInput) {
                console.log('🧪 Test de calcul automatique...');
                
                // Modifier la quantité
                qtyInput.value = '3';
                qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Modifier le prix
                priceInput.value = '25.50';
                priceInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Vérifier le total de ligne
                const lineTotalElement = lastRow.querySelector('.line-total');
                const expectedTotal = (3 * 25.50).toFixed(2);
                const actualTotal = lineTotalElement?.textContent || '0';
                
                console.log(`   - Total attendu: ${expectedTotal}`);
                console.log(`   - Total calculé: ${actualTotal}`);
                console.log(`   - Calcul correct: ${actualTotal === expectedTotal ? '✅' : '❌'}`);
            }
            
            // Tester le bouton supprimer
            const removeBtn = lastRow.querySelector('.remove-item-btn');
            if (removeBtn) {
                console.log('🗑️ Bouton supprimer trouvé sur la nouvelle ligne');
            } else {
                console.log('⚠️ Bouton supprimer non trouvé');
            }
            
        } else {
            console.error('❌ ÉCHEC - Aucune nouvelle ligne ajoutée');
            
            // Diagnostics supplémentaires
            console.log('\n🔍 DIAGNOSTICS:');
            console.log('- Fonction addNewInvoiceLine disponible:', typeof addNewInvoiceLine === 'function');
            console.log('- Fonction attachRowEvents disponible:', typeof attachRowEvents === 'function');
            console.log('- Fonction createRowHTML disponible:', typeof createRowHTML === 'function');
            
            // Vérifier les erreurs dans la console
            console.log('💡 Vérifiez la console pour d\'éventuelles erreurs JavaScript');
        }
        
        console.log('\n7️⃣ TEST MULTIPLE');
        
        console.log('🔄 Test d\'ajout de plusieurs lignes...');
        
        for (let i = 0; i < 3; i++) {
            addBtn.click();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const finalRows = tbody.querySelectorAll('.invoice-item-row');
        console.log(`📊 Nombre final de lignes: ${finalRows.length}`);
        console.log(`✅ ${finalRows.length - newRows.length} lignes supplémentaires ajoutées`);
        
        console.log('\n🎯 RÉSULTAT FINAL');
        console.log('✅ Test terminé - Vérifiez les résultats ci-dessus');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

/**
 * Test rapide du bouton
 */
function testQuickAdd() {
    console.log('\n🚀 === TEST RAPIDE ===');
    
    const addBtn = document.getElementById('addItemBtn');
    if (!addBtn) {
        console.error('❌ Bouton non trouvé');
        return;
    }
    
    const tbody = document.getElementById('invoiceItemsTable');
    if (!tbody) {
        console.error('❌ Tableau non trouvé');
        return;
    }
    
    const beforeCount = tbody.querySelectorAll('.invoice-item-row').length;
    console.log(`📊 Lignes avant: ${beforeCount}`);
    
    addBtn.click();
    
    setTimeout(() => {
        const afterCount = tbody.querySelectorAll('.invoice-item-row').length;
        console.log(`📊 Lignes après: ${afterCount}`);
        console.log(`${afterCount > beforeCount ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    }, 200);
}

/**
 * Forcer l'ajout d'une ligne manuellement
 */
function forceAddLine() {
    console.log('\n🔧 === AJOUT MANUEL FORCÉ ===');
    
    try {
        if (typeof addNewInvoiceLine === 'function') {
            console.log('🎯 Appel direct de addNewInvoiceLine()...');
            addNewInvoiceLine();
        } else {
            console.error('❌ Fonction addNewInvoiceLine non disponible');
            
            // Essayer d'ajouter manuellement
            console.log('🛠️ Tentative d\'ajout manuel...');
            
            const tbody = document.getElementById('invoiceItemsTable');
            if (!tbody) {
                console.error('❌ Tableau non trouvé');
                return;
            }
            
            const currentRows = tbody.querySelectorAll('.invoice-item-row');
            const newIndex = currentRows.length;
            
            // Créer une ligne simple
            const newRow = document.createElement('tr');
            newRow.className = 'invoice-item-row';
            newRow.innerHTML = `
                <td class="p-4 text-center font-medium text-gray-900 dark:text-white">${newIndex + 1}</td>
                <td class="p-4">
                    <div class="relative">
                        <input type="text" class="description-input w-full p-2 border border-gray-300 rounded-lg" 
                               placeholder="Rechercher ou saisir un produit/service..." value="">
                        <div class="search-results-container hidden"></div>
                    </div>
                </td>
                <td class="p-4">
                    <input type="number" name="quantity" value="1" min="1" 
                           class="w-20 p-2 border border-gray-300 rounded-lg text-center">
                </td>
                <td class="p-4 text-center">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        🏪 Pièce
                    </span>
                </td>
                <td class="p-4">
                    <input type="number" name="unit_price" value="0" min="0" step="0.01" 
                           class="w-full p-2 border border-gray-300 rounded-lg text-right">
                </td>
                <td class="p-4">
                    <span class="line-total font-bold text-lg">0.00</span>
                    <span class="text-gray-500 text-sm ml-1">DH</span>
                </td>
                <td class="p-4 text-center">
                    <button type="button" class="remove-item-btn bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-8 h-8">×</button>
                </td>
            `;
            
            tbody.appendChild(newRow);
            
            // Focus sur le champ description
            const descInput = newRow.querySelector('.description-input');
            if (descInput) {
                descInput.focus();
            }
            
            console.log('✅ Ligne ajoutée manuellement');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout manuel:', error);
    }
}

// Exporter les fonctions
window.testAddLineButton = testAddLineButton;
window.testQuickAdd = testQuickAdd;
window.forceAddLine = forceAddLine;

console.log('🛠️ Fonctions de test disponibles:');
console.log('- testAddLineButton() : Test complet du bouton');
console.log('- testQuickAdd() : Test rapide');
console.log('- forceAddLine() : Forcer l\'ajout d\'une ligne');
console.log('\n💡 Commencez par: testAddLineButton()');

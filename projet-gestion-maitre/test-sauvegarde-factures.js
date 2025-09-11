// test-sauvegarde-factures.js - Test de la fonction de sauvegarde des factures

console.log('🧪 === TEST SAUVEGARDE FACTURES ===');

/**
 * Test de la fonction de sauvegarde des factures
 */
function testInvoiceSave() {
    console.log('\n🔍 === DIAGNOSTIC SAUVEGARDE FACTURES ===');
    
    if (!window.location.href.includes('invoices.html')) {
        console.error('❌ Ce test doit être exécuté sur la page des factures');
        return;
    }
    
    console.log('1️⃣ VÉRIFICATION DE L\'ENVIRONNEMENT');
    
    // Vérifier que nous sommes dans l'éditeur de facture
    const editorView = document.getElementById('editorView');
    const invoiceEditor = document.getElementById('invoice-editor');
    const saveBtn = document.getElementById('saveInvoiceBtn');
    
    if (!editorView || editorView.classList.contains('hidden')) {
        console.log('⚠️ L\'éditeur de facture n\'est pas ouvert');
        console.log('💡 Cliquez sur "Nouvelle Facture" pour ouvrir l\'éditeur');
        return;
    }
    
    console.log('✅ Éditeur de facture ouvert');
    
    console.log('\n2️⃣ VÉRIFICATION DES ÉLÉMENTS DU FORMULAIRE');
    
    const formElements = {
        client_name: document.querySelector('input[name="client_name"]'),
        client_address: document.querySelector('textarea[name="client_address"]'),
        client_phone: document.querySelector('input[name="client_phone"]'),
        client_ice: document.querySelector('input[name="client_ice"]'),
        invoice_number: document.querySelector('input[name="invoice_number"]'),
        invoice_date: document.querySelector('input[name="invoice_date"]'),
        payment_terms: document.querySelector('input[name="payment_terms"]')
    };
    
    console.log('📋 Éléments du formulaire:');
    Object.keys(formElements).forEach(key => {
        const element = formElements[key];
        if (element) {
            console.log(`   ✅ ${key}: ${element.tagName} - Valeur: "${element.value}"`);
        } else {
            console.log(`   ❌ ${key}: MANQUANT`);
        }
    });
    
    console.log('\n3️⃣ VÉRIFICATION DES TOTAUX ET TVA');

    const totalElements = {
        'subtotal-ht': document.getElementById('subtotal-ht'),
        'tva-amount': document.getElementById('tva-amount'),
        'total-ttc': document.getElementById('total-ttc')
    };

    console.log('💰 Éléments de totaux:');
    Object.keys(totalElements).forEach(key => {
        const element = totalElements[key];
        if (element) {
            console.log(`   ✅ ${key}: "${element.textContent}"`);
        } else {
            console.log(`   ❌ ${key}: MANQUANT`);
        }
    });

    // Vérifier les éléments de TVA
    const tvaRateSelect = document.getElementById('tva-rate');
    const customTvaInput = document.getElementById('custom-tva-rate');
    const customTvaContainer = document.getElementById('custom-tva-container');

    console.log('📊 Éléments de TVA:');
    console.log(`   ${tvaRateSelect ? '✅' : '❌'} tva-rate select: ${tvaRateSelect ? `valeur="${tvaRateSelect.value}"` : 'MANQUANT'}`);
    console.log(`   ${customTvaInput ? '✅' : '❌'} custom-tva-rate input: ${customTvaInput ? `valeur="${customTvaInput.value}"` : 'MANQUANT'}`);
    console.log(`   ${customTvaContainer ? '✅' : '❌'} custom-tva-container: ${customTvaContainer ? (customTvaContainer.classList.contains('hidden') ? 'CACHÉ' : 'VISIBLE') : 'MANQUANT'}`);

    // Calculer le taux de TVA effectif
    let effectiveTvaRate = 20;
    if (tvaRateSelect) {
        if (tvaRateSelect.value === 'custom') {
            effectiveTvaRate = parseFloat(customTvaInput?.value) || 0;
        } else {
            effectiveTvaRate = parseFloat(tvaRateSelect.value) || 20;
        }
    }
    console.log(`📈 Taux de TVA effectif: ${effectiveTvaRate}%`);
    
    console.log('\n4️⃣ VÉRIFICATION DES ARTICLES');

    const itemRows = document.querySelectorAll('.invoice-item-row');
    console.log(`📦 Nombre de lignes d'articles: ${itemRows.length}`);

    let validRows = 0;
    let invalidRows = 0;

    itemRows.forEach((row, index) => {
        const description = row.querySelector('[name="item_description"]');
        const quantity = row.querySelector('[name="item_quantity"]');
        const unit = row.querySelector('[name="item_unit"]');
        const price = row.querySelector('[name="item_price"]');

        const isValid = description && quantity && unit && price;

        console.log(`   Ligne ${index + 1}: ${isValid ? '✅ VALIDE' : '❌ INVALIDE'}`);
        console.log(`     - Description: ${description ? `"${description.value}"` : '❌ MANQUANT'}`);
        console.log(`     - Quantité: ${quantity ? quantity.value : '❌ MANQUANT'}`);
        console.log(`     - Unité: ${unit ? unit.value : '❌ MANQUANT'}`);
        console.log(`     - Prix: ${price ? price.value : '❌ MANQUANT'}`);

        if (isValid) {
            validRows++;
        } else {
            invalidRows++;
            console.log(`     ⚠️ Cette ligne causera une erreur lors de la sauvegarde`);
        }
    });

    console.log(`\n📊 Résumé des articles:`);
    console.log(`   - Lignes valides: ${validRows}`);
    console.log(`   - Lignes invalides: ${invalidRows}`);

    if (invalidRows > 0) {
        console.log(`\n⚠️ ATTENTION: ${invalidRows} ligne(s) invalide(s) détectée(s)`);
        console.log(`💡 Ces lignes peuvent causer des erreurs lors de la sauvegarde`);
    }
    
    console.log('\n5️⃣ VÉRIFICATION DU BOUTON DE SAUVEGARDE');
    
    if (saveBtn) {
        console.log('✅ Bouton de sauvegarde trouvé');
        console.log(`   - Texte: "${saveBtn.textContent}"`);
        console.log(`   - Classes: ${saveBtn.className}`);
        console.log(`   - Visible: ${!saveBtn.classList.contains('hidden')}`);
        console.log(`   - Désactivé: ${saveBtn.disabled}`);
    } else {
        console.log('❌ Bouton de sauvegarde non trouvé');
    }
    
    console.log('\n6️⃣ TEST DE RÉCUPÉRATION DES DONNÉES');
    
    try {
        // Récupérer le taux de TVA comme dans saveInvoice()
        const tvaRateSelect = document.getElementById('tva-rate');
        const customTvaInput = document.getElementById('custom-tva-rate');

        let tvaRate = 20;
        if (tvaRateSelect) {
            if (tvaRateSelect.value === 'custom') {
                tvaRate = parseFloat(customTvaInput?.value) || 0;
            } else {
                tvaRate = parseFloat(tvaRateSelect.value) || 20;
            }
        }

        // Simuler la récupération des données comme dans saveInvoice()
        const testInvoiceData = {
            client_name: document.querySelector('input[name="client_name"]')?.value || '',
            client_address: document.querySelector('textarea[name="client_address"]')?.value || '',
            client_phone: document.querySelector('input[name="client_phone"]')?.value || '',
            client_ice: document.querySelector('input[name="client_ice"]')?.value || '',
            invoice_number: document.querySelector('input[name="invoice_number"]')?.value || '',
            invoice_date: document.querySelector('input[name="invoice_date"]')?.value || '',
            payment_terms: document.querySelector('input[name="payment_terms"]')?.value || '',
            tva_rate: tvaRate
        };
        
        console.log('📊 Données récupérées:');
        Object.keys(testInvoiceData).forEach(key => {
            console.log(`   - ${key}: "${testInvoiceData[key]}"`);
        });
        
        // Test de récupération des totaux
        const subtotalElement = document.getElementById('subtotal-ht');
        const tvaElement = document.getElementById('tva-amount');
        const totalElement = document.getElementById('total-ttc');
        
        if (subtotalElement && tvaElement && totalElement) {
            const subtotal = parseFloat(subtotalElement.textContent.replace(' MAD', ''));
            const tva = parseFloat(tvaElement.textContent.replace(' MAD', ''));
            const total = parseFloat(totalElement.textContent.replace(' MAD', ''));
            
            console.log('💰 Totaux parsés:');
            console.log(`   - Sous-total HT: ${subtotal}`);
            console.log(`   - TVA: ${tva}`);
            console.log(`   - Total TTC: ${total}`);
            
            if (!isNaN(subtotal) && !isNaN(tva) && !isNaN(total)) {
                console.log('✅ Tous les totaux sont des nombres valides');
            } else {
                console.log('⚠️ Certains totaux ne sont pas des nombres valides');
            }
        }
        
        console.log('\n✅ RÉCUPÉRATION DES DONNÉES RÉUSSIE');
        
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des données:', error);
    }
}

/**
 * Diagnostic spécifique des lignes d'articles
 */
function diagnoseInvoiceItems() {
    console.log('\n🔍 === DIAGNOSTIC DÉTAILLÉ DES ARTICLES ===');

    if (!window.location.href.includes('invoices.html')) {
        console.error('❌ Ce test doit être exécuté sur la page des factures');
        return;
    }

    const editorView = document.getElementById('editorView');
    if (!editorView || editorView.classList.contains('hidden')) {
        console.log('⚠️ L\'éditeur de facture n\'est pas ouvert');
        return;
    }

    console.log('1️⃣ RECHERCHE DES CONTENEURS D\'ARTICLES');

    // Chercher différents sélecteurs possibles
    const possibleSelectors = [
        '.invoice-item-row',
        '.invoice-item',
        '.item-row',
        'tr[data-item]',
        '[data-invoice-item]'
    ];

    possibleSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`   - "${selector}": ${elements.length} éléments trouvés`);
    });

    console.log('\n2️⃣ ANALYSE DES LIGNES EXISTANTES');

    const itemRows = document.querySelectorAll('.invoice-item-row');
    if (itemRows.length === 0) {
        console.log('❌ Aucune ligne d\'article trouvée avec le sélecteur ".invoice-item-row"');
        console.log('🔍 Recherche d\'autres structures possibles...');

        // Chercher dans le tableau
        const tableRows = document.querySelectorAll('tbody tr');
        console.log(`📋 Lignes de tableau trouvées: ${tableRows.length}`);

        tableRows.forEach((row, index) => {
            console.log(`   Ligne ${index + 1}:`);
            console.log(`     - Classes: "${row.className}"`);
            console.log(`     - Contenu: "${row.textContent.substring(0, 50)}..."`);

            const inputs = row.querySelectorAll('input, select, textarea');
            console.log(`     - Champs de saisie: ${inputs.length}`);
            inputs.forEach(input => {
                console.log(`       * ${input.tagName} name="${input.name}" value="${input.value}"`);
            });
        });

        return;
    }

    console.log(`✅ ${itemRows.length} ligne(s) d'article trouvée(s)`);

    console.log('\n3️⃣ ANALYSE DÉTAILLÉE DE CHAQUE LIGNE');

    itemRows.forEach((row, index) => {
        console.log(`\n📦 LIGNE ${index + 1}:`);
        console.log(`   - Classes: "${row.className}"`);
        console.log(`   - ID: "${row.id}"`);

        // Chercher tous les champs de saisie dans cette ligne
        const allInputs = row.querySelectorAll('input, select, textarea');
        console.log(`   - Total des champs: ${allInputs.length}`);

        allInputs.forEach(input => {
            console.log(`     * ${input.tagName} name="${input.name}" value="${input.value}" type="${input.type}"`);
        });

        // Vérifier les champs spécifiques requis (noms corrects)
        const requiredFields = [
            'description',
            'quantity',
            'unit_price'
        ];

        console.log(`   - Champs requis:`);
        requiredFields.forEach(fieldName => {
            const element = row.querySelector(`[name="${fieldName}"]`);
            if (element) {
                console.log(`     ✅ ${fieldName}: "${element.value}"`);
            } else {
                console.log(`     ❌ ${fieldName}: MANQUANT`);
            }
        });

        // Vérifier l'unité depuis data-unit
        const unitFromData = row.getAttribute('data-unit');
        console.log(`     ${unitFromData ? '✅' : '❌'} data-unit: "${unitFromData || 'MANQUANT'}"`);

        // Vérifier la classe CSS
        const hasCorrectClass = row.classList.contains('invoice-item-row');
        console.log(`     ${hasCorrectClass ? '✅' : '❌'} classe invoice-item-row: ${hasCorrectClass}`);
    });

    console.log('\n4️⃣ TEST DE LA FONCTION getInvoiceItems()');

    try {
        // Simuler la fonction getInvoiceItems avec gestion d'erreurs
        const items = [];
        const rows = document.querySelectorAll('.invoice-item-row');

        rows.forEach((row, index) => {
            console.log(`\n🔄 Traitement ligne ${index + 1}:`);

            // Utiliser les bons noms de champs
            const descriptionElement = row.querySelector('[name="description"]');
            const quantityElement = row.querySelector('[name="quantity"]');
            const priceElement = row.querySelector('[name="unit_price"]');
            const unitFromData = row.getAttribute('data-unit') || 'retail';

            console.log(`   - Description element: ${!!descriptionElement}`);
            console.log(`   - Quantity element: ${!!quantityElement}`);
            console.log(`   - Price element: ${!!priceElement}`);
            console.log(`   - Unit from data-unit: "${unitFromData}"`);

            if (descriptionElement && quantityElement && priceElement) {
                const description = descriptionElement.value.trim();
                const quantity = parseFloat(quantityElement.value) || 0;
                const unitPrice = parseFloat(priceElement.value) || 0;

                // Convertir l'unité technique en unité d'affichage
                let unit = 'pièce';
                if (unitFromData === 'carton') {
                    unit = 'carton';
                } else if (unitFromData === 'wholesale') {
                    unit = 'gros';
                } else {
                    unit = 'pièce';
                }

                console.log(`   ✅ Données extraites:`);
                console.log(`     - Description: "${description}"`);
                console.log(`     - Quantité: ${quantity}`);
                console.log(`     - Unité: "${unit}" (depuis data-unit: "${unitFromData}")`);
                console.log(`     - Prix: ${unitPrice}`);

                if (description && quantity > 0) {
                    const item = {
                        line_number: index + 1,
                        description: description,
                        quantity: quantity,
                        unit: unit,
                        unit_price: unitPrice,
                        line_total: quantity * unitPrice
                    };
                    items.push(item);
                    console.log(`   ✅ Article ajouté à la liste`);
                } else {
                    console.log(`   ⚠️ Article ignoré (description="${description}", quantité=${quantity})`);
                }
            } else {
                console.log(`   ❌ Éléments manquants - ligne ignorée`);
            }
        });

        console.log(`\n📊 RÉSULTAT FINAL:`);
        console.log(`   - Articles valides: ${items.length}`);
        console.log(`   - Articles détaillés:`, items);

        if (items.length === 0) {
            console.log(`\n⚠️ AUCUN ARTICLE VALIDE TROUVÉ`);
            console.log(`💡 Vérifiez que:`);
            console.log(`   - Au moins une ligne a une description`);
            console.log(`   - La quantité est supérieure à 0`);
            console.log(`   - Tous les champs requis sont présents`);
        }

    } catch (error) {
        console.error('❌ Erreur lors du test getInvoiceItems():', error);
    }
}

/**
 * Test de simulation de sauvegarde
 */
function testInvoiceSaveSimulation() {
    console.log('\n🎯 === SIMULATION SAUVEGARDE ===');
    
    if (!window.location.href.includes('invoices.html')) {
        console.error('❌ Ce test doit être exécuté sur la page des factures');
        return;
    }
    
    const editorView = document.getElementById('editorView');
    if (!editorView || editorView.classList.contains('hidden')) {
        console.log('⚠️ L\'éditeur de facture n\'est pas ouvert');
        return;
    }
    
    console.log('🔄 Simulation de la sauvegarde...');
    
    try {
        // Remplir quelques données de test
        const clientNameInput = document.querySelector('input[name="client_name"]');
        const clientPhoneInput = document.querySelector('input[name="client_phone"]');
        const clientAddressInput = document.querySelector('textarea[name="client_address"]');
        
        if (clientNameInput) {
            clientNameInput.value = 'Client Test - ' + Date.now();
            console.log('✅ Nom du client rempli');
        }
        
        if (clientPhoneInput) {
            clientPhoneInput.value = '+212 6XX XXX XXX';
            console.log('✅ Téléphone du client rempli');
        }
        
        if (clientAddressInput) {
            clientAddressInput.value = 'Adresse de test, Ville, Code Postal';
            console.log('✅ Adresse du client remplie');
        }
        
        // Vérifier qu'il y a au moins un article (avec les bons noms de champs)
        const firstDescriptionInput = document.querySelector('[name="description"]');
        const firstQuantityInput = document.querySelector('[name="quantity"]');
        const firstPriceInput = document.querySelector('[name="unit_price"]');
        
        if (firstDescriptionInput) {
            firstDescriptionInput.value = 'Article de test';
            console.log('✅ Description du premier article remplie');
        }
        
        if (firstQuantityInput) {
            firstQuantityInput.value = '1';
            firstQuantityInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('✅ Quantité du premier article remplie');
        }
        
        if (firstPriceInput) {
            firstPriceInput.value = '100';
            firstPriceInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('✅ Prix du premier article rempli');
        }
        
        // Attendre un peu pour que les totaux se recalculent
        setTimeout(() => {
            console.log('\n📊 DONNÉES FINALES POUR SAUVEGARDE:');
            testInvoiceSave();
            
            console.log('\n💡 PRÊT POUR LA SAUVEGARDE');
            console.log('Vous pouvez maintenant cliquer sur le bouton "Sauvegarder" pour tester');
            
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erreur lors de la simulation:', error);
    }
}

// Exporter les fonctions
window.testInvoiceSave = testInvoiceSave;
window.testInvoiceSaveSimulation = testInvoiceSaveSimulation;
window.diagnoseInvoiceItems = diagnoseInvoiceItems;

console.log('🛠️ Fonctions de test disponibles:');
console.log('- testInvoiceSave() : Diagnostic complet de la sauvegarde');
console.log('- testInvoiceSaveSimulation() : Simulation avec données de test');
console.log('- diagnoseInvoiceItems() : Diagnostic détaillé des articles');
console.log('');
console.log('💡 Pour diagnostiquer l\'erreur: diagnoseInvoiceItems()');

// Script de debug pour vérifier les colonnes de la base de données
console.log('🔍 === DEBUG DATABASE COLUMNS ===');

// Test direct via l'API de l'application
if (window.api && window.api.database) {
    console.log('📊 Test direct de la base de données...');
    
    // Vérifier la structure de la table
    window.api.database.query("PRAGMA table_info(invoice_templates)")
        .then(columns => {
            console.log('📋 Structure de la table invoice_templates:');
            columns.forEach(col => {
                console.log(`   ${col.cid}: ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
            });
            
            const hasElementsConfig = columns.some(col => col.name === 'elements_config');
            const hasFooterContent = columns.some(col => col.name === 'footer_content');
            
            console.log('\n✅ Vérification des colonnes:');
            console.log(`   elements_config: ${hasElementsConfig ? '✅ Présente' : '❌ Manquante'}`);
            console.log(`   footer_content: ${hasFooterContent ? '✅ Présente' : '❌ Manquante'}`);
            
            // Test de requête directe
            return window.api.database.query("SELECT id, name, elements_config, footer_content FROM invoice_templates LIMIT 1");
        })
        .then(results => {
            console.log('\n📄 Test de récupération directe:');
            if (results && results.length > 0) {
                const template = results[0];
                console.log('   Template ID:', template.id);
                console.log('   Template name:', template.name);
                console.log('   elements_config:', template.elements_config);
                console.log('   footer_content:', template.footer_content);
                console.log('   elements_config type:', typeof template.elements_config);
                console.log('   footer_content type:', typeof template.footer_content);
            } else {
                console.log('   ❌ Aucun template trouvé');
            }
        })
        .catch(error => {
            console.error('❌ Erreur lors du test direct:', error);
        });
} else {
    console.log('❌ API database non disponible');
}

// Test via l'API templates
console.log('\n🔄 Test via API templates...');
if (window.api && window.api.templates) {
    window.api.templates.getAll()
        .then(templates => {
            console.log(`📊 ${templates.length} templates récupérés via API`);
            if (templates.length > 0) {
                const template = templates[0];
                console.log('📋 Premier template (API):');
                console.log('   ID:', template.id);
                console.log('   Name:', template.name);
                console.log('   Toutes les propriétés:', Object.keys(template));
                console.log('   elements_config présent:', 'elements_config' in template);
                console.log('   footer_content présent:', 'footer_content' in template);
                console.log('   elements_config valeur:', template.elements_config);
                console.log('   footer_content valeur:', template.footer_content);
            }
        })
        .catch(error => {
            console.error('❌ Erreur API templates:', error);
        });
} else {
    console.log('❌ API templates non disponible');
}

console.log('\n🔚 === FIN DEBUG ===');

// Fix Performance Immédiat - GestionPro
console.log('🚀 OPTIMISATION PERFORMANCE GESTIONPRO');
console.log('=====================================\n');

const fs = require('fs');
const path = require('path');

// 1. Créer les index de base de données
function createIndexes() {
    console.log('📊 Création des index de performance...');
    
    try {
        const Database = require('better-sqlite3');
        const dbPath = path.join(__dirname, 'database', 'main.db');
        
        if (!fs.existsSync(dbPath)) {
            console.log('❌ Base de données non trouvée:', dbPath);
            return false;
        }
        
        const db = new Database(dbPath);
        
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)',
            'CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)', 
            'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
            'CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name)',
            'CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date)',
            'CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id)'
        ];
        
        indexes.forEach(indexSQL => {
            try {
                db.exec(indexSQL);
                const indexName = indexSQL.split(' ')[5];
                console.log('✅ Index créé:', indexName);
            } catch (error) {
                console.log('ℹ️  Index existe déjà');
            }
        });
        
        // Optimiser la base
        db.exec('VACUUM');
        db.exec('ANALYZE');
        
        db.close();
        console.log('✅ Base de données optimisée\n');
        return true;
        
    } catch (error) {
        console.log('❌ Erreur base de données:', error.message);
        return false;
    }
}

// 2. Optimiser main.js
function optimizeMainJs() {
    console.log('⚡ Optimisation main.js...');
    
    try {
        const mainPath = path.join(__dirname, 'main.js');
        let content = fs.readFileSync(mainPath, 'utf8');
        
        // Ajouter optimisations mémoire
        const optimizations = `
// Optimisations performance
app.commandLine.appendSwitch('--max-old-space-size', '4096');
app.commandLine.appendSwitch('--js-flags', '--max-old-space-size=4096');
`;
        
        if (!content.includes('max-old-space-size')) {
            const insertPoint = content.indexOf('app.disableHardwareAcceleration();');
            if (insertPoint !== -1) {
                content = content.slice(0, insertPoint) + optimizations + content.slice(insertPoint);
                fs.writeFileSync(mainPath, content);
                console.log('✅ main.js optimisé\n');
                return true;
            }
        }
        
        console.log('ℹ️  main.js déjà optimisé\n');
        return true;
        
    } catch (error) {
        console.log('❌ Erreur main.js:', error.message);
        return false;
    }
}

// 3. Créer un fichier d'optimisation des requêtes
function createQueryOptimizations() {
    console.log('🔍 Création des optimisations de requêtes...');
    
    const optimizedQueries = `
// Optimisations de requêtes - À intégrer dans database.js

// Recherche produits optimisée avec LIMIT
const getAllProductsOptimized = (searchTerm = '', limit = 100) => {
    if (searchTerm) {
        return db.prepare(\`
            SELECT * FROM products 
            WHERE name LIKE ? OR barcode LIKE ? 
            ORDER BY name ASC 
            LIMIT ?
        \`).all(\`%\${searchTerm}%\`, \`%\${searchTerm}%\`, limit);
    }
    return db.prepare("SELECT * FROM products ORDER BY name ASC LIMIT ?").all(limit);
};

// Recherche clients optimisée
const getAllClientsOptimized = (searchTerm = '', limit = 100) => {
    if (searchTerm) {
        return db.prepare(\`
            SELECT * FROM clients 
            WHERE name LIKE ? OR phone LIKE ? 
            ORDER BY name ASC 
            LIMIT ?
        \`).all(\`%\${searchTerm}%\`, \`%\${searchTerm}%\`, limit);
    }
    return db.prepare("SELECT * FROM clients ORDER BY name ASC LIMIT ?").all(limit);
};

// Historique des ventes avec pagination
const getSalesHistoryOptimized = (filters = {}, page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    let query = \`
        SELECT s.*, c.name as client_name, u.username 
        FROM sales s 
        LEFT JOIN clients c ON s.client_id = c.id 
        LEFT JOIN users u ON s.user_id = u.id 
        WHERE s.status = 'COMPLETED'
    \`;
    
    const params = [];
    
    if (filters.startDate && filters.endDate) {
        query += " AND date(s.sale_date) BETWEEN ? AND ?";
        params.push(filters.startDate, filters.endDate);
    }
    
    query += " ORDER BY s.sale_date DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    
    return db.prepare(query).all(...params);
};

module.exports = {
    getAllProductsOptimized,
    getAllClientsOptimized, 
    getSalesHistoryOptimized
};
`;
    
    try {
        fs.writeFileSync('database-optimizations.js', optimizedQueries);
        console.log('✅ Fichier d\'optimisations créé: database-optimizations.js\n');
        return true;
    } catch (error) {
        console.log('❌ Erreur création optimisations:', error.message);
        return false;
    }
}

// 4. Créer un guide d'optimisation interface
function createInterfaceOptimizations() {
    console.log('🎨 Création du guide d\'optimisation interface...');
    
    const guide = `
# Guide d'Optimisation Interface - GestionPro

## 1. Debounce pour les recherches

Ajouter dans vos fichiers JS :

\`\`\`javascript
// Fonction debounce pour optimiser les recherches
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utilisation pour la recherche
const debouncedSearch = debounce((searchTerm) => {
    loadProducts(searchTerm);
}, 300);

// Dans l'event listener
searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});
\`\`\`

## 2. Pagination des listes

\`\`\`javascript
const ITEMS_PER_PAGE = 50;
let currentPage = 1;

function displayItemsWithPagination(items) {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageItems = items.slice(startIndex, endIndex);
    
    // Afficher seulement les éléments de la page
    displayItems(pageItems);
    
    // Créer les boutons de pagination
    createPaginationButtons(items.length);
}
\`\`\`

## 3. Loading states

\`\`\`javascript
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loading-spinner');
    if (loader) loader.remove();
}
\`\`\`

## 4. Virtualisation pour grandes listes

Pour les listes de plus de 500 éléments, utiliser la virtualisation :

\`\`\`javascript
function createVirtualList(items, container, itemHeight = 50) {
    const visibleItems = Math.ceil(container.clientHeight / itemHeight);
    let scrollTop = 0;
    
    function renderVisibleItems() {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleItems, items.length);
        
        // Render seulement les éléments visibles
        const fragment = document.createDocumentFragment();
        for (let i = startIndex; i < endIndex; i++) {
            const item = createItemElement(items[i]);
            item.style.position = 'absolute';
            item.style.top = (i * itemHeight) + 'px';
            fragment.appendChild(item);
        }
        
        container.innerHTML = '';
        container.appendChild(fragment);
    }
    
    container.addEventListener('scroll', () => {
        scrollTop = container.scrollTop;
        renderVisibleItems();
    });
    
    renderVisibleItems();
}
\`\`\`

## Application Immédiate

1. Ajouter debounce aux champs de recherche
2. Limiter l'affichage à 50-100 éléments
3. Ajouter des spinners de chargement
4. Utiliser la pagination pour les grandes listes
`;
    
    try {
        fs.writeFileSync('GUIDE-OPTIMISATION-INTERFACE.md', guide);
        console.log('✅ Guide d\'optimisation interface créé\n');
        return true;
    } catch (error) {
        console.log('❌ Erreur création guide:', error.message);
        return false;
    }
}

// Exécution principale
async function main() {
    console.log('🎯 Début de l\'optimisation...\n');
    
    const results = {
        indexes: createIndexes(),
        mainJs: optimizeMainJs(), 
        queries: createQueryOptimizations(),
        interface: createInterfaceOptimizations()
    };
    
    const successCount = Object.values(results).filter(Boolean).length;
    
    console.log('📊 RÉSULTATS:');
    console.log('=============');
    console.log('✅ Index base de données:', results.indexes ? 'OK' : 'ÉCHEC');
    console.log('✅ Optimisation main.js:', results.mainJs ? 'OK' : 'ÉCHEC');
    console.log('✅ Requêtes optimisées:', results.queries ? 'OK' : 'ÉCHEC');
    console.log('✅ Guide interface:', results.interface ? 'OK' : 'ÉCHEC');
    
    console.log(`\n🎊 ${successCount}/4 optimisations appliquées\n`);
    
    if (successCount >= 3) {
        console.log('🚀 PROCHAINES ÉTAPES:');
        console.log('1. Redémarrez l\'application: npm start');
        console.log('2. Les performances devraient être améliorées');
        console.log('3. Consultez GUIDE-OPTIMISATION-INTERFACE.md');
        console.log('4. Intégrez database-optimizations.js si nécessaire');
    }
}

main().catch(console.error);

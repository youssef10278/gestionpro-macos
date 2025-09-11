/**
 * BASE DE DONNEES SIMULEE COMPLETE
 * Avec donnees realistes pour toutes les fonctionnalites
 */

const fs = require('fs');
const path = require('path');

class CompleteDatabase {
    constructor(dbPath, options = {}) {
        this.dbPath = dbPath;
        this.options = options;
        this.isReady = true;
        
        console.log('[DB] CompleteDatabase initialisee:', dbPath);
        
        // Creer le dossier si necessaire
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Creer un fichier vide si necessaire
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, '');
        }
        
        // Initialiser les donnees simulees
        this.initSimulatedData();
    }

    initSimulatedData() {
        // Donnees simulees pour les tests
        this.simulatedData = {
            users: [
                { id: 1, username: 'admin', password_hash: '$2b$10$bc1f5f76ca73b5c5ad04fa516d90f2a7$a63df03df9725f9802d951f9923fda5100157b055c9df265982ba9a14cd8593b', role: 'Propriétaire' },
                { id: 2, username: 'proprietaire', password_hash: '$2b$10$cda42652a536cad9d1cdb5f499e72c60$b3ff7528831741362e48c729e062ff5998d1e8c2cb23b105b23bee2cdc596d07', role: 'Propriétaire' },
                { id: 3, username: 'vendeur', password_hash: '$2b$10$cda42652a536cad9d1cdb5f499e72c60$b3ff7528831741362e48c729e062ff5998d1e8c2cb23b105b23bee2cdc596d07', role: 'Vendeur' }
            ],
            products: [
                { id: 1, name: 'Produit Test 1', barcode: '1234567890', price_retail: 25.50, price_wholesale: 20.00, purchase_price: 15.00, stock: 100, category: 'Electronique' },
                { id: 2, name: 'Produit Test 2', barcode: '0987654321', price_retail: 45.00, price_wholesale: 35.00, purchase_price: 25.00, stock: 50, category: 'Accessoires' },
                { id: 3, name: 'Produit Test 3', barcode: '1122334455', price_retail: 12.75, price_wholesale: 10.00, purchase_price: 7.50, stock: 200, category: 'Consommables' }
            ],
            clients: [
                { id: 1, name: 'Client de passage', phone: '', address: '', credit_balance: 0.00, ice: '' },
                { id: 2, name: 'Client Test 1', phone: '0612345678', address: '123 Rue Test', credit_balance: 150.00, ice: 'ICE123456' },
                { id: 3, name: 'Client Test 2', phone: '0687654321', address: '456 Avenue Test', credit_balance: 0.00, ice: 'ICE789012' }
            ],
            sales: [
                { id: 1, client_id: 2, user_id: 1, total_amount: 75.50, amount_paid_cash: 75.50, amount_paid_credit: 0.00, sale_date: '2024-01-15 10:30:00', profit: 25.50 },
                { id: 2, client_id: 1, user_id: 1, total_amount: 45.00, amount_paid_cash: 45.00, amount_paid_credit: 0.00, sale_date: '2024-01-15 14:20:00', profit: 15.00 },
                { id: 3, client_id: 3, user_id: 1, total_amount: 120.25, amount_paid_cash: 100.00, amount_paid_credit: 20.25, sale_date: '2024-01-16 09:15:00', profit: 40.25 }
            ],
            sale_items: [
                { id: 1, sale_id: 1, product_id: 1, quantity: 2, unit_price: 25.50, total_price: 51.00 },
                { id: 2, sale_id: 1, product_id: 3, quantity: 1, unit_price: 12.75, total_price: 12.75 },
                { id: 3, sale_id: 2, product_id: 2, quantity: 1, unit_price: 45.00, total_price: 45.00 },
                { id: 4, sale_id: 3, product_id: 1, quantity: 3, unit_price: 25.50, total_price: 76.50 },
                { id: 5, sale_id: 3, product_id: 3, quantity: 2, unit_price: 12.75, total_price: 25.50 }
            ],
            invoices: [
                { id: 1, invoice_number: 'INV-2024-001', client_id: 2, total_amount: 75.50, tax_amount: 12.58, subtotal: 62.92, issue_date: '2024-01-15', due_date: '2024-02-15', status: 'paid' },
                { id: 2, invoice_number: 'INV-2024-002', client_id: 3, total_amount: 120.25, tax_amount: 20.04, subtotal: 100.21, issue_date: '2024-01-16', due_date: '2024-02-16', status: 'pending' }
            ],
            settings: [
                { key: 'company_name', value: 'GestionPro Test' },
                { key: 'company_address', value: '123 Rue de Test, Casablanca' },
                { key: 'company_phone', value: '0522123456' },
                { key: 'company_email', value: 'contact@gestionpro-test.ma' },
                { key: 'currency', value: 'MAD' },
                { key: 'tax_rate', value: '20' },
                { key: 'language', value: 'fr' },
                { key: 'theme', value: 'light' }
            ],
            expenses: [
                { id: 1, description: 'Achat fournitures bureau', amount: 250.00, category: 'Fournitures', date: '2024-01-15', status: 'approved', user_id: 1 },
                { id: 2, description: 'Frais de transport', amount: 150.00, category: 'Transport', date: '2024-01-16', status: 'pending', user_id: 1 }
            ]
        };
    }

    exec(sql) {
        console.log('[DB] EXEC:', sql.substring(0, 100));
        return [];
    }

    run(sql, params = []) {
        console.log('[DB] RUN direct:', sql.substring(0, 100), 'params:', params.length);
        return {
            changes: 1,
            lastInsertRowid: Math.floor(Math.random() * 1000) + 1
        };
    }

    get(sql, params = []) {
        console.log('[DB] GET direct:', sql.substring(0, 100), 'params:', params.length);

        // Authentification utilisateur
        if (sql.toLowerCase().includes('select * from users where username')) {
            const username = params[0];
            return this.simulatedData.users.find(u => u.username === username) || null;
        }

        // Requetes de structure de table (pour migrations)
        if (sql.toLowerCase().includes('select sql from sqlite_master')) {
            return { sql: 'CREATE TABLE clients (id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT, address TEXT, credit_balance REAL DEFAULT 0, ice TEXT, UNIQUE(name, phone))' };
        }

        // Requetes utilisateurs
        if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('users')) {
            if (sql.toLowerCase().includes('where username')) {
                const username = params[0];
                return this.simulatedData.users.find(u => u.username === username) || null;
            }
            return this.simulatedData.users[0];
        }

        // Requetes produits
        if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('products')) {
            return this.simulatedData.products[0];
        }

        // Requetes clients
        if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('clients')) {
            return this.simulatedData.clients[0];
        }

        // Requetes factures
        if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('invoices')) {
            return this.simulatedData.invoices[0];
        }

        // Requetes parametres
        if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('settings')) {
            if (params.length > 0) {
                const key = params[0];
                const setting = this.simulatedData.settings.find(s => s.key === key);
                return setting || null;
            }
            return this.simulatedData.settings[0];
        }

        return null;
    }

    all(sql, params = []) {
        console.log('[DB] ALL direct:', sql.substring(0, 100), 'params:', params.length);

        // Requetes PRAGMA (structure de table)
        if (sql.toLowerCase().includes('pragma table_info')) {
            // Retourner une structure de table factice
            return [
                { cid: 0, name: 'id', type: 'INTEGER', notnull: 0, dflt_value: null, pk: 1 },
                { cid: 1, name: 'name', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
                { cid: 2, name: 'value', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 }
            ];
        }

        // Requetes produits
        if (sql.toLowerCase().includes('products')) {
            return this.simulatedData.products;
        }

        // Requetes clients
        if (sql.toLowerCase().includes('clients')) {
            return this.simulatedData.clients;
        }

        // Requetes utilisateurs
        if (sql.toLowerCase().includes('users')) {
            if (sql.toLowerCase().includes('role = \'vendeur\'')) {
                return this.simulatedData.users.filter(u => u.role === 'Vendeur');
            }
            return this.simulatedData.users;
        }

        // Requetes ventes (historique)
        if (sql.toLowerCase().includes('sales')) {
            return this.simulatedData.sales.map(sale => ({
                ...sale,
                client_name: this.simulatedData.clients.find(c => c.id === sale.client_id)?.name || 'Client inconnu',
                user_name: this.simulatedData.users.find(u => u.id === sale.user_id)?.username || 'Utilisateur inconnu'
            }));
        }

        // Requetes articles de vente
        if (sql.toLowerCase().includes('sale_items')) {
            return this.simulatedData.sale_items.map(item => ({
                ...item,
                product_name: this.simulatedData.products.find(p => p.id === item.product_id)?.name || 'Produit inconnu'
            }));
        }

        // Requetes factures
        if (sql.toLowerCase().includes('invoices')) {
            return this.simulatedData.invoices.map(invoice => ({
                ...invoice,
                client_name: this.simulatedData.clients.find(c => c.id === invoice.client_id)?.name || 'Client inconnu'
            }));
        }

        // Requetes depenses
        if (sql.toLowerCase().includes('expenses')) {
            return this.simulatedData.expenses;
        }

        // Requetes parametres
        if (sql.toLowerCase().includes('settings')) {
            return this.simulatedData.settings;
        }

        return [];
    }

    prepare(sql) {
        const self = this;
        console.log('[DB] PREPARE:', sql.substring(0, 100));
        
        return {
            run: (...params) => {
                return self.run(sql, params);
            },
            get: (...params) => {
                return self.get(sql, params);
            },
            all: (...params) => {
                return self.all(sql, params);
            }
        };
    }

    transaction(fn) {
        const self = this;
        return (...args) => {
            console.log('[DB] TRANSACTION demarree');
            try {
                const result = fn.call(self, ...args);
                console.log('[DB] TRANSACTION reussie');
                return result;
            } catch (error) {
                console.error('[ERR] TRANSACTION echouee:', error.message);
                throw error;
            }
        };
    }

    pragma(statement) {
        console.log('[DB] PRAGMA:', statement);
        return [];
    }

    close() {
        console.log('[DB] DATABASE fermee');
    }

    backup(destinationPath) {
        try {
            fs.copyFileSync(this.dbPath, destinationPath);
            return true;
        } catch (error) {
            console.error('[ERR] Erreur backup:', error);
            return false;
        }
    }
}

module.exports = CompleteDatabase;

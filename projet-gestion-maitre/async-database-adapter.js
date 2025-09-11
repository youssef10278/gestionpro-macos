/**
 * ADAPTATEUR DE BASE DE DONNEES ASYNCHRONE AVEC SQL.JS
 * Version qui fonctionne correctement avec l'initialisation asynchrone
 */

const fs = require('fs');
const path = require('path');

class AsyncDatabaseAdapter {
    constructor(dbPath, options = {}) {
        this.dbPath = dbPath;
        this.options = options;
        this.db = null;
        this.SQL = null;
        this.isReady = false;
        this.initPromise = null;
        
        console.log('[DB] AsyncDatabaseAdapter initialisation:', dbPath);
        
        // Créer le dossier si nécessaire
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Démarrer l'initialisation asynchrone
        this.initPromise = this.initAsync();
    }

    async initAsync() {
        try {
            console.log('[DB] Chargement sql.js...');
            const initSqlJs = require('sql.js');
            this.SQL = await initSqlJs();
            
            // Charger ou créer la base de données
            if (fs.existsSync(this.dbPath)) {
                console.log('[DB] Chargement base existante:', this.dbPath);
                const filebuffer = fs.readFileSync(this.dbPath);
                this.db = new this.SQL.Database(filebuffer);
            } else {
                console.log('[DB] Création nouvelle base:', this.dbPath);
                this.db = new this.SQL.Database();
                this.createInitialTables();
                this.saveToFile();
            }
            
            this.isReady = true;
            console.log('[DB] Base de données prête (async)');
            
        } catch (error) {
            console.error('[ERR] Erreur initialisation async:', error);
            this.createFallbackDatabase();
        }
    }

    async ensureReady() {
        if (!this.isReady && this.initPromise) {
            await this.initPromise;
        }
        return this.isReady;
    }

    createFallbackDatabase() {
        console.log('[DB] Mode de secours activé');
        this.db = {
            exec: () => [],
            run: () => {},
            close: () => {}
        };
        this.isReady = true;
    }

    createInitialTables() {
        if (!this.db) return;
        
        console.log('[DB] Création tables initiales...');
        
        // Tables essentielles
        const tables = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('Propriétaire', 'Vendeur'))
            )`,
            
            `CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                barcode TEXT UNIQUE,
                name TEXT NOT NULL,
                purchase_price REAL NOT NULL DEFAULT 0,
                price_retail REAL NOT NULL,
                price_wholesale REAL NOT NULL,
                stock INTEGER NOT NULL DEFAULT 0,
                category TEXT,
                alert_threshold INTEGER DEFAULT 10
            )`,
            
            `CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT,
                address TEXT,
                credit_balance REAL NOT NULL DEFAULT 0,
                ice TEXT
            )`,
            
            `CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER,
                user_id INTEGER NOT NULL,
                total_amount REAL NOT NULL,
                amount_paid_cash REAL NOT NULL,
                amount_paid_credit REAL NOT NULL,
                sale_date TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
                profit REAL DEFAULT 0,
                ticket_number TEXT,
                FOREIGN KEY (client_id) REFERENCES clients(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`,
            
            `CREATE TABLE IF NOT EXISTS sale_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sale_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                total_price REAL NOT NULL,
                FOREIGN KEY (sale_id) REFERENCES sales(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )`,
            
            `CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )`
        ];
        
        tables.forEach(sql => {
            try {
                this.db.exec(sql);
            } catch (error) {
                console.error('[ERR] Erreur création table:', error);
            }
        });
        
        // Données initiales
        this.insertInitialData();
    }

    insertInitialData() {
        if (!this.db) return;
        
        console.log('[DB] Insertion données initiales...');
        
        try {
            // Utilisateur admin
            this.db.run(`
                INSERT OR IGNORE INTO users (username, password_hash, role) 
                VALUES (?, ?, ?)
            `, ['admin', '$2b$10$bc1f5f76ca73b5c5ad04fa516d90f2a7$a63df03df9725f9802d951f9923fda5100157b055c9df265982ba9a14cd8593b', 'Propriétaire']);
            
            // Client de passage
            this.db.run(`
                INSERT OR IGNORE INTO clients (id, name, phone, address, credit_balance, ice) 
                VALUES (1, 'Client de passage', '', '', 0, '')
            `);
            
            // Paramètres par défaut
            const settings = [
                ['company_name', 'GestionPro'],
                ['currency', 'MAD'],
                ['language', 'fr'],
                ['theme', 'light']
            ];
            
            settings.forEach(([key, value]) => {
                this.db.run(`
                    INSERT OR IGNORE INTO settings (key, value) 
                    VALUES (?, ?)
                `, [key, value]);
            });
            
            // Produits de test
            const products = [
                ['1234567890', 'Produit Test 1', 15.00, 25.50, 20.00, 100, 'Test'],
                ['0987654321', 'Produit Test 2', 25.00, 45.00, 35.00, 50, 'Test']
            ];
            
            products.forEach(([barcode, name, purchase, retail, wholesale, stock, category]) => {
                this.db.run(`
                    INSERT OR IGNORE INTO products (barcode, name, purchase_price, price_retail, price_wholesale, stock, category) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [barcode, name, purchase, retail, wholesale, stock, category]);
            });
            
            console.log('[DB] Données initiales insérées');
            
        } catch (error) {
            console.error('[ERR] Erreur insertion données:', error);
        }
    }

    saveToFile() {
        if (!this.db || !this.SQL) return;
        
        try {
            const data = this.db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(this.dbPath, buffer);
        } catch (error) {
            console.error('[ERR] Erreur sauvegarde:', error);
        }
    }

    // Méthodes synchrones avec vérification d'état
    exec(sql) {
        if (!this.isReady || !this.db) {
            console.log('[DB] Base non prête pour exec, ignoré');
            return [];
        }
        
        try {
            const result = this.db.exec(sql);
            this.saveToFile();
            return result;
        } catch (error) {
            console.error('[ERR] Erreur exec:', error);
            return [];
        }
    }

    run(sql, params = []) {
        if (!this.isReady || !this.db) {
            console.log('[DB] Base non prête pour run, ignoré');
            return { changes: 0, lastInsertRowid: 0 };
        }
        
        try {
            this.db.run(sql, params);
            this.saveToFile();
            return {
                changes: 1,
                lastInsertRowid: this.getLastInsertId()
            };
        } catch (error) {
            console.error('[ERR] Erreur run:', error);
            return { changes: 0, lastInsertRowid: 0 };
        }
    }

    get(sql, params = []) {
        if (!this.isReady || !this.db) {
            console.log('[DB] Base non prête pour get, retour null');
            return null;
        }
        
        try {
            const results = this.db.exec(sql, params);
            if (results.length > 0 && results[0].values.length > 0) {
                const columns = results[0].columns;
                const values = results[0].values[0];
                
                const row = {};
                columns.forEach((col, index) => {
                    row[col] = values[index];
                });
                return row;
            }
            return null;
        } catch (error) {
            console.error('[ERR] Erreur get:', error);
            return null;
        }
    }

    all(sql, params = []) {
        if (!this.isReady || !this.db) {
            console.log('[DB] Base non prête pour all, retour []');
            return [];
        }
        
        try {
            const results = this.db.exec(sql, params);
            if (results.length > 0) {
                const columns = results[0].columns;
                const values = results[0].values;
                
                return values.map(row => {
                    const obj = {};
                    columns.forEach((col, index) => {
                        obj[col] = row[index];
                    });
                    return obj;
                });
            }
            return [];
        } catch (error) {
            console.error('[ERR] Erreur all:', error);
            return [];
        }
    }

    prepare(sql) {
        const self = this;
        return {
            run: (...params) => self.run(sql, params),
            get: (...params) => self.get(sql, params),
            all: (...params) => self.all(sql, params)
        };
    }

    transaction(fn) {
        const self = this;
        return (...args) => {
            try {
                const result = fn.call(self, ...args);
                self.saveToFile();
                return result;
            } catch (error) {
                console.error('[ERR] Transaction error:', error);
                throw error;
            }
        };
    }

    pragma(statement) {
        return [];
    }

    close() {
        if (this.db && typeof this.db.close === 'function') {
            this.saveToFile();
            this.db.close();
            this.db = null;
            this.isReady = false;
        }
    }

    getLastInsertId() {
        try {
            const result = this.db.exec("SELECT last_insert_rowid() as id");
            return result[0]?.values[0]?.[0] || 0;
        } catch (error) {
            return 0;
        }
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

module.exports = AsyncDatabaseAdapter;

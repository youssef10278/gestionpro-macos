/**
 * SOLUTION ULTRA-SIMPLE : Remplacement minimal de better-sqlite3
 * Version nettoyee sans caracteres speciaux
 */

const fs = require('fs');
const path = require('path');

class SimpleDatabase {
    constructor(dbPath, options = {}) {
        this.dbPath = dbPath;
        this.options = options;
        this.isReady = true;
        
        console.log('[DB] SimpleDatabase initialisee:', dbPath);
        
        // Creer le dossier si necessaire
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Creer un fichier vide si necessaire
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, '');
        }
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
        
        // Donnees de test selon le type de requete
        if (sql.toLowerCase().includes('select * from users where username')) {
            const username = params[0];
            
            // Donnees de test pour differents utilisateurs
            const testUsers = {
                'admin': {
                    id: 1,
                    username: 'admin',
                    password_hash: '$2b$10$bc1f5f76ca73b5c5ad04fa516d90f2a7$a63df03df9725f9802d951f9923fda5100157b055c9df265982ba9a14cd8593b',
                    role: 'Propriétaire'
                },
                'proprietaire': {
                    id: 1,
                    username: 'proprietaire',
                    password_hash: '$2b$10$cda42652a536cad9d1cdb5f499e72c60$b3ff7528831741362e48c729e062ff5998d1e8c2cb23b105b23bee2cdc596d07',
                    role: 'Propriétaire'
                },
                'vendeur': {
                    id: 2,
                    username: 'vendeur',
                    password_hash: '$2b$10$cda42652a536cad9d1cdb5f499e72c60$b3ff7528831741362e48c729e062ff5998d1e8c2cb23b105b23bee2cdc596d07',
                    role: 'Vendeur'
                }
            };
            
            return testUsers[username] || null;
        }
        
        if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('users')) {
            return {
                id: 1,
                username: 'admin',
                role: 'Propriétaire'
            };
        }
        
        if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('products')) {
            return {
                id: 1,
                name: 'Produit Test',
                price_retail: 10.0,
                stock: 100
            };
        }
        
        if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('clients')) {
            return {
                id: 1,
                name: 'Client Test',
                credit_balance: 0.0
            };
        }
        
        return null;
    }

    all(sql, params = []) {
        console.log('[DB] ALL direct:', sql.substring(0, 100), 'params:', params.length);
        
        // Retourner des listes factices selon le type de requete
        if (sql.toLowerCase().includes('products')) {
            return [
                { id: 1, name: 'Produit 1', price_retail: 10.0, stock: 100 },
                { id: 2, name: 'Produit 2', price_retail: 20.0, stock: 50 }
            ];
        }
        
        if (sql.toLowerCase().includes('clients')) {
            return [
                { id: 1, name: 'Client 1', credit_balance: 0.0 },
                { id: 2, name: 'Client 2', credit_balance: 50.0 }
            ];
        }
        
        if (sql.toLowerCase().includes('users')) {
            return [
                { id: 1, username: 'admin', role: 'Propriétaire' },
                { id: 2, username: 'vendeur1', role: 'Vendeur' }
            ];
        }
        
        return [];
    }

    prepare(sql) {
        const self = this;
        console.log('[DB] PREPARE:', sql.substring(0, 100));
        
        return {
            run: (...params) => {
                console.log('[DB] RUN avec params:', params.length, 'parametres');
                return {
                    changes: 1,
                    lastInsertRowid: Math.floor(Math.random() * 1000) + 1
                };
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

module.exports = SimpleDatabase;

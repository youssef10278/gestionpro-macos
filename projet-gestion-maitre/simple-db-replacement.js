/**
 * SOLUTION ULTRA-SIMPLE : Remplacement minimal de better-sqlite3
 * Fonctionne en mode "stub" pour permettre à l'application de démarrer
 */

const fs = require('fs');
const path = require('path');

class SimpleDatabase {
    constructor(dbPath, options = {}) {
        this.dbPath = dbPath;
        this.options = options;
        this.isReady = true; // Toujours prêt
        
        console.log('[DB] SimpleDatabase initialisee:', dbPath);
        
        // Créer le dossier si nécessaire
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Créer un fichier vide si nécessaire
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, '');
        }
    }

    exec(sql) {
        console.log('[DB] EXEC:', sql.substring(0, 100) + (sql.length > 100 ? '...' : ''));
        return [];
    }

    // Méthodes directes pour compatibilité avec database.js
    run(sql, params = []) {
        console.log('[DB] RUN direct:', sql.substring(0, 100) + (sql.length > 100 ? '...'), 'params:', params.length);
        return {
            changes: 1,
            lastInsertRowid: Math.floor(Math.random() * 1000) + 1
        };
    }

    get(sql, params = []) {
        console.log('[DB] GET direct:', sql.substring(0, 100) + (sql.length > 100 ? '...'), 'params:', params.length);

        // Retourner des données factices selon le type de requête
        if (sql.toLowerCase().includes('select * from users where username')) {
            const username = params[0];

            // Données de test pour différents utilisateurs
            const testUsers = {
                'admin': {
                    id: 1,
                    username: 'admin',
                    password_hash: '$2b$10$f093c8513dea1191c09f0833ab00cbeb$e313556fc0c6593dda78e88075f12b6dcba5f56c0b2105f38df203b18', // "admin123"
                    role: 'Propriétaire'
                },
                'proprietaire': {
                    id: 1,
                    username: 'proprietaire',
                    password_hash: '$2b$10$f093c8513dea1191c09f0833ab00cbeb$e313556fc0c6593dda78e88075f12b6dcba5f56c0b2105f38df203b18', // "admin123"
                    role: 'Propriétaire'
                },
                'vendeur': {
                    id: 2,
                    username: 'vendeur',
                    password_hash: '$2b$10$f093c8513dea1191c09f0833ab00cbeb$e313556fc0c6593dda78e88075f12b6dcba5f56c0b2105f38df203b18', // "admin123"
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

        // Retour par défaut
        return null;
    }

    all(sql, params = []) {
        console.log('[DB] ALL direct:', sql.substring(0, 100) + (sql.length > 100 ? '...'), 'params:', params.length);

        // Retourner des listes factices selon le type de requête
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

        // Retour par défaut
        return [];
    }

    prepare(sql) {
        const self = this;
        console.log('📝 PREPARE:', sql.substring(0, 100) + (sql.length > 100 ? '...' : ''));
        
        return {
            run: (...params) => {
                console.log('📝 RUN avec params:', params.length, 'paramètres');
                return {
                    changes: 1,
                    lastInsertRowid: Math.floor(Math.random() * 1000) + 1
                };
            },
            
            get: (...params) => {
                console.log('📝 GET avec params:', params.length, 'paramètres');
                
                // Retourner des données factices selon le type de requête
                if (sql.toLowerCase().includes('select * from users where username')) {
                    return {
                        id: 1,
                        username: 'admin',
                        password_hash: '$2b$10$dummy.hash.for.testing.purposes.only',
                        role: 'Propriétaire'
                    };
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
                
                // Retour par défaut
                return null;
            },
            
            all: (...params) => {
                console.log('📝 ALL avec params:', params.length, 'paramètres');
                
                // Retourner des listes factices selon le type de requête
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
                
                // Retour par défaut
                return [];
            }
        };
    }

    transaction(fn) {
        const self = this;
        return (...args) => {
            console.log('📝 TRANSACTION démarrée');
            try {
                const result = fn.call(self, ...args);
                console.log('✅ TRANSACTION réussie');
                return result;
            } catch (error) {
                console.error('❌ TRANSACTION échouée:', error.message);
                throw error;
            }
        };
    }

    pragma(statement) {
        console.log('📝 PRAGMA:', statement);
        return [];
    }

    close() {
        console.log('📝 DATABASE fermée');
    }

    // Méthodes utilitaires
    backup(destinationPath) {
        try {
            fs.copyFileSync(this.dbPath, destinationPath);
            return true;
        } catch (error) {
            console.error('❌ Erreur backup:', error);
            return false;
        }
    }
}

module.exports = SimpleDatabase;

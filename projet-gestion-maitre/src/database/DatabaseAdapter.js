const fs = require('fs');
const path = require('path');

/**
 * Adaptateur de base de données JavaScript pur
 * Remplace better-sqlite3 par sql.js pour éviter les modules natifs
 */
class DatabaseAdapter {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.db = null;
        this.SQL = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Initialiser sql.js
            const initSqlJs = require('sql.js');
            this.SQL = await initSqlJs();

            // Charger la base de données existante ou créer une nouvelle
            if (fs.existsSync(this.dbPath)) {
                const filebuffer = fs.readFileSync(this.dbPath);
                this.db = new this.SQL.Database(filebuffer);
                console.log('✅ Base de données chargée:', this.dbPath);
            } else {
                this.db = new this.SQL.Database();
                console.log('✅ Nouvelle base de données créée');
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('❌ Erreur initialisation base de données:', error);
            throw error;
        }
    }

    /**
     * Exécuter une requête SQL
     */
    exec(sql, params = []) {
        if (!this.isInitialized) {
            throw new Error('Database not initialized. Call init() first.');
        }

        try {
            const results = this.db.exec(sql, params);
            return results;
        } catch (error) {
            console.error('❌ Erreur SQL:', error.message);
            console.error('SQL:', sql);
            console.error('Params:', params);
            throw error;
        }
    }

    /**
     * Exécuter une requête et retourner la première ligne
     */
    get(sql, params = []) {
        const results = this.exec(sql, params);
        if (results.length > 0 && results[0].values.length > 0) {
            const columns = results[0].columns;
            const values = results[0].values[0];
            
            // Convertir en objet
            const row = {};
            columns.forEach((col, index) => {
                row[col] = values[index];
            });
            return row;
        }
        return null;
    }

    /**
     * Exécuter une requête et retourner toutes les lignes
     */
    all(sql, params = []) {
        const results = this.exec(sql, params);
        if (results.length > 0) {
            const columns = results[0].columns;
            const values = results[0].values;
            
            // Convertir en tableau d'objets
            return values.map(row => {
                const obj = {};
                columns.forEach((col, index) => {
                    obj[col] = row[index];
                });
                return obj;
            });
        }
        return [];
    }

    /**
     * Exécuter une requête de modification (INSERT, UPDATE, DELETE)
     */
    run(sql, params = []) {
        if (!this.isInitialized) {
            throw new Error('Database not initialized. Call init() first.');
        }

        try {
            this.db.run(sql, params);
            
            // Sauvegarder automatiquement après modification
            this.save();
            
            return {
                changes: this.db.getRowsModified(),
                lastInsertRowid: this.getLastInsertId()
            };
        } catch (error) {
            console.error('❌ Erreur SQL run:', error.message);
            console.error('SQL:', sql);
            console.error('Params:', params);
            throw error;
        }
    }

    /**
     * Obtenir l'ID du dernier insert
     */
    getLastInsertId() {
        try {
            const result = this.exec("SELECT last_insert_rowid() as id");
            return result[0]?.values[0]?.[0] || 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Sauvegarder la base de données sur disque
     */
    save() {
        if (!this.db) return;

        try {
            const data = this.db.export();
            const buffer = Buffer.from(data);
            
            // Créer le dossier si nécessaire
            const dir = path.dirname(this.dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(this.dbPath, buffer);
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
            throw error;
        }
    }

    /**
     * Fermer la base de données
     */
    close() {
        if (this.db) {
            this.save();
            this.db.close();
            this.db = null;
            this.isInitialized = false;
        }
    }

    /**
     * Créer un objet "prepared statement" compatible
     */
    prepare(sql) {
        return {
            run: (...params) => this.run(sql, params),
            get: (...params) => this.get(sql, params),
            all: (...params) => this.all(sql, params)
        };
    }

    /**
     * Transaction (simulée - sql.js ne supporte pas les vraies transactions)
     * Exécute une fonction avec sauvegarde automatique
     */
    transaction(fn) {
        const self = this;
        return async (...args) => {
            try {
                await self.init(); // S'assurer que la DB est initialisée
                const result = await fn.call(self, ...args);
                self.save(); // Sauvegarder après la transaction
                return result;
            } catch (error) {
                console.error('❌ Erreur dans transaction:', error);
                throw error;
            }
        };
    }

    /**
     * Pragma (pour compatibilité - la plupart sont ignorées dans sql.js)
     */
    pragma(statement) {
        try {
            // Certains pragma sont supportés par sql.js
            if (statement.includes('foreign_keys')) {
                this.exec(`PRAGMA ${statement}`);
            }
            // Les autres pragma sont ignorés silencieusement
            return true;
        } catch (error) {
            // Ignorer les erreurs pragma non supportées
            return false;
        }
    }

    /**
     * Backup (copie de la base de données)
     */
    backup(destinationPath) {
        try {
            this.save(); // S'assurer que tout est sauvé
            const fs = require('fs');
            fs.copyFileSync(this.dbPath, destinationPath);
            return true;
        } catch (error) {
            console.error('❌ Erreur backup:', error);
            return false;
        }
    }

    /**
     * Méthode pour obtenir des informations sur la base
     */
    getDatabaseInfo() {
        try {
            const tables = this.all("SELECT name FROM sqlite_master WHERE type='table'");
            return {
                path: this.dbPath,
                tables: tables.map(t => t.name),
                isInitialized: this.isInitialized
            };
        } catch (error) {
            return {
                path: this.dbPath,
                tables: [],
                isInitialized: this.isInitialized,
                error: error.message
            };
        }
    }
}

module.exports = DatabaseAdapter;

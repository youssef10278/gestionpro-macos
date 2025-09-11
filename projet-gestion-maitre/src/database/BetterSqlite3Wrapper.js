const DatabaseAdapter = require('./DatabaseAdapter');

/**
 * Wrapper qui émule parfaitement l'API de better-sqlite3
 * Permet une migration transparente sans changer le code existant
 */
class BetterSqlite3Wrapper {
    constructor(dbPath) {
        this.adapter = new DatabaseAdapter(dbPath);
        this.isInitialized = false;
    }

    async init() {
        if (!this.isInitialized) {
            await this.adapter.init();
            this.isInitialized = true;
        }
    }

    /**
     * Émule db.exec() de better-sqlite3
     */
    exec(sql) {
        if (!this.isInitialized) {
            throw new Error('Database not initialized. Call init() first.');
        }
        return this.adapter.exec(sql);
    }

    /**
     * Émule db.prepare() de better-sqlite3
     */
    prepare(sql) {
        const self = this;
        return {
            run: (...params) => {
                if (!self.isInitialized) {
                    throw new Error('Database not initialized. Call init() first.');
                }
                const result = self.adapter.run(sql, params);
                return {
                    changes: result.changes || 0,
                    lastInsertRowid: result.lastInsertRowid || 0
                };
            },
            get: (...params) => {
                if (!self.isInitialized) {
                    throw new Error('Database not initialized. Call init() first.');
                }
                return self.adapter.get(sql, params);
            },
            all: (...params) => {
                if (!self.isInitialized) {
                    throw new Error('Database not initialized. Call init() first.');
                }
                return self.adapter.all(sql, params);
            }
        };
    }

    /**
     * Émule db.transaction() de better-sqlite3
     */
    transaction(fn) {
        const self = this;
        return (...args) => {
            if (!self.isInitialized) {
                throw new Error('Database not initialized. Call init() first.');
            }
            
            try {
                // Exécuter la fonction dans le contexte de ce wrapper
                const result = fn.call(self, ...args);
                self.adapter.save(); // Sauvegarder après la transaction
                return result;
            } catch (error) {
                console.error('❌ Erreur dans transaction:', error);
                throw error;
            }
        };
    }

    /**
     * Émule db.pragma() de better-sqlite3
     */
    pragma(statement) {
        if (!this.isInitialized) {
            throw new Error('Database not initialized. Call init() first.');
        }
        return this.adapter.pragma(statement);
    }

    /**
     * Émule db.close() de better-sqlite3
     */
    close() {
        if (this.adapter) {
            this.adapter.close();
            this.isInitialized = false;
        }
    }

    /**
     * Méthodes utilitaires
     */
    backup(destinationPath) {
        return this.adapter.backup(destinationPath);
    }

    getDatabaseInfo() {
        return this.adapter.getDatabaseInfo();
    }
}

module.exports = BetterSqlite3Wrapper;

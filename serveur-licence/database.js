const Database = require('better-sqlite3');
const path = require('path');

// Crée ou ouvre la base de données du serveur
const db = new Database(path.join(__dirname, 'licenses.db'));

// Fonction pour initialiser la table des licences
function initDatabase() {
    console.log("Initialisation de la base de données du serveur...");
    const stmt = db.prepare(`
        CREATE TABLE IF NOT EXISTS licenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL UNIQUE,
            status TEXT NOT NULL DEFAULT 'inactive',
            machineId TEXT,
            activationDate DATETIME
        )
    `);
    stmt.run();
    console.log('La table "licenses" est prête.');
}

// Exécute l'initialisation au démarrage du module
initDatabase();

// --- Fonctions que nous allons exporter ---

function getLicenseByKey(key) {
    const stmt = db.prepare('SELECT * FROM licenses WHERE key = ?');
    return stmt.get(key);
}

function activateLicense(key, machineId) {
    const stmt = db.prepare(`
        UPDATE licenses
        SET status = 'active', machineId = ?, activationDate = CURRENT_TIMESTAMP
        WHERE key = ?
    `);
    return stmt.run(machineId, key);
}

function addLicense(key) {
    const stmt = db.prepare('INSERT INTO licenses (key, status) VALUES (?, ?)');
    return stmt.run(key, 'inactive');
}

// --- Exportation du module ---
// C'est la partie la plus importante. On exporte un objet qui contient nos trois fonctions.
module.exports = {
    getLicenseByKey,
    activateLicense,
    addLicense
};
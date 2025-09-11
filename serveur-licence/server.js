const express = require('express');
const cors = require('cors');
// On importe l'objet contenant nos fonctions depuis database.js
const db = require('./database.js'); 

const app = express();
const port = 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json()); // Pour comprendre le JSON envoyé par l'application

// --- Routes de l'API ---

app.post('/activate', (req, res) => {
    const { licenseKey, machineId } = req.body;

    if (!licenseKey || !machineId) {
        return res.status(400).json({ success: false, message: 'Clé de licence ou identifiant machine manquant.' });
    }

    try {
        // C'est ici que l'appel se fait. Il va maintenant trouver la fonction.
        const license = db.getLicenseByKey(licenseKey);

        if (!license) {
            return res.json({ success: false, message: 'Clé de licence invalide.' });
        }

        if (license.status === 'active') {
            if (license.machineId === machineId) {
                return res.json({ success: true, message: 'Licence déjà active sur cette machine.' });
            } else {
                return res.json({ success: false, message: 'Clé de licence déjà utilisée sur une autre machine.' });
            }
        }

        db.activateLicense(licenseKey, machineId);
        res.json({ success: true, message: 'Licence activée avec succès.' });

    } catch (error) {
        // En cas de problème, le message d'erreur s'affichera dans le terminal du serveur
        console.error("Erreur interne du serveur lors de l'activation :", error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
});

app.post('/validate', (req, res) => {
    const { licenseKey, machineId } = req.body;

    if (!licenseKey || !machineId) {
        return res.status(400).json({ valid: false, message: 'Clé ou ID machine manquant.' });
    }

    try {
        const license = db.getLicenseByKey(licenseKey);

        if (license && license.status === 'active' && license.machineId === machineId) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false, message: 'Licence invalide.' });
        }
    } catch (error) {
        console.error("Erreur interne du serveur lors de la validation :", error);
        res.status(500).json({ valid: false, message: 'Erreur interne du serveur.' });
    }
});

// --- Démarrage du serveur ---
app.listen(port, () => {
    console.log(`Serveur de licence en écoute sur http://localhost:${port}`);
});
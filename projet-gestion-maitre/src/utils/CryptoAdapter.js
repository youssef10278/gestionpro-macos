const CryptoJS = require('crypto-js');

/**
 * Adaptateur de cryptage JavaScript pur
 * Remplace bcrypt par crypto-js pour éviter les modules natifs
 */
class CryptoAdapter {
    
    /**
     * Générer un salt aléatoire
     */
    static generateSalt(rounds = 10) {
        const saltLength = Math.max(16, rounds);
        return CryptoJS.lib.WordArray.random(saltLength).toString();
    }

    /**
     * Hasher un mot de passe avec salt
     * Compatible avec l'API bcrypt
     */
    static async hash(password, saltRounds = 10) {
        try {
            // Générer un salt unique
            const salt = this.generateSalt(saltRounds);
            
            // Créer le hash avec PBKDF2 (plus sécurisé que SHA256 simple)
            const hash = CryptoJS.PBKDF2(password, salt, {
                keySize: 256/32,
                iterations: Math.pow(2, saltRounds)
            }).toString();
            
            // Format compatible bcrypt: $2b$rounds$salt$hash
            return `$2b$${saltRounds.toString().padStart(2, '0')}$${salt}$${hash}`;
            
        } catch (error) {
            console.error('❌ Erreur hash:', error);
            throw error;
        }
    }

    /**
     * Vérifier un mot de passe contre un hash
     * Compatible avec l'API bcrypt
     */
    static async compare(password, hash) {
        try {
            // Parser le hash format bcrypt
            const parts = hash.split('$');
            if (parts.length !== 5 || parts[1] !== '2b') {
                throw new Error('Format de hash invalide');
            }
            
            const rounds = parseInt(parts[2]);
            const salt = parts[3];
            const originalHash = parts[4];
            
            // Recalculer le hash avec le même salt
            const testHash = CryptoJS.PBKDF2(password, salt, {
                keySize: 256/32,
                iterations: Math.pow(2, rounds)
            }).toString();
            
            // Comparaison sécurisée
            return this.secureCompare(testHash, originalHash);
            
        } catch (error) {
            console.error('❌ Erreur compare:', error);
            return false;
        }
    }

    /**
     * Comparaison sécurisée pour éviter les timing attacks
     */
    static secureCompare(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        
        return result === 0;
    }

    /**
     * Hasher synchrone (pour compatibilité)
     */
    static hashSync(password, saltRounds = 10) {
        const salt = this.generateSalt(saltRounds);
        const hash = CryptoJS.PBKDF2(password, salt, {
            keySize: 256/32,
            iterations: Math.pow(2, saltRounds)
        }).toString();
        
        return `$2b$${saltRounds.toString().padStart(2, '0')}$${salt}$${hash}`;
    }

    /**
     * Vérification synchrone (pour compatibilité)
     */
    static compareSync(password, hash) {
        try {
            const parts = hash.split('$');
            if (parts.length !== 5 || parts[1] !== '2b') {
                return false;
            }
            
            const rounds = parseInt(parts[2]);
            const salt = parts[3];
            const originalHash = parts[4];
            
            const testHash = CryptoJS.PBKDF2(password, salt, {
                keySize: 256/32,
                iterations: Math.pow(2, rounds)
            }).toString();
            
            return this.secureCompare(testHash, originalHash);
            
        } catch (error) {
            console.error('❌ Erreur compareSync:', error);
            return false;
        }
    }

    /**
     * Cryptage AES pour données sensibles
     */
    static encrypt(text, key) {
        try {
            const encrypted = CryptoJS.AES.encrypt(text, key).toString();
            return encrypted;
        } catch (error) {
            console.error('❌ Erreur encrypt:', error);
            throw error;
        }
    }

    /**
     * Décryptage AES
     */
    static decrypt(encryptedText, key) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedText, key);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return decrypted;
        } catch (error) {
            console.error('❌ Erreur decrypt:', error);
            throw error;
        }
    }

    /**
     * Générer une clé aléatoire
     */
    static generateKey(length = 32) {
        return CryptoJS.lib.WordArray.random(length).toString();
    }

    /**
     * Hash MD5 (pour compatibilité)
     */
    static md5(text) {
        return CryptoJS.MD5(text).toString();
    }

    /**
     * Hash SHA256
     */
    static sha256(text) {
        return CryptoJS.SHA256(text).toString();
    }
}

module.exports = CryptoAdapter;

# 🔧 Amélioration - Bouton Aperçu/Imprimer

## 🎯 Fonctionnalité Améliorée

**Demande :** Le bouton "Aperçu/Imprimer" doit **sauvegarder ET imprimer** la facture, pas seulement imprimer.

### ❌ **Comportement Précédent**

1. **Impression directe** - Le bouton générait le PDF sans sauvegarder
2. **Données temporaires** - La facture restait en brouillon
3. **Perte potentielle** - Risque de perdre les données si l'utilisateur ferme la page

### ✅ **Nouveau Comportement Implémenté**

1. **Sauvegarde automatique** - La facture est d'abord sauvegardée en base de données
2. **Puis impression** - Le PDF est généré à partir de la facture sauvegardée
3. **Interface mise à jour** - Le bouton change de "Aperçu/Imprimer" à "Imprimer/PDF"

---

## 🔄 **Logique du Processus**

### **Étape 1 : Vérification de l'État**
```javascript
if (!currentInvoiceId) {
    // Facture non sauvegardée → Sauvegarder d'abord
} else {
    // Facture déjà sauvegardée → Imprimer directement
}
```

### **Étape 2 : Sauvegarde (si nécessaire)**
```javascript
// Récupération complète des données
const invoiceData = {
    client_name: document.querySelector('input[name="client_name"]')?.value || '',
    client_address: document.querySelector('textarea[name="client_address"]')?.value || '',
    // ... tous les champs
    tva_rate: tvaRate,
    items: getInvoiceItems()
};

// Validation des données essentielles
if (!invoiceData.client_name.trim()) {
    alert('Veuillez saisir le nom du client...');
    return;
}

// Sauvegarde en base
const saveResult = await window.api.invoices.create(invoiceData);
```

### **Étape 3 : Mise à Jour de l'Interface**
```javascript
if (saveResult.success) {
    currentInvoiceId = saveResult.invoiceId;
    saveInvoiceBtn.classList.add('hidden');           // Masquer "Sauvegarder"
    printInvoiceBtn.textContent = 'Imprimer/PDF';     // Changer le texte
    showNotification('Facture sauvegardée avec succès', 'success');
}
```

### **Étape 4 : Génération du PDF**
```javascript
// Génération du HTML de la facture sauvegardée
const invoiceHTML = await generatePrintableInvoice();

// Conversion en PDF et téléchargement
const pdfData = await window.api.print.toPDF(invoiceHTML);
// ... téléchargement automatique
```

---

## 🛡️ **Validations Ajoutées**

### **Validation Client :**
```javascript
if (!invoiceData.client_name.trim()) {
    alert('Veuillez saisir le nom du client avant de sauvegarder et imprimer.');
    return;
}
```

### **Validation Articles :**
```javascript
if (!invoiceData.items || invoiceData.items.length === 0) {
    alert('Veuillez ajouter au moins un article avant de sauvegarder et imprimer.');
    return;
}
```

### **Gestion d'Erreurs :**
```javascript
try {
    const saveResult = await window.api.invoices.create(invoiceData);
    if (saveResult.success) {
        // Succès
    } else {
        throw new Error(saveResult.error || 'Erreur lors de la sauvegarde');
    }
} catch (error) {
    console.error("❌ Erreur:", error);
    alert('Erreur lors de la sauvegarde: ' + error.message);
}
```

---

## 🎨 **Changements d'Interface**

### **État Initial (Nouvelle Facture) :**
- **Bouton "Sauvegarder"** : Visible
- **Bouton "Aperçu/Imprimer"** : Visible, texte = "Aperçu/Imprimer"

### **Après Sauvegarde via Aperçu/Imprimer :**
- **Bouton "Sauvegarder"** : Masqué
- **Bouton "Imprimer/PDF"** : Visible, texte = "Imprimer/PDF"
- **Notification** : "Facture sauvegardée avec succès"

### **État Consultation (Facture Existante) :**
- **Bouton "Sauvegarder"** : Masqué
- **Bouton "Imprimer/PDF"** : Visible, impression directe

---

## 🧪 **Comment Tester**

### **Test Complet :**
1. **Créer** une nouvelle facture
2. **Remplir** les champs obligatoires :
   - Nom du client
   - Au moins un article avec description, quantité, prix
3. **Cliquer** sur "Aperçu/Imprimer"
4. **Vérifier** :
   - ✅ Message "Facture sauvegardée avec succès"
   - ✅ Bouton "Sauvegarder" disparaît
   - ✅ Bouton devient "Imprimer/PDF"
   - ✅ PDF généré et téléchargé

### **Test de Validation :**
1. **Créer** une nouvelle facture
2. **Laisser** le nom du client vide
3. **Cliquer** "Aperçu/Imprimer"
4. **Vérifier** : Message d'erreur "Veuillez saisir le nom du client..."

### **Test Facture Existante :**
1. **Ouvrir** une facture existante (depuis la liste)
2. **Cliquer** "Imprimer/PDF"
3. **Vérifier** : Impression directe sans re-sauvegarde

---

## 📊 **Flux de Données**

### **Données Sauvegardées :**
```javascript
{
    client_name: "Nom du client",
    client_address: "Adresse complète",
    client_phone: "+212 6XX XXX XXX",
    client_ice: "000000000000000",
    invoice_number: "FACT-2024-0001",
    invoice_date: "2024-12-11",
    payment_terms: "30 jours",
    subtotal_ht: 100.00,
    tva_rate: 20,
    tva_amount: 20.00,
    total_amount: 120.00,
    items: [
        {
            line_number: 1,
            description: "Article 1",
            quantity: 1,
            unit: "pièce",
            unit_price: 100.00,
            line_total: 100.00
        }
    ]
}
```

### **Réponse de Sauvegarde :**
```javascript
{
    success: true,
    invoiceId: 123
}
```

---

## 🎯 **Avantages de l'Amélioration**

### **Pour l'Utilisateur :**
- ✅ **Simplicité** - Un seul clic pour sauvegarder et imprimer
- ✅ **Sécurité** - Aucun risque de perte de données
- ✅ **Cohérence** - Le PDF correspond exactement aux données sauvegardées

### **Pour le Système :**
- ✅ **Intégrité** - Toutes les factures imprimées sont sauvegardées
- ✅ **Traçabilité** - Historique complet des factures
- ✅ **Robustesse** - Gestion d'erreurs complète

---

## 🔍 **Messages et Notifications**

### **Messages de Validation :**
- `"Veuillez saisir le nom du client avant de sauvegarder et imprimer."`
- `"Veuillez ajouter au moins un article avant de sauvegarder et imprimer."`

### **Messages de Succès :**
- `"Facture sauvegardée avec succès"` (notification)
- `"PDF généré avec succès"` (alert)

### **Messages d'Erreur :**
- `"Erreur lors de la sauvegarde: [détail]"`
- `"Erreur lors de la génération du PDF"`

---

## 💡 **Points Techniques Importants**

1. **Réutilisation du Code** - La logique de sauvegarde est identique à celle du bouton "Sauvegarder"
2. **Gestion d'État** - `currentInvoiceId` est mis à jour après sauvegarde
3. **Interface Réactive** - Les boutons s'adaptent automatiquement à l'état
4. **Validation Robuste** - Vérifications avant sauvegarde et impression

---

## 🚀 **Résultat Final**

### **AVANT :**
- ❌ Clic "Aperçu/Imprimer" → PDF généré → Facture non sauvegardée

### **APRÈS :**
- ✅ Clic "Aperçu/Imprimer" → Sauvegarde → PDF généré → Interface mise à jour

**🎉 Le bouton "Aperçu/Imprimer" fonctionne maintenant comme attendu : il sauvegarde automatiquement la facture avant de générer le PDF !**

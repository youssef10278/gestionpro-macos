@echo off
title Serveur de Licences Local - GestionPro
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    SERVEUR DE LICENCES LOCAL - GESTIONPRO                   ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

echo 🔑 Génération d'une nouvelle clé de licence...
node generate-keys.js
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de la génération de la clé
    pause
    exit /b 1
)
echo.

echo 📋 Vérification des licences disponibles...
node check-licenses.js
echo.

echo 🚀 Démarrage du serveur de licences sur localhost:3000...
echo ⚠️ IMPORTANT: Gardez cette fenêtre ouverte !
echo.
echo 💡 Dans une autre fenêtre, vous pouvez maintenant:
echo    1. cd ..\projet-gestion-maitre
echo    2. npm start
echo    3. Utiliser la clé générée ci-dessus pour l'activation
echo.
echo ═══════════════════════════════════════════════════════════════════════════════
echo.

node server.js

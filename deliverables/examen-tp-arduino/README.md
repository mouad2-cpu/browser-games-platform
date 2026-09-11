# Examen TP Arduino — solution et compte rendu

Ce dossier contient :

- les quatre programmes Arduino, chacun dans un sketch `.ino` séparé ;
- `compte-rendu.html`, la version modifiable du rapport en français ;
- `Jorf_Moaad_Examen_TP_Arduino.pdf`, la version PDF finale ;
- `generer-pdf.sh`, le script de régénération du PDF.

La page de garde est renseignée pour **Jorf Moaad**, filière **Systèmes
Automatisés et Intelligence Artificielle pour l’Industrie 4.0**. Les sections
réservées aux captures d’écran ont été retirées.

## Générer le PDF

Google Chrome ou Chromium doit être installé :

```bash
chmod +x generer-pdf.sh
./generer-pdf.sh
```

Un autre nom de sortie peut être fourni si nécessaire :

```bash
./generer-pdf.sh autre-nom.pdf
```

## Correspondance des broches

| Exercice | Entrées | Sorties |
|---|---|---|
| 1 — Seuil analogique | Potentiomètre A0 | LED rouge D8 |
| 2 — Feu tricolore | — | Rouge D13, jaune D12, verte D11 |
| 3 — Éclairage manuel | Bouton D2 avec pull-down 10 kΩ | LED bleue D7 |
| 4 — Servomoteur | Potentiomètre A0 | Signal servo D9 |

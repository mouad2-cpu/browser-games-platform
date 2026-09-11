# Examen TP Arduino — solution et compte rendu

Ce dossier contient :

- les quatre programmes Arduino, chacun dans un sketch `.ino` séparé ;
- `compte-rendu.html`, la version modifiable du rapport en français ;
- `Nom_Prenom_Examen_TP_Arduino.pdf`, la version PDF prête à personnaliser ;
- `generer-pdf.sh`, le script de régénération du PDF.

## Personnalisation obligatoire

Avant la remise :

1. ouvrir `compte-rendu.html` dans un éditeur ;
2. remplacer les deux mentions `À compléter` de la page de garde ;
3. remplacer les cadres réservés par les captures de vos propres simulations Proteus ;
4. adapter les observations et difficultés aux résultats réellement obtenus ;
5. générer à nouveau le PDF ;
6. renommer le fichier avec votre nom et votre prénom.

Les schémas inclus donnent le câblage exact à reproduire, mais ce ne sont pas des
captures de Proteus. Le rapport les identifie explicitement comme diagrammes de
référence afin de ne pas présenter une simulation non exécutée comme un résultat.

## Générer le PDF

Google Chrome ou Chromium doit être installé :

```bash
chmod +x generer-pdf.sh
./generer-pdf.sh
```

Un autre nom de sortie peut être fourni :

```bash
./generer-pdf.sh Mouad_Exemple_Examen_TP_Arduino.pdf
```

## Correspondance des broches

| Exercice | Entrées | Sorties |
|---|---|---|
| 1 — Seuil analogique | Potentiomètre A0 | LED rouge D8 |
| 2 — Feu tricolore | — | Rouge D13, jaune D12, verte D11 |
| 3 — Éclairage manuel | Bouton D2 avec pull-down 10 kΩ | LED bleue D7 |
| 4 — Servomoteur | Potentiomètre A0 | Signal servo D9 |

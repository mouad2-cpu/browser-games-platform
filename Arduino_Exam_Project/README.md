# Examen TP Arduino sous Proteus ISIS

Ce dossier contient les quatre programmes demandés dans le sujet. Chaque exercice
est indépendant : il faut créer un schéma Proteus séparé et lui charger le fichier
HEX produit à partir du sketch correspondant.

## Organisation

```text
Arduino_Exam_Project/
├── Exercise1/Exercise1.ino
├── Exercise2/Exercise2.ino
├── Exercise3/Exercise3.ino
├── Exercise4/Exercise4.ino
├── Rapport/Rapport_Examen_TP_Arduino.html
├── Rapport/Nom_Prenom_Examen_TP_Arduino.pdf
└── README.md
```

## Règles de câblage communes

- Relier tous les composants au même `GND` que l'Arduino.
- Une LED se câble avec une résistance de limitation en série : sortie Arduino
  → résistance de 220 Ω → anode de la LED ; cathode → `GND`.
- Dans Proteus, vérifier que la carte est une `ARDUINO UNO R3` et que sa fréquence
  d'horloge est de 16 MHz.
- Ne jamais relier directement une LED entre une sortie et `GND` sans résistance.

## Exercice 1 — Détecteur de seuil analogique

### Composants

- 1 × `ARDUINO UNO R3`
- 1 × `POT-HG`
- 1 × `LED-RED`
- 1 × `MINIRES` de 220 Ω

### Connexions

| Composant | Connexion |
|---|---|
| Potentiomètre, borne extérieure 1 | `5V` |
| Potentiomètre, curseur | `A0` |
| Potentiomètre, borne extérieure 2 | `GND` |
| Broche `8` | Résistance 220 Ω puis anode de la LED rouge |
| Cathode de la LED rouge | `GND` |

### Test et résultat attendu

Lancer la simulation et faire varier le potentiomètre. La LED reste éteinte pour
les lectures de 0 à 512 incluses. Elle s'allume uniquement lorsque la lecture est
strictement supérieure à 512, soit à partir de 513.

## Exercice 2 — Feu tricolore

### Composants

- 1 × `ARDUINO UNO R3`
- 1 × `LED-RED`
- 1 × `LED-YELLOW`
- 1 × `LED-GREEN`
- 3 × `MINIRES` de 220 Ω

### Connexions

| Sortie Arduino | Connexion |
|---|---|
| `13` | Résistance 220 Ω puis anode de la LED rouge |
| `12` | Résistance 220 Ω puis anode de la LED jaune |
| `11` | Résistance 220 Ω puis anode de la LED verte |
| Cathode de chaque LED | `GND` |

### Test et résultat attendu

Après le démarrage, une seule LED est allumée à la fois. Le cycle attendu est :

1. vert pendant 3 secondes ;
2. jaune pendant 1 seconde ;
3. rouge pendant 3 secondes ;
4. reprise immédiate du même cycle.

La durée totale d'un cycle est de 7 secondes.

## Exercice 3 — Commande manuelle d'éclairage

### Composants

- 1 × `ARDUINO UNO R3`
- 1 × `BUTTON`
- 1 × `LED-BLUE`
- 1 × `MINIRES` de 10 kΩ pour le pull-down
- 1 × `MINIRES` de 220 Ω pour la LED

### Connexions

| Composant | Connexion |
|---|---|
| Une borne du bouton | `5V` |
| Autre borne du bouton | `2` |
| Résistance pull-down 10 kΩ | Entre la broche `2` et `GND` |
| Broche `7` | Résistance 220 Ω puis anode de la LED bleue |
| Cathode de la LED bleue | `GND` |

Le programme utilise `INPUT`, car la résistance pull-down est externe. Au repos,
elle impose un niveau `LOW` stable sur la broche 2. Pendant l'appui, le bouton
relie la broche 2 au `5V`, donc la lecture devient `HIGH`.

### Test et résultat attendu

Maintenir le bouton de Proteus enfoncé : la LED bleue doit s'allumer. Relâcher le
bouton : la LED doit s'éteindre immédiatement. Il n'y a pas de mémorisation.

## Exercice 4 — Contrôle angulaire d'un servomoteur

### Composants

- 1 × `ARDUINO UNO R3`
- 1 × `POT-HG`
- 1 × `MOTOR-SERVO`

### Connexions

| Composant | Connexion |
|---|---|
| Potentiomètre, borne extérieure 1 | `5V` |
| Potentiomètre, curseur | `A0` |
| Potentiomètre, borne extérieure 2 | `GND` |
| Servomoteur, signal | Broche PWM `9` |
| Servomoteur, alimentation positive | `5V` |
| Servomoteur, masse | `GND` |

Dans un montage réel, un servomoteur peut demander plus de courant que le
régulateur de la carte ne peut fournir. Une alimentation 5 V externe adaptée est
alors recommandée, avec sa masse reliée au `GND` de l'Arduino. Pour le modèle de
simulation Proteus, les connexions ci-dessus suffisent.

### Test et résultat attendu

Faire varier le potentiomètre d'une extrémité à l'autre. Le servomoteur doit
suivre progressivement une consigne comprise entre 0° et 180°. Les points de
contrôle théoriques sont :

| Lecture sur A0 | Angle demandé |
|---:|---:|
| 0 | 0° |
| environ 512 | environ 90° |
| 1023 | 180° |

## Compilation dans Arduino IDE

Répéter ces étapes pour chaque exercice.

1. Ouvrir le fichier `.ino` voulu dans Arduino IDE. Le fichier et son dossier
   portent déjà le même nom, comme l'exige l'IDE.
2. Pour l'exercice 4 uniquement, vérifier que la bibliothèque standard
   `Servo` est disponible (`Croquis` → `Inclure une bibliothèque` → `Servo`).
3. Choisir `Outils` → `Type de carte` → `Arduino AVR Boards` →
   `Arduino Uno`.
4. Cliquer sur **Vérifier** pour compiler et contrôler l'absence d'erreur.
5. Choisir `Croquis` → `Exporter les binaires compilés`. Arduino IDE place
   alors un fichier `.hex` dans le dossier du sketch.

Si plusieurs fichiers HEX sont créés, utiliser de préférence celui dont le nom
se termine simplement par `.ino.hex`, sans `with_bootloader`.

## Chargement du HEX dans Proteus ISIS

1. Réaliser le schéma de l'exercice avec les composants et connexions indiqués.
2. Double-cliquer sur `ARDUINO UNO R3`.
3. Dans **Program File**, parcourir les fichiers et sélectionner le `.ino.hex`
   de l'exercice.
4. Régler **Clock Frequency** sur 16 MHz si cette valeur n'est pas déjà définie.
5. Valider avec **OK**, puis lancer la simulation avec le bouton **Run**.
6. Effectuer le test décrit dans la section de l'exercice et prendre une capture
   lisible du schéma et du résultat.

Après chaque nouvelle modification du code, il faut réexporter le binaire puis
vérifier que Proteus utilise bien le nouveau fichier HEX.

## Vérification des programmes

Les quatre sketches ont été compilés sans erreur pour la carte
`arduino:avr:uno` avec Arduino CLI 1.5.1 et le cœur Arduino AVR 1.8.8.
L'exercice 4 a été vérifié avec la bibliothèque Servo 1.3.0. Cette compilation
valide la syntaxe et les bibliothèques, mais ne remplace pas les essais Proteus.

## Éléments à compléter manuellement

Proteus ISIS n'est pas disponible dans cet environnement. Les schémas `.pdsprj`,
les simulations et les captures ne sont donc pas fabriqués dans ce dossier. Pour
finaliser la remise :

1. construire les quatre schémas dans Proteus ;
2. charger chaque HEX et exécuter les essais indiqués ;
3. prendre des captures d'écran claires ;
4. remplacer, dans le rapport, les cadres de capture et les observations à
   compléter par les résultats réellement constatés ;
5. renseigner le nom, le prénom, la filière et l'année universitaire ;
6. réexporter le rapport sous le nom `Nom_Prenom_Examen_TP_Arduino.pdf`, en
   remplaçant `Nom_Prenom` par l'identité de l'étudiant ;
7. envoyer le PDF à `aymaneboumezzough23@gmail.com` avec l'objet
   `Examen TP Arduino – Nom Prénom`.

Le sujet indique comme date limite le dimanche 20 septembre 2026 à 23 h 59 et
précise que tout envoi ultérieur est considéré en retard.

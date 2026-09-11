/*
 * Exercice 2 - Gestion d'un feu tricolore
 * Rouge : D13, jaune : D12, vert : D11
 */

const byte BROCHE_ROUGE = 13;
const byte BROCHE_JAUNE = 12;
const byte BROCHE_VERTE = 11;

// Cette fonction garantit qu'une seule couleur est allumée à la fois.
void afficherFeu(bool rouge, bool jaune, bool vert) {
  digitalWrite(BROCHE_ROUGE, rouge ? HIGH : LOW);
  digitalWrite(BROCHE_JAUNE, jaune ? HIGH : LOW);
  digitalWrite(BROCHE_VERTE, vert ? HIGH : LOW);
}

void setup() {
  pinMode(BROCHE_ROUGE, OUTPUT);
  pinMode(BROCHE_JAUNE, OUTPUT);
  pinMode(BROCHE_VERTE, OUTPUT);

  afficherFeu(false, false, false);
}

void loop() {
  afficherFeu(false, false, true);  // Vert seul
  delay(3000);

  afficherFeu(false, true, false);  // Jaune seul
  delay(1000);

  afficherFeu(true, false, false);  // Rouge seul
  delay(3000);
}

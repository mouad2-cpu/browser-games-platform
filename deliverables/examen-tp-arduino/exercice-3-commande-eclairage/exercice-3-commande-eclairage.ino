/*
 * Exercice 3 - Commande manuelle d'éclairage
 * Bouton avec résistance pull-down externe : D2
 * LED bleue                                : D7
 */

const byte BROCHE_BOUTON = 2;
const byte BROCHE_LED = 7;

void setup() {
  // INPUT est utilisé, car la résistance pull-down de 10 kΩ est externe.
  pinMode(BROCHE_BOUTON, INPUT);
  pinMode(BROCHE_LED, OUTPUT);
}

void loop() {
  const bool boutonAppuye = (digitalRead(BROCHE_BOUTON) == HIGH);

  // La LED reproduit directement l'état du bouton.
  digitalWrite(BROCHE_LED, boutonAppuye ? HIGH : LOW);
}

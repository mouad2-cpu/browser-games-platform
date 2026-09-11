/*
 * Exercice 1 - Détecteur de seuil analogique
 * Potentiomètre : A0
 * LED rouge     : D8
 */

const byte BROCHE_POTENTIOMETRE = A0;
const byte BROCHE_LED = 8;
const int SEUIL = 512;

void setup() {
  pinMode(BROCHE_LED, OUTPUT);
}

void loop() {
  // Le convertisseur analogique-numérique fournit une valeur de 0 à 1023.
  const int valeurPotentiometre = analogRead(BROCHE_POTENTIOMETRE);

  // La consigne impose une comparaison strictement supérieure à 512.
  if (valeurPotentiometre > SEUIL) {
    digitalWrite(BROCHE_LED, HIGH);
  } else {
    digitalWrite(BROCHE_LED, LOW);
  }
}

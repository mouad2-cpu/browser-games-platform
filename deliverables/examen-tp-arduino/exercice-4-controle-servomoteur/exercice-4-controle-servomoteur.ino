/*
 * Exercice 4 - Contrôle angulaire d'un servomoteur
 * Potentiomètre : A0
 * Signal servo  : D9
 */

#include <Servo.h>

const byte BROCHE_POTENTIOMETRE = A0;
const byte BROCHE_SERVO = 9;

Servo servomoteur;

void setup() {
  servomoteur.attach(BROCHE_SERVO);
}

void loop() {
  const int valeurPotentiometre = analogRead(BROCHE_POTENTIOMETRE);

  // Conversion linéaire de la plage 0-1023 vers la plage 0-180 degrés.
  const int angle = map(valeurPotentiometre, 0, 1023, 0, 180);
  servomoteur.write(angle);

  // Petite temporisation pour laisser au servomoteur le temps de se déplacer.
  delay(15);
}

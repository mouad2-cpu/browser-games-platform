#include <Servo.h>

const int potentiometerPin = A0;
const int servoPin = 9;

Servo myServo;

void setup() {
  // Association du signal du servomoteur à la broche 9.
  myServo.attach(servoPin);
}

void loop() {
  // Lecture de la position du potentiomètre.
  int analogValue = analogRead(potentiometerPin);

  // Conversion de 0-1023 vers un angle de 0-180 degrés.
  int angle = map(analogValue, 0, 1023, 0, 180);

  // Application de l'angle au servomoteur.
  myServo.write(angle);
}

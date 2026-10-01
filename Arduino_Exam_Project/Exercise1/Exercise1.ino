const int potentiometerPin = A0;
const int ledPin = 8;

void setup() {
  // La LED est commandée par la broche 8.
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Lecture du potentiomètre entre 0 et 1023.
  int analogValue = analogRead(potentiometerPin);

  // La LED s'allume seulement au-dessus du seuil 512.
  if (analogValue > 512) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}

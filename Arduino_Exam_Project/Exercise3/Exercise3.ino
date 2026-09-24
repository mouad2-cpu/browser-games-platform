const int buttonPin = 2;
const int ledPin = 7;

void setup() {
  // Le bouton utilise une résistance pull-down externe de 10 kΩ.
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // La lecture vaut HIGH uniquement pendant l'appui.
  int buttonState = digitalRead(buttonPin);

  if (buttonState == HIGH) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}

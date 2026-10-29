## Aufgabe: Das Thermometer

Vervollständige die Klasse `Thermometer`:

1. Der Getter `celsius` gibt `#celsius` zurück.
2. Der Setter `celsius` speichert den neuen Wert. Ist er kleiner als `-273.15`, wirf einen Fehler mit `throw new Error("Zu kalt!")`. Der alte Wert bleibt dann erhalten.
3. Der Getter `fahrenheit` **berechnet** den Wert aus `#celsius`: `celsius * 9 / 5 + 32`. Er hat keinen Setter.

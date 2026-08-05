# BaustellenHub Roadmap

Eine eigenständige, responsive Roadmap-Website für das JuH-Burmeister-Projekt.

## Inhalt

- hochwertiges Dark-/Light-Design
- Projektfortschritt
- Entwicklungsphasen
- Kanban-Aufgabenübersicht
- bekannte Probleme
- Feedback-Dialog
- mobile Optimierung
- GitHub-Pages-Workflow

## Feedback-E-Mail eintragen

Öffne `script.js` und ändere:

```js
feedbackEmail: "DEINE-EMAIL@BEISPIEL.DE",
```

zu deiner echten E-Mail-Adresse.

## Inhalte ändern

Die Texte, Prozentwerte und Aufgaben stehen direkt in der `index.html`.

Wichtige Stellen:

- Gesamtfortschritt: `--progress: 68`
- Version: `v0.9 Beta`
- Datum: `05.08.2026`
- Roadmap-Phasen im Abschnitt `id="roadmap"`
- Aufgaben im Abschnitt `id="aufgaben"`

## Lokal starten

Die `index.html` kann direkt im Browser geöffnet werden.

Sauberer ist ein lokaler Server:

```bash
python -m http.server 8000
```

Danach:

```text
http://localhost:8000
```

## GitHub Pages veröffentlichen

1. Neues GitHub-Repository erstellen.
2. Alle Dateien in das Repository hochladen.
3. In GitHub zu `Settings` → `Pages` wechseln.
4. Unter `Build and deployment` als Quelle `GitHub Actions` auswählen.
5. Änderungen auf den Branch `main` pushen.
6. Der enthaltene Workflow veröffentlicht die Seite automatisch.

## Eigene Domain

Eine eigene Domain kann später unter:

`Settings` → `Pages` → `Custom domain`

eingetragen werden.

## Sicherheit

Die Seite enthält keine Datenbank und speichert keine Feedbackdaten.
Das Feedbackformular öffnet das lokale E-Mail-Programm des Nutzers.

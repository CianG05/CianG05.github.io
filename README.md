# BaustellenHub Roadmap v2

Diese Version ist bewusst nicht als reine Design-Demo gebaut, sondern als pflegbare Roadmap.

## Was jetzt besser ist

- Inhalte liegen zentral in `roadmap.json`
- Erledigte Aufgaben werden sichtbar abgehakt und durchgestrichen
- Status kann auf `planned`, `in_progress` oder `done` gesetzt werden
- Fortschritt berechnet sich automatisch aus den Aufgaben
- Feedback kann als GitHub-Issue erstellt werden
- zusätzliches E-Mail-Feedback ist möglich
- einfache Pflegeansicht unter `editor.html`
- GitHub Pages Deployment ist vorbereitet

## 1. Dateien in einen Codespace bekommen

Falls Drag-and-drop im Codespace nicht funktioniert:

### Variante A: ZIP hochladen und entpacken

1. ZIP aus ChatGPT herunterladen.
2. In GitHub im Repository auf `Add file` → `Upload files`.
3. ZIP-Dateien lokal entpacken.
4. Die entpackten Dateien über die normale GitHub-Webseite hochladen.

### Variante B: Über das Codespace-Terminal

Im Codespace-Terminal:

```bash
git clone DEINE_REPOSITORY_URL .
```

Wenn das Repository schon geöffnet ist, kopiere die Dateien lokal in den Projektordner oder lade sie über GitHub Web hoch.

Danach:

```bash
git add .
git commit -m "Roadmap Website hinzufügen"
git push
```

## 2. Konfiguration eintragen

Öffne `config.js`:

```js
window.ROADMAP_CONFIG = {
  githubOwner: "DEIN-GITHUB-NAME",
  githubRepo: "DEIN-REPOSITORY-NAME",
  feedbackEmail: "DEINE-EMAIL@BEISPIEL.DE"
};
```

## 3. Roadmap aktuell halten

Die komplette Roadmap wird in `roadmap.json` gepflegt.

Statuswerte:

```json
"status": "planned"
```

```json
"status": "in_progress"
```

```json
"status": "done"
```

Sobald du eine Aufgabe auf `done` setzt, wird sie auf der Website sichtbar abgehakt und durchgestrichen.

Zusätzlich kannst du `editor.html` öffnen, die JSON-Datei bearbeiten, prüfen und neu herunterladen.

## 4. Feedback vom Chef

Der Button „Feedback geben“ erstellt ein neues GitHub-Issue.

Voraussetzungen:

- GitHub Issues müssen im Repository aktiviert sein.
- Dein Chef braucht für diese Variante ein GitHub-Konto.

Ohne GitHub-Konto kann er den E-Mail-Link im Feedbackfenster verwenden.

## 5. GitHub Pages aktivieren

1. Repository öffnen.
2. `Settings` → `Pages`.
3. Unter `Build and deployment` die Quelle `GitHub Actions` auswählen.
4. Auf `main` pushen.

## Wichtige Grenze

Eine kostenlose statische GitHub-Pages-Seite kann nicht direkt selbst Dateien im Repository ändern. Deshalb werden Änderungen entweder:

- in `roadmap.json` über GitHub vorgenommen,
- über `editor.html` vorbereitet und anschließend hochgeladen,
- oder als GitHub-Issue vom Chef eingereicht.

Für eine echte Anmeldung mit direktem Speichern im Browser wäre ein Backend wie Supabase nötig.

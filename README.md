# BaustellenHub Roadmap v3

## Funktionen

- echte Verwaltungsoberfläche unter `editor.html`
- direkte Speicherung in `roadmap.json` über die GitHub Contents API
- jede Speicherung erzeugt einen Git-Commit
- Gesamtfortschritt wird automatisch aus allen Aufgaben berechnet
- Meilensteinfortschritt wird automatisch aus zugeordneten Aufgaben berechnet
- erledigte Aufgaben werden sichtbar abgehakt
- Feedback über GitHub Issues oder E-Mail
- automatische Veröffentlichung über GitHub Pages

## Konfiguration

In `config.js` eintragen:

```js
window.ROADMAP_CONFIG = {
  githubOwner: "DEIN-GITHUB-NAME",
  githubRepo: "DEIN-REPOSITORY-NAME",
  githubBranch: "main",
  roadmapPath: "roadmap.json",
  feedbackEmail: "DEINE-EMAIL@BEISPIEL.DE"
};
```

## Direkte Speicherung aktivieren

Erstelle in GitHub ein Fine-grained Personal Access Token:

1. GitHub → Settings
2. Developer settings
3. Personal access tokens
4. Fine-grained tokens
5. Zugriff nur auf das Roadmap-Repository
6. Repository permission `Contents: Read and write`
7. Ein kurzes Ablaufdatum setzen

Das Token wird im Editor eingegeben und nur im `sessionStorage` des aktuellen Tabs gespeichert.

**Das Token niemals in `config.js`, GitHub oder Quellcodedateien eintragen.**

## Fortschrittsberechnung

Jede Aufgabe besitzt:

```json
"progress": 60
```

Der Wert liegt zwischen 0 und 100.

- Gesamtfortschritt = arithmetischer Durchschnitt aller Aufgabenfortschritte
- Meilensteinfortschritt = Durchschnitt aller zugeordneten Aufgaben
- Status `done` setzt den Wert automatisch auf 100
- Fortschritt unter 100 ändert einen erledigten Eintrag wieder auf `in_progress`

Damit gibt es keine frei erfundene Gesamtzahl.

## Feedback des Chefs

Der Chef benutzt nur die öffentliche Seite und den Feedback-Button. Er benötigt keinen Zugriff auf den Editor und darf dein Token nicht erhalten.

Für GitHub-Issues braucht er ein GitHub-Konto. Alternativ kann er Feedback per E-Mail senden.

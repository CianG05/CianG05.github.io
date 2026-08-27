JuH Baustellen Hub - Büro-Test 0.9.3.1
======================================

Dies ist eine Testversion OHNE Login-UI (SKIP_AUTH).
Nicht für Produktion verwenden.

Neu in 0.9.3.1
--------------
- Stabilere Dashboard-Feeds (Inbox + Activity parallel, Fehler pro Karte)
- Benachrichtigungs-Inbox konsistent (Badge/Liste, ID-Dedup)
- OneDrive-Dateilisten: In-Flight-Dedup (weniger Doppel-Requests)

Windows
-------
1. Ordner "Windows" komplett auf den PC kopieren (nicht nur die EXE).
2. juh_baustellenhub.exe starten.
3. Die DLLs (u. a. vcruntime140.dll / vcruntime140_1.dll) müssen neben der EXE liegen.

Android / Tablet
----------------
1. JuH-BaustellenHub_0.9.3.1_Buero-Test.apk per USB/adb installieren (Sideload).
2. Gerät muss das Backend erreichen können (WLAN / VPN).

Hinweise
--------
- Startet ohne Login und nutzt die Firmen-OneDrive-Session über das Backend.
- Internetverbindung zum Backend erforderlich.
- Branch: V.0.9.3-TEST-W/O-LOGIN
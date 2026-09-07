JuH BaustellenHub – Büro-Test Release V0.9.3.2
==============================================

Hauptfeature dieser Version
---------------------------
Einführungskurs / Einstiegskurs (Tablet): überspringbarer Kurz-Kurs beim ersten Start
(Willkommen, Name/Unterschrift, Schriftgröße). Einmalig, danach nicht erneut.

Inhalt dieses Ordners
---------------------
1) JuH Baustellen Hub Release V0.9.3.2.rar   – Windows-Büro-Test (EXE + Abhängigkeiten)
2) JuH Baustellen Hub Release V0.9.3.2.apk   – Android-Büro-Test (Tablet)
3) README.txt     – diese Datei

Windows starten
---------------
1. Die RAR-Datei vollständig entpacken (z. B. mit WinRAR) in einen eigenen Ordner.
2. Im entpackten Ordner juh_baustellenhub.exe starten.
   Wichtig: Den kompletten Ordner belassen (data\, DLLs, START-HINWEIS.txt) –
   nicht nur die EXE kopieren oder verschieben.

Android / Tablet installieren
-----------------------------
1. APK auf das Gerät übertragen.
2. Installation aus unbekannten Quellen ggf. erlauben und APK installieren.
3. App starten.

Büro-Test / SkipAuth
--------------------
Diese Builds sind Büro-Testversionen: Login-UI ist übersprungen (SkipAuth /
OFFICE_TEST_MODE). Die App verbindet sich mit dem Test-Backend und nutzt die
Firmen-OneDrive-Session. Nicht für Produktion verteilen.

Hinweise
--------
- Keine Secrets oder Zugangsdaten liegen in diesem Paket.
- Bei Windows-Meldung zu fehlender VCRUNTIME140_1.dll: siehe START-HINWEIS.txt
  im entpackten Windows-Ordner bzw. Visual C++ Redistributable x64 installieren.
- Version: V0.9.3.2
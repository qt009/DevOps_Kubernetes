# Aufgabe 4 - Spike: CI/CD

## Konzept für einen automatisierten Prozess
![Prozess](Prozess.png)

### Prozessbeginn
Unser Prozess beginnt bei der Erstellung oder Änderung des Codes im Entwicklungszweig (z.B. `feature` oder `fix` Branch). Sobald ein Entwickler eine Änderung vorgenommen hat, wird ein Merge Request erstellt. Dieser MR durchläuft Code-Reviews und automatisierte Tests, bevor er in den Hauptzweig (`Staging` oder `Production`) integriert wird.
- Production = Branch, der die aktuellste und stabile Version der Anwendung enthält, die für Endbenutzer freigegeben ist.
- Staging = Branch, der eine Vorabversion der Anwendung enthält, die für Tests und Qualitätskontrollen verwendet wird, bevor sie in den Production Branch integriert wird.

### Automatisierte Schritte
Die Änderungen müssen ggf. gebaut, auf jeden Fall getestet und bei erfolgreichen Tests deployed werden.

### Branching Strategie
Man verwendet separate, vom `Staging` Branch aus erstellte Branches für jede Änderung. Hier arbeitet man an den Änderungen und erstellt, wenn diese abgeschlossen sind, einen Merge Request auf den `Staging` Branch und ggf. wenn es in Production gebracht werden soll, einen Merge Request von Staging auf `Production`.

### GitLab Pipelines
Man verwendet GitLab Pipelines, um die notwendigen automatisierten Schritte auszuführen. Hierbei handelt es sich um:
- Build
- Test
- Deploy

### Deployment Strategie
Im Endeffekt macht es wenig Unterschied, für welche wir uns entscheiden, da wir ja im Rahmen eines Praktikums arbeiten und somit keine Nutzer haben bzw. Punkte wie Downtime in Kauf nehmen können.

Mögliche Strategien, die Sinn machen:
- Recreate Deployment
    - Die alte Version der Anwendung wird vollständig gestoppt und die neue Version wird gestartet.
    - Warum?
        - Einfachste Implementierung
        - Downtime kann in Kauf genommen werden
- Blue-Green Deployment
    - Zwei identische Produktionsumgebungen (Blue und Green) werden verwendet. Die neue Version wird in der inaktiven Umgebung (z.B. Green) bereitgestellt und nach erfolgreichem Testen wird der Traffic umgeschaltet.
    - Warum?
        - Keine Downtime, einfache Rollbacks
        - Kosten für doppelte Infrastruktur kann man in Kauf nehmen, da wir sowieso ein kleines Projekt mit kaum Kosten haben
        
## Technischer Durchstich

### Implementierung
![Pipeline](Pipeline.png)
![Pipeline Text](Pipeline_File.png)
- Der `build` Job ist ein Placeholder, da wir nichts bauen müssen momentan.
- Der `test` Job führt die Tests von `Kubeconform` durch, die die aktualisierten Manifests im Manifests Ordner überprüfen.
- Der `deploy` Job ist ein Placeholder, da der GitLab Agent noch nicht funktioniert.

### GitLab Agent
![GitLab Agent](gitlabagent.png)

(Wir verwenden einen GitLab Agent in unserem Kubernetes Cluster, der in einem Pod in einem eigenen Namespace läuft, um Änderungen zu deployen.)

### Beispieländerung
![Test_Beispiel](Test_Beispiel.png)
Beispiel mit fehlerhafter Manifest Datei.

### Probleme
Welche Probleme sind aufgetreten?
- GitLab Agent Pods im Cluster haben keine Verbindung zum GitLab Agent, somit kann nicht automatisch deployed werden.
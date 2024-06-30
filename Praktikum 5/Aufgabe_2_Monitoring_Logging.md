
# Aufgabe 2 - Spike: Monitoring & Logging

**Ziel:**
Ein effizientes und anpassungsfähiges Monitoring- und Logging-Konzept für eine K8s Umgebung erstellen, das sowohl Applikationsdaten als auch Clusterdaten erfasst, speichert, überwacht und analysiert.

**Fragen:**

1. **Was soll überwacht / geloggt werden?**
   - **Überwacht werden:**
     - CPU- und Speicherauslastung der Nodes und Pods.
     - Zustand der K8s-Cluster-Komponenten (z.B. API-Server, etcd, Kubelet).
     - Netzwerk-Traffic und Latenzzeiten.
     - Status und Events der Deployments, StatefulSets, Jobs, etc.
   - **Geloggte Daten:**
     - Applikations-Logs (z.B. Fehler, Warnungen, Informationslogs).
     - System- und Sicherheitslogs der Nodes und Pods.

2. **Wie und für wie lange sollen Daten gespeichert werden?**
   - **Speicherung:**
     - Kurzfristige Speicherung in einem schnell zugänglichen System (z.B. Prometheus für Monitoring-Daten, Elasticsearch für Logs).
     - Langfristige Speicherung in einem kosteneffizienten und skalierbaren System (z.B. S3-Bucket, langfristige Indizes in Elasticsearch).
   - **Speicherzeitraum:**
     - Monitoring-Daten: 30 Tage in Prometheus, 1 Jahr in langfristigem Speicher.
     - Logs: 7 Tage in Elasticsearch, 1 Jahr in langfristigem Speicher.

3. **Was sind die kritischen Metriken für das System?**
   - CPU- und Speicherauslastung.
   - Anzahl der aktiven und fehlerhaften Pods.
   - Netzwerklatenzen und -durchsatz.
   - Disk I/O und verfügbare Kapazität.
   - Fehler- und Warnmeldungen in den Applikations- und Systemlogs.

4. **Anforderungen für die Fehlerbehebung und Fehlersuche:**
   - Echtzeit-Zugriff auf aktuelle und historische Logs und Metriken.
   - Möglichkeit zur Korrelierung von Ereignissen über verschiedene Datenquellen.
   - Detaillierte Alarme und Benachrichtigungen bei kritischen Ereignissen.

5. **Reaktionszeit auf Probleme:**
   - Kritische Probleme: Innerhalb von 5 Minuten.
   - Nicht-kritische Probleme: Innerhalb von 30 Minuten bis 1 Stunde.

6. **Anforderungen hinsichtlich Skalierung, Performance und Security:**
   - **Skalierung:** Automatische Skalierung der Monitoring- und Logging-Infrastruktur basierend auf der Last.
   - **Performance:** Geringe Latenzzeiten bei der Datenabfrage und -analyse.
   - **Security:** Verschlüsselte Übertragung und Speicherung der Daten, rollenbasierte Zugriffssteuerung (RBAC).

**Use Cases:**

1. **Use Case 1: Überwachung der Applikations-Performance**
   - **Data Flow:** Daten werden von Prometheus erfasst und in einer Time-Series-Datenbank gespeichert. Grafana visualisiert die Daten in Dashboards.
   - **Datenschutz & Sicherheit:** Daten werden verschlüsselt gespeichert und Zugriffe über RBAC geregelt.
   - **Skalierbarkeit & Performance:** Prometheus und Grafana können horizontal skaliert werden.
   - **Alerting & Notifications:** Alerts werden bei Überschreiten von Schwellenwerten ausgelöst und über Slack benachrichtigt.
   - **Reporting:** Wöchentliche Berichte über die Performance der Applikation werden automatisch generiert und per E-Mail verschickt.

2. **Use Case 2: Fehlerbehebung bei Systemausfällen**
   - **Data Flow:** Logs werden von Fluentd gesammelt und an Elasticsearch gesendet. Kibana dient als Frontend zur Analyse.
   - **Datenschutz & Sicherheit:** Logs sind durch Verschlüsselung und RBAC geschützt.
   - **Skalierbarkeit & Performance:** Elasticsearch und Kibana können je nach Bedarf skaliert werden.
   - **Alerting & Notifications:** Fehlerhafte Events triggern Alarme, die an das Incident Response Team gesendet werden.
   - **Reporting:** Tägliche Zusammenfassung von Fehlern und Warnungen wird generiert und an das DevOps-Team gesendet.

3. **Use Case 3: Langzeit-Analyse von Clusterdaten**
   - **Data Flow:** Langfristige Metriken werden von Prometheus in S3 exportiert.
   - **Datenschutz & Sicherheit:** Daten sind im S3-Bucket verschlüsselt und durch IAM-Rollen geschützt.
   - **Skalierbarkeit & Performance:** S3 bietet nahezu unbegrenzte Speicherkapazität.
   - **Alerting & Notifications:** Bei Anomalien in den historischen Daten werden automatische Benachrichtigungen gesendet.
   - **Reporting:** Monatliche Berichte über Cluster-Health und Auslastung werden erstellt und an die IT-Leitung verschickt.

**Technischer Durchstich:**
Implementierung eines Proof-of-Concept für die Überwachung der Applikations-Performance mit Prometheus und Grafana, inklusive Dashboards und Alarmeinstellungen. 

**Integrierte Konzepte in die Review Präsentation:**
- Detaillierte Darstellung des Monitoring- und Logging-Konzeptes.
- Demonstration des Prototyps inklusive Live-Demo der Dashboards und Alerts.
- Begründung der gewählten Technologien und Architekturen.

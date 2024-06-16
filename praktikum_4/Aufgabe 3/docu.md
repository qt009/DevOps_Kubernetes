# Aufgabe 3 - StatefulSet

## Hilfreiche Links
- [StatefulSet-Konzept](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [Grundlegendes StatefulSet-Tutorial](https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/)

## Aufgabenbeschreibung

1. **Vorbereitung**
    - Informieren Sie sich vorab über die aktuellen Versionen des nginx Images.
        - Die neueste Version ist 1.27.0, aber wir verwenden ein älteres Image, zum Beispiel 1.19.3.
    - Erstellen Sie ein StatefulSet bestehend aus 2 Replicas und nutzen Sie dafür ein etwas älteres nginx Image.
        - [k8s_stateful_set_create_2_replicas.yaml](k8s_stateful_set_create_2_replicas.yaml)
    - Beachten Sie dabei die [StatefulSet Limitations](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#limitations).
    - Provisionieren Sie bereits vorab 4 entsprechende PVs (Persistent Volumes).
        - [k8s_add_pc_and_pvc.yaml](k8s_add_pc_and_pvc.yaml)
    - Denken Sie an die Erstellung eines Headless Service.
        - [k8s_stateful_set_create_headless_service.yaml](k8s_stateful_set_create_headless_service.yaml)

2. **Implementierung**
    - Kontrollieren Sie die erfolgreiche Provisionierung Ihrer Ressourcen mittels `kubectl get all` und `get pvc`.
    - Ich musste noch ein nginx-service yaml geschrieben auf Grund von Verbindungsproblemen: [nginx-service.yaml](nginx-service.yaml)

3. **Laufzeitmodifikationen**
    - Verändern Sie die `index.html` Ihrer nginx Instanzen zur Laufzeit, indem Sie z.B. einen bestimmten String in die jeweilige `index.html` injecten.
        - `kubectl exec -it <pod-name> -- /bin/sh` und `echo "Modified content" > /usr/share/nginx/html/index.html`
    - Kontrollieren Sie mittels `curl`, dass die nginx Webserver ihre modifizierten Daten ausliefern.
        - Ich musste port-forwarding machen, da es Probleme mit dem Netzwerk gab.
        - `kubectl port-forward svc/nginx-service 8080:80`
    - Löschen Sie die Pods (nicht das StatefulSet) und warten Sie, bis die Pods wieder laufen.
        - `kubectl delete pod <pod-name>`
    - Überprüfen Sie nochmals mittels `curl`, dass die nginx Webserver ihre modifizierten Daten ausliefern.
        - ![Screenshot]('Screenshot 2024-06-13 214919.png')

4. **Skalierung**
    - Skalieren Sie das StatefulSet auf 4 Replicas, dann auf 1 Replica und schließlich wieder auf 2 Replicas.
    - Beobachten Sie dabei die geordnete und sequentielle Reihenfolge der Instantiierung und kontrollieren Sie jeweils, welche Daten die nginx Webserver ausliefern.
    - Modifizieren Sie gegebenenfalls die `index.html` der "neuen" Replicas erneut.

5. **Update**
    - Ändern Sie abschließend das nginx Image auf eine neuere Version.
    - Beobachten Sie (zum Beispiel mit dem `WATCH` Flag), wie sich das Update mit der RollingUpdate Strategie verhält.
    - Inwiefern unterscheidet sich das StatefulSet bezüglich Update und Skalieren von einem Deployment?


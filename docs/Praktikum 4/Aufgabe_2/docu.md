## Aufgabe 2 - Persistent Volumes

### 1. Local Volume vorbereiten
-  Entscheidung und Vorbereitung (Disk, Partition oder Directory).
  - Disk:
    - Pro: Hohe Speicherkapazität, gute Performance.
    - Contra: Höhere Kosten, erfordert physische Installation, weniger flexibel in Cloud-Umgebungen.
  - Partition:
    - Pro: Flexibel, keine zusätzliche Hardware erforderlich.
    - Contra: Begrenzte Kapazität, kann die Performance anderer Partitionen beeinflussen, weniger geeignet für dynamische Cloud-Umgebungen.
  - Directory:
    - Pro: Einfach einzurichten, keine zusätzlichen Kosten.
    - Contra: Abhängig von der bestehenden Speicherstruktur, möglicherweise geringere Performance, weniger robust in verteilten Cloud-Umgebungen.

Entscheidung für Directory getroffen.
-  `mkdir /mnt/data`

### 2. PersistentVolume (PV) erstellen
-  PV vom Typ local mit Reclaim Policy "Retain" erstellen.
    - Siehe PersistentVolume.yaml
    - `kubectl apply -f PersistentVolume.yaml`

### 3. StorageClass erstellen
-  Passende StorageClass erstellen.
    - Siehe storage_class.yaml
    - `kubectl apply -f storage_class.yaml`

### 4. PersistentVolumeClaim (PVC) erstellen
-  PVC erstellen und Status prüfen.
    - Siehe persistent_volume_claim.yaml
    - `kubectl apply -f persistent_volume_claim.yaml`
    - `kubectl get pvc local-pvc`

### 5. Pod erstellen
-  Pod mit PVC erstellen.
    - Siehe pod.yaml
    - `kubectl apply -f pod.yaml`

### 6. Datei im Container erstellen
-  Datei `persistence.txt` im Container erstellen.
    - Siehe pod.yaml
    - `kubectl exec -it pvc-pod -- sh`
    - `echo "TO infinity and beyond!" > mnt/data/persistence.txt`
    - `exit`

Problem:
-  `/mnt/data` war auf worker1 nicht vorhanden, da ich es auf dem Master erstellt habe -> Per SSH auf worker1 und `mkdir -p /mnt/data`

### 7. Datei auf Workernode überprüfen
-  Datei auf Workernode überprüfen.
    - `kubectl exec -it pvc-pod -- sh`
    - `cat mnt/data/persistence.txt`
    - `exit`   
        - Datei wurde angelegt

### 8. Pod löschen und PV/PVC überprüfen
-  Verhalten von PV und PVC nach Pod-Löschung überprüfen.
    - `kubectl delete pvc-pod`
    - `kubectl get pv`
    - `kubectl get pvc`
        - PV bleibt bestehen, da Reclaim Policy `Retain`
        - PVC bleibt bestehen

### 9. Pod neu instantiieren und Datei überprüfen
-  Verhalten der Datei nach Pod-Neuinstanziierung überprüfen.
    - `kubectl apply -f pod.yaml`
    - `kubectl exec -it pvc-pod -- cat /mnt/data/persistence.txt`
        - Datei bleibt erhalten

### 10. Zweiten Pod instantiieren
-  Zweiten Pod mit PVC instantiieren und testen.
-  Siehe pvc-pod2
    - `kubectl apply -f pvc-pod2.yaml`
    - `kubectl exec -it pvc-pod -- sh`
    - `echo "File from first pod" > /mnt/data/file1.txt`
    - `exit`

    - `kubectl exec -it pvc-pod-2 -- sh`
    - `echo "File from second pod" > /mnt/data/file2.txt`
    - `exit`

Welche Access Mode Konfiguration setzt dies voraus?
 - Access Mode: ReadWriteOnce (RWO) erlaubt nur einem Pod zur gleichen Zeit Schreibzugriff. Für gleichzeitigen Zugriff von mehreren Pods benötigt man ReadWriteMany (RWX), was bei local Volumes nicht unterstützt wird.

Angenommen beide Pods hätten Schreib-Lese-Rechte auf der PV: welche Probleme könnten dadurch entstehen?
-  Dateninkonsistenz: Wenn beide Pods gleichzeitig Schreibzugriff haben, könnten Dateninkonsistenzen auftreten.
-  Locking-Probleme: Ohne ordnungsgemäßes Locking könnten Schreiboperationen einander überschreiben.

### 11. Pods und PVC löschen
-  Pods und PVC löschen, Status der PV und Inhalt des Volumes überprüfen.
    - `kubectl delete pvc-pod`
    - `kubectl delete pvc-pod-2`
    - `kubectl delete pvc local-pvc`
    - `kubectl get pv local-pv`
    - `ls /mnt/data` auf worker1
        - Dateien sind noch vorhanden

### 12. Neuen PVC und Pod erstellen
-  Neuen PVC und Pod erstellen, Reclaim Policy beachten.
-  Siehe new-pvc-pod.yaml und persistent_volume_claim_new.yaml
    - `kubectl apply -f persistent_volume_claim_new.yaml`
    - `kubectl apply -f new-pvc-pod.yaml`
    -Problem: Der Pod startet nicht, da der PVC nicht an den PV gebunden ist.
    - Lösung: PV neu erstellen mit claimRef, siehe pvtest.yaml
        - `kubectl apply -f pvtest.yaml`
-  Änderungen im YAML:
    ```yaml
    claimRef:
      namespace: default
      name: new-local-pvc
    ```

Schritte, um dem neuen Pod Zugriff auf die erstellten Dateien in der "alten" Volume zu geben:
-  Änderungen im PV YAML:
  ```yaml
  claimRef:
    namespace: default
    name: new-local-pvc
  ```
## Bonusaufgabe

### 13. Dynamic Volume Provisioning realisieren
-  Storage Provisioner und entsprechende StorageClass einrichten.
-  Beispiel: Eigenen externen NFS-Provisioner (z. B. Ganesha-Server) verwenden.
-  Alternativ: Cloud Provider CSI verwenden.
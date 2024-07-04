# User Management Web Application on Kubernetes

App: Simple Web UI to add/view/delete users

Communicates with a DB in backend

wie man die App baut: siehe Applikation readme Datei



## YAML Files and Their Functionality

### `app.yaml`
- **Deployment**: Creates a deployment named `web-app` with 3 replicas.
- **Container**: Uses the `registry.code.fbi.h-da.de/kubermates/devops-kubernetes/web-app:v1.4` image.

### `db.yaml`
- **StatefulSet**: Creates a stateful set named `mongodb`.
- **Service**: Associates with `mongodb-service`.
- **Ports**: Exposes port 27017.
- **Environment Variables**: Configures MongoDB credentials from Secrets.

### `services.yaml`
- **Web App Service**: Exposes the web app on port 80 via NodePort 30080.
- **MongoDB Service**: Exposes MongoDB on port 27017 with a headless service (no ClusterIP).

### `configmap-secret.yaml`
- **ConfigMap**: Contains configuration settings for the web application.
- **Secret**: Contains sensitive information like database credentials.

### `pv.yaml`
- **Persistent Volume**: Creates a volume named `pv-mongodb`.
- **Capacity**: Sets storage capacity to 1Gi.

### `pv-pvc.yaml`
- **Persistent Volume**: Creates a volume named `pv-snapshot` with 1Gi of storage.
- **Persistent Volume Claim**: Requests 1Gi of storage from `pv-snapshot`.

### `db-init-script.yaml`
- **ConfigMap**: Contains the script to initialize the MongoDB database (`init-db.sh`).
- **Script Content**:
  - Reads MongoDB credentials from secrets.
  - Waits for MongoDB to be ready.
  - Checks if the admin user exists, and creates it if not.

### `db-init-job.yaml`
- **Job**: Creates a job named `db-init`.
- **Command**: Runs the `init-db.sh` script.

### `db-migration-script.yaml`
- **ConfigMap**: Contains the script to migrate the MongoDB database (`migrate-db.sh`).
- **Script Content**:
  - Reads MongoDB credentials from secrets.
  - Waits for MongoDB to be ready.
  - Applies migrations to create collections and indexes.

### `db-migration-job.yaml`
- **Job**: Creates a job named `db-migration`.
- **Command**: Runs the `migrate-db.sh` script.
- **PostStart Hook**: Waits for the `db-init` job to complete before starting.

### `rbac.yaml`
- There are 3 levels of access controls:
  - **visitor**: limited read access to deployments
  - **test-team**: limited read and deployment access to deployments and configmaps
  - **dev-team**: full access to every activity
- For the scope of this project all 3 of these levels are in the same namespace **_kubermates_**
- **_ServiceAccount_**, **_Role_** and **_RoleBinding_** are defined within the file

### `snapshot-script.yaml`
- **ConfigMap**: Contains the script for taking MongoDB snapshots (`snapshot-db.sh`).
- **Script Content**:
  - Reads MongoDB credentials from secrets.
  - Takes a snapshot using `mongodump` and saves it with a timestamped name.

### `snapshot-cronjob.yaml`
- **CronJob**: Runs daily at 2 AM.
- **Node Affinity**: Ensures the job runs on a specific node labeled `backup-node`.
- **Container**: Uses the `mongo:4.4` image and runs the `snapshot-db.sh` script.
- **Volume Mounts**: Mounts script and secrets volumes, and the snapshot storage volume.


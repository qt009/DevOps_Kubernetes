
## Technischer Durchstich:

### 4C's of Cloud Native Security:
1. **Code:** Good programming practices and static code analysis
2. **Container:** Using safe and signed images
3. **Cluster:** Policies and network segmentation
4. **Cloud:** IAM and encrypted communication

### Zero Trust:
1. Identity based Access
2. Least privilege
3. Continuous monitoring and verification

### Microsegmentation:
- Network policies to implement isolated networks

## Design:

1. **UI** via HTTPS
2. **API Server:** API Request from frontend and external services
3. **DB:** Persistent data storage
4. **Worker**
5. **External Service Connector:** Get data from external service

## Requirements:

1. **Redundanz und Hochverfügbarkeit:**
   - Replication control for components
   - Horizontal Pod Autoscaler

2. **Multiple Containers and Communication:**
   - Kubernetes services for communication (LoadBalancer, NodePort)
   - Ingress Controller for routing of external HTTPS traffic

3. **Data exchange via services:**
   - Definition of Services, e.g. Frontend -> API Server -> DB

4. **Requesting Data from an external Service:**
   - External Service Connector Pod (via HTTPS)

5. **Exposing data via HTTP/S**

## 4C Implementation:

1. **Code:**
   - Introduction of SonarQube for static code analysis

2. **Container:**
   - Proven base images
   - Tools like Clair or Trivy to scan images for vulnerabilities

3. **Cluster:**
   - Network policies
   - RBAC

4. **Cloud:**
   - IAM
   - TLS for the communication of all services



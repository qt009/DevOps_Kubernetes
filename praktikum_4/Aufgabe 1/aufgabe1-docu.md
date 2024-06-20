# emptyDir
- create pod with 2 containers
```yaml
    apiVersion: v1
    kind: Pod
    metadata:
    name: shared-volume-pod
    spec:
    restartPolicy: Never
    volumes:
    - name: shared-storage
    emptyDir: {}
    
    containers:
    - name: nginx-container-1
      image: nginx
      ports:
        - containerPort: 80
          volumeMounts:
            - name: shared-storage
              mountPath: /usr/share/nginx/html
    
      - name: nginx-container-2
        image: nginx
        ports:
          - containerPort: 81
            volumeMounts:
          - name: shared-storage
            mountPath: /etc/nginx/conf.d
```

- apply it

```kubectrl apply -f <datei>```

- open shell in one of the containers:

```kubectl exec -it shared-volume-pod -c nginx-container-<num> -- /bin/bash```

# ConfigMap & Secret

- configmap.yaml
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
name: my-configmap
data:
my-key: my-value
another-key: another-value
```

- secret.yaml
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
type: Opaque
data:
  username: dXNlcm5hbWU=  # 'username' base64 encoded
  password: cGFzc3dvcmQ=  # 'password' base64 encoded
```

- deploy pod-with-config-and-secret.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-config-and-secret
spec:
  containers:
    - name: nginx
      image: nginx
      volumeMounts:
        - name: config-volume
          mountPath: /etc/configmap
        - name: secret-volume
          mountPath: /etc/secret
  volumes:
    - name: config-volume
      configMap:
        name: my-configmap
    - name: secret-volume
      secret:
        secretName: my-secret
```

- apply them all
- check out the content of config & secret
```
kubectl exec pod-with-config-and-secret -- ls /etc/configmap
kubectl exec pod-with-config-and-secret -- ls /etc/secret
```

- attempt to change value of configmap
```
kubectl exec pod-with-config-and-secret -- sh -c 'echo new-value > /etc/configmap/my-key'
```
will return sh: 1: cannot create /etc/configmap/my-key: Read-only file system

- edit at runtime
```
kubectl edit configmap my-configmap
```

- restart if neccessary
```yaml
kubectrl delete pod <pod-name>
kubectrl apply -f <yaml-file>
```

# hostPath
## If using DEV environment
```yaml
minikube start minikube start --nodes 2 -p minikube
```
## ssh into node
```yaml
minikube ssh -n minikube-m02
```

### print this into node file
```yaml
sudo mkdir -p /mnt/data
echo "I am the node!" | sudo tee /mnt/data/node.txt
```

## create ```nginx-hostpath-pod.yaml``` and apply
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-hostpath-pod
spec:
  containers:
    - name: nginx
      image: nginx
      volumeMounts:
        - name: host-volume
          mountPath: /etc/data
  volumes:
    - name: host-volume
      hostPath:
        path: /mnt/data
        type: Directory
  nodeSelector:
    kubernetes.io/hostname: minikube-m02
```
## Check which node is running pod

```yaml
kubectl get pod nginx-hostpath-pod -o wide
```

## ssh into the pod
```yaml
kubectl exec -it nginx-hostpath-pod -- /bin/bash
```

### check out message
```yaml
cat /etc/data/node.txt
```

### modify
```yaml
echo "Let me out! - ctr" > /etc/data/node.txt
```
## ssh back to the node to see changed msg

## Add this into container nginx in ```nginx-hostpath-pod.yaml``` to make it readOnly
```yaml
  readOnly: true
```
## open shell in the pod and try it it:
```yaml
kubectl exec -it nginx-hostpath-pod -- /bin/bash
```
```yaml
echo "Cannot change this" > /etc/data/node.txt
```

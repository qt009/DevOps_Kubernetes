#!/bin/bash

# Define the directory containing the YAML files
CONFIG_DIR="../"

# List of YAML files to apply
declare -a yaml_files=(
  "app.yaml"
  "configMaps-and-secrets.yaml"
  "db-init-script.yaml"
  "db-init-job.yaml"
  "db-migration-script.yaml"
  "db-migration-job.yaml"
  "pv.yaml"
  "db.yaml"
  "ingress.yaml"
  "services.yaml"
  "pv-pvc-snapshot.yaml"
  "snapshot-script.yaml"
  "snapshot-cronjob.yaml"
  "rbac.yaml"
)

# delete each YAML file
for file in "${yaml_files[@]}"; do
  kubectl delete -f "${CONFIG_DIR}${file}"
done




# VERA Infrastructure (GCP)

This Terraform stack provisions the core backend services that power VERA’s co-regulation platform on Google Cloud Platform. It focuses on HIPAA/GDPR-aligned defaults, private networking, and isolated environments (dev / staging / prod).

## Architecture Overview

| Component | GCP Service | Purpose |
|-----------|-------------|---------|
| Private networking | VPC + subnet | Isolate workloads per environment, expose only through authorized load balancers/IAP. |
| Serverless API | Cloud Run (fully managed) | Runs the NestJS orchestrator (`apps/api`). |
| Background workers | Cloud Run Jobs or dedicated service | Consumes BullMQ queues and biometric pipelines (`apps/worker`). |
| Task queues & cache | Memorystore (Redis) | Queue host for BullMQ + short-lived session cache. |
| Relational store | Cloud SQL for PostgreSQL + Timescale | HIPAA-ready transactional + time-series storage. |
| Object storage | Cloud Storage buckets | Audio prompts, compliance exports, model artefacts. |
| Secrets | Secret Manager + CMEK | Store external API keys (Titan, Make.com, socials). |
| Observability | Cloud Logging, Monitoring, Trace | Auditable telemetry with export sinks to BigQuery. |

## Prerequisites

- Terraform >= 1.6.0
- Google Cloud project with billing enabled and the ability to create HIPAA-eligible resources.
- gcloud CLI authenticated (`gcloud auth application-default login`).
- Backend state bucket (recommended: `gs://vera-terraform-state`). Edit `providers.tf` before first apply.

## Usage

```bash
# 1. Copy environment template
cp env/dev.tfvars.example env/dev.tfvars

# 2. Update project/region/naming
#    Replace placeholder IDs, CIDR blocks, database tiers, etc.

# 3. Initialise Terraform
terraform init

# 4. Plan and apply
terraform plan -var-file=env/dev.tfvars
terraform apply -var-file=env/dev.tfvars
```

## Environments

Store environment-specific values under `env/<name>.tfvars`. Suggested separation:

- `dev`: minimal-cost resources, single region (e.g. `us-central1`).
- `staging`: mirrors production sizing; used for load & compliance tests.
- `prod`: multi-zone Cloud SQL, additional memorystore replicas, expanded logging retention.

## Compliance Notes

- Cloud Run, Cloud SQL, Memorystore, Cloud Storage, and Secret Manager all support HIPAA BAAs; ensure your project is covered under Google’s BAA.
- Set CMEK (Customer Managed Encryption Keys) for Cloud SQL and Cloud Storage if policy requires self-managed keys; extend Terraform modules accordingly.
- Enable VPC Service Controls + Access Context Manager to restrict data exfiltration.
- Audit logs are enabled by default; export to BigQuery or Cloud Storage for long-term retention.

## Module Layout

```
infra/terraform
├── env/
│   └── dev.tfvars.example
├── main.tf
├── providers.tf
├── variables.tf
├── outputs.tf
├── locals.tf
├── modules/
│   ├── cloud_run/
│   ├── cloud_sql/
│   ├── memorystore/
│   ├── network/
│   └── secret_manager/
└── README.md
```

Each module is intentionally minimal and should be extended as we refine the deployment (add Cloud Armor policies, Pub/Sub topics, workload identity federation, etc.).

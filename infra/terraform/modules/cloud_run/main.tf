locals {
  container_env = [for k, v in var.env_vars : {
    name  = k
    value = v
  }]

  container_secret_env = [for k, v in var.secret_env : {
    name   = k
    secret = v
  }]
}

resource "google_cloud_run_v2_service" "this" {
  name     = "${var.environment}-${var.service_name}"
  location = var.region
  project  = var.project_id
  ingress  = var.ingress
  labels   = var.labels

  template {
    service_account = var.service_account_email

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      image = var.image
      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }

      dynamic "env" {
        for_each = local.container_env
        content {
          name  = env.value.name
          value = env.value.value
        }
      }

      dynamic "env" {
        for_each = local.container_secret_env
        content {
          name = env.value.name
          value_source {
            secret_key_ref {
              secret  = env.value.secret
              version = "latest"
            }
          }
        }
      }
    }

    vpc_access {
      connector = var.vpc_connector
      egress    = "ALL_TRAFFIC"
    }
  }
}

resource "google_cloud_run_service_iam_member" "public" {
  count    = var.allow_unauthenticated ? 1 : 0
  location = var.region
  project  = var.project_id
  service  = google_cloud_run_v2_service.this.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_uri" {
  value = google_cloud_run_v2_service.this.uri
}

output "service_id" {
  value = google_cloud_run_v2_service.this.name
}

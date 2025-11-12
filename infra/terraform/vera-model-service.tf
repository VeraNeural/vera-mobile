resource "google_cloud_run_service" "vera_model_service" {
  name     = "vera-model-service"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/vera-model-service:latest"

        resources {
          limits = {
            cpu    = "4000m"
            memory = "8Gi"
          }
        }

        env {
          name  = "VERA_MODEL_PATH"
          value = "/app/vera_trained_model"
        }

        env {
          name  = "PORT"
          value = "8000"
        }

        env {
          name  = "ENV"
          value = "production"
        }
      }

      timeout_seconds = 300
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "10"
        "autoscaling.knative.dev/minScale" = "1"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "vera_model_service_public" {
  service  = google_cloud_run_service.vera_model_service.name
  location = google_cloud_run_service.vera_model_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "vera_model_service_url" {
  value = google_cloud_run_service.vera_model_service.status[0].url
}

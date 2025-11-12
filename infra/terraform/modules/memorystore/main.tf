resource "google_redis_instance" "this" {
  name           = "vera-${var.environment}-redis"
  project        = var.project_id
  region         = var.region
  tier           = var.tier
  memory_size_gb = var.memory_size_gb
  authorized_network = var.authorized_network
  transit_encryption_mode = "SERVER_AUTHENTICATION"
  labels         = var.labels

  maintenance_policy {
    weekly_maintenance_window {
      day  = "SUNDAY"
      start_time {
        hours   = 3
        minutes = 0
        nanos   = 0
      }
    }
  }
}

output "host" {
  value = google_redis_instance.this.host
}

output "port" {
  value = google_redis_instance.this.port
}

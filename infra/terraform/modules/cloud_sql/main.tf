resource "google_sql_database_instance" "this" {
  name             = "vera-${var.environment}-postgres"
  database_version = "POSTGRES_15"
  region           = var.region
  project          = var.project_id
  deletion_protection = false

  settings {
    tier = var.instance_tier

    availability_type = "ZONAL"

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.authorized_network
    }

    backup_configuration {
      enabled                        = true
      location                       = var.backup_location
      point_in_time_recovery_enabled = true
    }

    maintenance_window {
      day          = 7
      hour         = 3
      update_track = "stable"
    }

    database_flags = [
      {
        name  = "cloudsql.iam_authentication"
        value = "on"
      },
      {
        name  = "timescaledb.max_background_workers"
        value = "8"
      }
    ]

    user_labels = var.labels
  }

  depends_on = []
}

resource "google_sql_database" "app" {
  name     = "vera_core"
  instance = google_sql_database_instance.this.name
  project  = var.project_id
}

resource "google_sql_user" "service" {
  name     = "vera_service"
  instance = google_sql_database_instance.this.name
  project  = var.project_id
  password = random_password.db.result
}

resource "random_password" "db" {
  length  = 32
  special = true
}

output "instance_connection_name" {
  value = google_sql_database_instance.this.connection_name
}

output "database_user" {
  value = google_sql_user.service.name
}

output "database_password" {
  value     = random_password.db.result
  sensitive = true
}

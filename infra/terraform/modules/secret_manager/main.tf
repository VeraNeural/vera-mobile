locals {
  base_labels = {
    environment = var.environment
    managed_by  = "terraform"
    project     = "vera"
  }
}

resource "google_secret_manager_secret" "this" {
  for_each = var.secrets

  project   = var.project_id
  secret_id = "${each.key}-${var.environment}"

  replication {
    auto {}
  }

  labels = merge(local.base_labels, lookup(each.value, "labels", {}))
}

resource "google_secret_manager_secret_version" "initial" {
  for_each = { for k, v in var.secrets : k => v if try(v.value, null) != null }

  secret      = google_secret_manager_secret.this[each.key].id
  secret_data = each.value.value
}

output "secret_ids" {
  value = { for k, v in google_secret_manager_secret.this : k => v.id }
}

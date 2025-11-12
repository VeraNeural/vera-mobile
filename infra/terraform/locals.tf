locals {
  project_id  = var.project_id
  environment = var.environment

  name_prefix = "vera-${var.environment}"

  labels = merge(
    {
      project     = "vera"
      environment = var.environment
      managed_by  = "terraform"
    },
    var.labels
  )
}

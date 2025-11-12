resource "google_project_service" "required" {
  for_each = toset([
    "compute.googleapis.com",
    "run.googleapis.com",
    "vpcaccess.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "redis.googleapis.com",
    "cloudbuild.googleapis.com"
  ])

  project = var.project_id
  service = each.key
}

resource "google_service_account" "runner" {
  count        = var.service_account_email == null ? 1 : 0
  project      = var.project_id
  account_id   = "${replace(var.environment, "-", "")}-vera-runner"
  display_name = "VERA ${var.environment} Cloud Run runner"
}

module "network" {
  source       = "./modules/network"
  project_id   = var.project_id
  region       = var.region
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
  subnet_cidr  = var.subnet_cidr
  labels       = local.labels

  depends_on = [google_project_service.required]
}

module "secrets" {
  source       = "./modules/secret_manager"
  project_id   = var.project_id
  environment  = var.environment
  secrets = {
    titan-api-key = {},
    make-api-key  = {},
    asana-pat     = {},
    tiktok-token  = {},
    instagram-token = {},
    facebook-token  = {}
  }

  depends_on = [google_project_service.required]
}

module "cloud_sql" {
  source            = "./modules/cloud_sql"
  project_id        = var.project_id
  region            = var.region
  environment       = var.environment
  instance_tier     = var.sql_instance_tier
  backup_location   = var.sql_backup_location
  authorized_network = module.network.vpc_id
  labels            = local.labels

  depends_on = [google_project_service.required, module.network]
}

module "redis" {
  source             = "./modules/memorystore"
  project_id         = var.project_id
  region             = var.region
  environment        = var.environment
  tier               = var.redis_tier
  memory_size_gb     = var.redis_memory_size_gb
  authorized_network = module.network.vpc_id
  labels             = local.labels

  depends_on = [google_project_service.required, module.network]
}

resource "google_storage_bucket" "audio" {
  name          = "${local.name_prefix}-audio"
  project       = var.project_id
  location      = var.audio_bucket_location
  force_destroy = false
  storage_class = "STANDARD"
  uniform_bucket_level_access = true
  labels        = local.labels

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 365
    }
  }
}

module "api_service" {
  source                = "./modules/cloud_run"
  project_id            = var.project_id
  region                = var.region
  environment           = var.environment
  service_name          = "api"
  image                 = "gcr.io/${var.project_id}/vera-api:latest"
  service_account_email = coalesce(var.service_account_email, try(google_service_account.runner[0].email, null))
  vpc_connector         = module.network.serverless_connector
  ingress               = "ALLOW_INTERNAL_AND_GCLB"
  min_instances         = 1
  max_instances         = 5
  cpu                   = "2"
  memory                = "2Gi"
  env_vars = {
    NODE_ENV                = var.environment
    DATABASE_INSTANCE       = module.cloud_sql.instance_connection_name
    REDIS_HOST              = module.redis.host
    REDIS_PORT              = tostring(module.redis.port)
    AUDIO_BUCKET            = google_storage_bucket.audio.name
    ALLOWED_ORIGINS         = join(",", var.allowed_web_origins)
  }
  secret_env = {
    TITAN_API_KEY   = module.secrets.secret_ids["titan-api-key"]
    MAKE_API_KEY    = module.secrets.secret_ids["make-api-key"]
    ASANA_PAT       = module.secrets.secret_ids["asana-pat"]
    TIKTOK_TOKEN    = module.secrets.secret_ids["tiktok-token"]
    INSTAGRAM_TOKEN = module.secrets.secret_ids["instagram-token"]
    FACEBOOK_TOKEN  = module.secrets.secret_ids["facebook-token"]
  }
  labels = local.labels

  depends_on = [google_project_service.required]
}

module "worker_service" {
  source                = "./modules/cloud_run"
  project_id            = var.project_id
  region                = var.region
  environment           = var.environment
  service_name          = "worker"
  image                 = "gcr.io/${var.project_id}/vera-worker:latest"
  service_account_email = coalesce(var.service_account_email, try(google_service_account.runner[0].email, null))
  vpc_connector         = module.network.serverless_connector
  ingress               = "ALLOW_INTERNAL_ONLY"
  min_instances         = 0
  max_instances         = 3
  cpu                   = "2"
  memory                = "1Gi"
  env_vars = {
    NODE_ENV          = var.environment
    REDIS_HOST        = module.redis.host
    REDIS_PORT        = tostring(module.redis.port)
    DATABASE_INSTANCE = module.cloud_sql.instance_connection_name
  }
  secret_env = {
    TITAN_API_KEY   = module.secrets.secret_ids["titan-api-key"]
    MAKE_API_KEY    = module.secrets.secret_ids["make-api-key"]
    ASANA_PAT       = module.secrets.secret_ids["asana-pat"]
  }
  labels = local.labels

  depends_on = [google_project_service.required]
}

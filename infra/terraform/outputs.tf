output "network_vpc_id" {
  value       = module.network.vpc_id
  description = "Self link of the VPC network."
}

output "cloud_sql_connection" {
  value       = module.cloud_sql.instance_connection_name
  description = "Cloud SQL connection string."
}

output "redis_host" {
  value       = module.redis.host
  description = "Memorystore host address."
}

output "api_service_uri" {
  value       = module.api_service.service_uri
  description = "Cloud Run URL for the API."
}

output "worker_service_uri" {
  value       = module.worker_service.service_uri
  description = "Cloud Run URL for the worker (internal)."
}

output "audio_bucket" {
  value       = google_storage_bucket.audio.name
  description = "Bucket used for audio assets."
}

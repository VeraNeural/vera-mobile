variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Primary region for resources (e.g. us-central1)."
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the dedicated VPC."
  type        = string
}

variable "subnet_cidr" {
  description = "CIDR block for the main subnet."
  type        = string
}

variable "sql_instance_tier" {
  description = "Machine tier for Cloud SQL (e.g. db-custom-2-7680)."
  type        = string
}

variable "sql_backup_location" {
  description = "Physical backup location for Cloud SQL (e.g. us)."
  type        = string
}

variable "redis_tier" {
  description = "Memorystore tier (BASIC or STANDARD_HA)."
  type        = string
}

variable "redis_memory_size_gb" {
  description = "Memorystore capacity in GB."
  type        = number
  default     = 1
}

variable "service_account_email" {
  description = "Optional existing service account email for Cloud Run services. If null, Terraform creates one."
  type        = string
  default     = null
}

variable "allowed_web_origins" {
  description = "List of allowed origins for CORS / IAP."
  type        = list(string)
  default     = []
}

variable "audio_bucket_location" {
  description = "Location for audio/object storage bucket."
  type        = string
}

variable "labels" {
  description = "Common labels applied to all resources."
  type        = map(string)
  default     = {}
}

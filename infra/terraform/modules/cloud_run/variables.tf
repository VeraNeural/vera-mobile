variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "region" {
  type        = string
  description = "Region for Cloud Run service."
}

variable "environment" {
  type        = string
  description = "Environment name."
}

variable "service_name" {
  type        = string
  description = "Logical name of the Cloud Run service."
}

variable "image" {
  type        = string
  description = "Container image to deploy."
}

variable "service_account_email" {
  type        = string
  description = "Service account for the service."
}

variable "vpc_connector" {
  type        = string
  description = "Serverless VPC connector name."
}

variable "max_instances" {
  type        = number
  description = "Maximum number of instances."
  default     = 10
}

variable "min_instances" {
  type        = number
  description = "Minimum number of instances."
  default     = 0
}

variable "cpu" {
  type        = string
  description = "CPU allocation (e.g. 1, 2)."
  default     = "2"
}

variable "memory" {
  type        = string
  description = "Memory allocation (e.g. 1Gi)."
  default     = "1Gi"
}

variable "ingress" {
  type        = string
  description = "Ingress configuration (ALLOW_ALL, ALLOW_INTERNAL_ONLY, ALLOW_INTERNAL_AND_GCLB)."
  default     = "ALLOW_INTERNAL_ONLY"
}

variable "env_vars" {
  type        = map(string)
  description = "Plain environment variables."
  default     = {}
}

variable "allow_unauthenticated" {
  type        = bool
  description = "Whether to allow public unauthenticated access."
  default     = false
}

variable "secret_env" {
  description = "Map of env var names to Secret Manager resource IDs."
  type        = map(string)
  default     = {}
}

variable "labels" {
  type        = map(string)
  description = "Resource labels."
  default     = {}
}

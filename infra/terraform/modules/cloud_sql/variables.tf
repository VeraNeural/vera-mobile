variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "region" {
  type        = string
  description = "Primary region."
}

variable "environment" {
  type        = string
  description = "Environment name."
}

variable "instance_tier" {
  type        = string
  description = "Cloud SQL machine tier."
}

variable "backup_location" {
  type        = string
  description = "Location for SQL backups."
}

variable "authorized_network" {
  type        = string
  description = "Self link of the VPC subnet allowed to access SQL."
}

variable "labels" {
  type        = map(string)
  description = "Resource labels."
  default     = {}
}

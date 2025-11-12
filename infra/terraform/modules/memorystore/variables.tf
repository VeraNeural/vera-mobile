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

variable "tier" {
  type        = string
  description = "Memorystore tier (BASIC or STANDARD_HA)."
}

variable "memory_size_gb" {
  type        = number
  description = "Memory size in GB."
}

variable "authorized_network" {
  type        = string
  description = "Self link of the VPC network allowed to access Redis."
}

variable "labels" {
  type        = map(string)
  description = "Resource labels."
  default     = {}
}

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

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for VPC."
}

variable "subnet_cidr" {
  type        = string
  description = "CIDR block for subnet."
}

variable "labels" {
  type        = map(string)
  description = "Resource labels."
  default     = {}
}

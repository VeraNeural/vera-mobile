variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "environment" {
  type        = string
  description = "Environment name."
}

variable "secrets" {
  description = "Map of secret ids to initial values (optional)."
  type        = map(object({
    description = optional(string, "")
    labels      = optional(map(string), {})
    value       = optional(string)
  }))
  default = {}
}

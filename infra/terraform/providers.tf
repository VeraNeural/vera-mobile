terraform {
  required_version = ">= 1.6.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.16"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.16"
    }
  }

  backend "gcs" {
    bucket = "vera-terraform-state"
    prefix = "gcp-infra"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

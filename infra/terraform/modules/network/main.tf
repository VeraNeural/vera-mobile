resource "google_compute_network" "this" {
  name                    = "${var.environment}-vera-vpc"
  auto_create_subnetworks = false
  project                 = var.project_id
  routing_mode            = "REGIONAL"
  delete_default_routes_on_create = false
  description             = "VERA ${var.environment} private network"
  labels                  = var.labels
}

resource "google_compute_subnetwork" "this" {
  name          = "${var.environment}-main-subnet"
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  project       = var.project_id
  network       = google_compute_network.this.id
  stack_type    = "IPV4_ONLY"
  private_ip_google_access = true
  description   = "Primary subnet for serverless workloads"
  labels        = var.labels
}

resource "google_compute_router" "nat" {
  name    = "${var.environment}-nat-router"
  region  = var.region
  network = google_compute_network.this.id
  project = var.project_id
  description = "Router for Cloud NAT"
  labels      = var.labels
}

resource "google_compute_router_nat" "nat" {
  name                               = "${var.environment}-cloud-nat"
  router                             = google_compute_router.nat.name
  region                             = var.region
  project                            = var.project_id
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
  min_ports_per_vm                   = 128
}

resource "google_compute_global_address" "private_service_range" {
  name          = "${var.environment}-private-service-range"
  project       = var.project_id
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 20
  network       = google_compute_network.this.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.this.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_service_range.name]
  depends_on              = [google_compute_global_address.private_service_range]
}

resource "google_vpc_access_connector" "serverless" {
  name   = "${var.environment}-serverless-connector"
  region = var.region
  project        = var.project_id
  network        = google_compute_network.this.name
  machine_type   = "e2-standard-4"
  min_instances  = 2
  max_instances  = 3
  ip_cidr_range  = "10.8.0.0/28"
  labels         = var.labels
}

output "vpc_id" {
  value = google_compute_network.this.id
}

output "subnet_self_link" {
  value = google_compute_subnetwork.this.self_link
}

output "serverless_connector" {
  value = google_vpc_access_connector.serverless.name
}

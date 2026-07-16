variable "subscription_id" {
  type        = string
  description = "Azure subscription ID"
}

variable "location" {
  type        = string
  default     = "southafricanorth"
  description = "Azure region for the resource group"
}

variable "swa_location" {
  type        = string
  default     = "eastus2"
  description = "SWA region — South Africa North is not supported; use eastus2 or westeurope"
}

variable "swa_sku_tier" {
  type        = string
  default     = "Free"
  description = "SWA SKU (Free for dev, Standard for prod to enable custom domains on staging envs)"
}

variable "frontend_hostname" {
  type        = string
  description = "Custom domain for the SWA (e.g. kss.kutalfinance.com)"
}


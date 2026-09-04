terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "kss-fe-tfstate-rg"
    storage_account_name = "kssfetfstatec369"
    container_name       = "tfstate"
    key                  = "frontend.tfstate"
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

locals {
  env    = terraform.workspace
  prefix = "kss-${local.env}"
  tags = {
    project     = "kss"
    environment = local.env
    managed_by  = "terraform"
  }
}

resource "azurerm_resource_group" "frontend" {
  name     = "${local.prefix}-frontend-rg"
  location = var.location
  tags     = local.tags
}

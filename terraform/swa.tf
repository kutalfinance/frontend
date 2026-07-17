resource "azurerm_static_web_app" "main" {
  name                = "${local.prefix}-swa"
  resource_group_name = azurerm_resource_group.frontend.name
  location            = var.swa_location
  sku_tier            = var.swa_sku_tier
  sku_size            = var.swa_sku_tier
  tags                = local.tags
}

resource "azurerm_static_web_app_custom_domain" "main" {
  static_web_app_id = azurerm_static_web_app.main.id
  domain_name       = var.frontend_hostname
  validation_type   = "cname-delegation"
}

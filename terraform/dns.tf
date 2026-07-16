data "azurerm_dns_zone" "main" {
  name                = "kutalfinance.com"
  resource_group_name = "kss-shared-rg"
}

# Frontend: kss.kutalfinance.com (prod) or dev.kss.kutalfinance.com (dev) → SWA
resource "azurerm_dns_cname_record" "frontend" {
  name                = local.env == "prod" ? "kss" : "dev.kss"
  zone_name           = data.azurerm_dns_zone.main.name
  resource_group_name = "kss-shared-rg"
  ttl                 = 300
  record              = azurerm_static_web_app.main.default_host_name
}

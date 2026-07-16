output "swa_default_hostname" {
  description = "SWA auto-generated hostname (before custom domain)"
  value       = azurerm_static_web_app.main.default_host_name
}

output "swa_api_token" {
  description = "SWA deployment token — set as AZURE_STATIC_WEB_APPS_API_TOKEN in pipeline variable group"
  value       = azurerm_static_web_app.main.api_key
  sensitive   = true
}


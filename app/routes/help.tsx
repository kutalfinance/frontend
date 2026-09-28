const HELP_URL = "https://kutalfinance.atlassian.net/servicedesk/customer/portal/1";

export async function clientLoader() {
  window.location.href = HELP_URL;
  return null;
}

export default function HelpRedirect() {
  return null;
}

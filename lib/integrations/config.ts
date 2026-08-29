import type { IntegrationName, IntegrationStatus } from "./types"

const envByProvider: Record<IntegrationName, string[]> = {
  airtable: ["AIRTABLE_API_TOKEN", "AIRTABLE_BASE_ID"],
  notion: ["NOTION_API_KEY"],
  github: ["GITHUB_TOKEN", "GITHUB_REPOSITORY"],
  vercel: ["VERCEL_TOKEN", "VERCEL_PROJECT_ID"],
  canva: ["CANVA_ACCESS_TOKEN"],
}

export function getIntegrationStatus(name: IntegrationName): IntegrationStatus {
  return envByProvider[name].every(key => Boolean(process.env[key])) ? "connected" : "configuration_required"
}

export function getMissingConfiguration(name: IntegrationName) {
  return envByProvider[name].filter(key => !process.env[key])
}

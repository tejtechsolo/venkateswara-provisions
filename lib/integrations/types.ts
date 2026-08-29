export type IntegrationName = "airtable" | "notion" | "github" | "vercel" | "canva"

export type IntegrationStatus = "connected" | "configuration_required" | "error" | "disabled"

export interface IntegrationAdapter {
  name: IntegrationName
  status(): Promise<IntegrationStatus>
  testConnection(): Promise<{ ok: boolean; message: string }>
}

export interface SyncResult {
  created: number
  updated: number
  skipped: number
  errors: string[]
}

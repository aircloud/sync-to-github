import type { UserConfig } from './reducer'

export interface SyncPayload {
  markdown: string
  title: string
  userConfig: UserConfig
  sha?: string
}

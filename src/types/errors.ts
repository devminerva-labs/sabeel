export type SabeelError =
  | { kind: 'offline_sync_failed'; pendingItems: number }
  | { kind: 'dexie_error'; message: string }
  | { kind: 'content_load_failed'; resource: 'adhkar' }
  | { kind: 'supabase_error'; status: number; message: string }

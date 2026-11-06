/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AI_PROVIDER_API_KEY?: string
  readonly AI_PROVIDER_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

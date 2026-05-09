/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INBOX_SCENARIO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

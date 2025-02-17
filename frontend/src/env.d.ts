interface ImportMetaEnv {
  readonly VITE_API_BACKEND_URL: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_OPENAI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

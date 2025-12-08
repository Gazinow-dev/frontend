declare module '@env' {
  export const MODE: 'development' | 'production';
  export const API_BASE_URL: string;
  export const SENTRY_DSN: string;
  export const AMPLITUDE_API_KEY: string;
}

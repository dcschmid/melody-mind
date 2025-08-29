export interface DatabaseConfig {
  url: string;
  authToken?: string;
  [key: string]: unknown;
}

export function getDatabaseConfig(): DatabaseConfig;
export function validateDatabaseConfig(cfg: DatabaseConfig): boolean;

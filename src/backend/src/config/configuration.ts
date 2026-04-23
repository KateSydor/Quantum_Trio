function parseBoolean(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (value === undefined || value === '') return defaultValue;
  return value.toLowerCase() === 'true';
}

function parseIntWithDefault(
  value: string | undefined,
  defaultValue: number,
): number {
  if (value === undefined || value === '') return defaultValue;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? defaultValue : n;
}

/**
 * All application settings mapped from `process.env` in `loadConfiguration()`.
 * Use `ConfigService<AppConfiguration>` and dot paths (e.g. `database`, `auth.jwtSecret`).
 */
export type AppConfiguration = {
  app: {
    port: number;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    synchronize: boolean;
    logging: boolean;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
  };
};

export function loadConfiguration(): AppConfiguration {
  return {
    app: {
      port: parseIntWithDefault(process.env.PORT, 3000),
    },
    database: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseIntWithDefault(process.env.DB_PORT, 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      name: process.env.DB_NAME ?? 'quantum_trio',
      synchronize: parseBoolean(process.env.DB_SYNCHRONIZE, true),
      logging: parseBoolean(process.env.DB_LOGGING, false),
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    },
  };
}

export default loadConfiguration;

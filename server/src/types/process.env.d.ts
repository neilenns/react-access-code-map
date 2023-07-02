// From https://stackoverflow.com/a/56666712
export interface IProcessEnv {
  COOKIE_SECRET: string;
  JWT_SECRET: string;
  MONGO_DB_CONNECTION_STRING: string;
  REFRESH_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_SECRET: string;
  SESSION_EXPIRY: string;
  MONGO_DB_NAME: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnv {}
  }
}

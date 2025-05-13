import "dotenv/config";
import z from "zod";

function booleanTransformer(v: string, ctx: z.RefinementCtx) {
  v = v.toLowerCase();
  switch (v) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.boolean,
        received: z.ZodParsedType.string,
        message: 'Expected "true" or "false"',
      });
      return false;
  }
}

const envSchema = z.object({
  COOKIE_SECRET: z.string(),
  SSL_PRIVATE_KEY_PATH: z.string().default(""),
  SSL_FULL_CHAIN_PATH: z.string().default(""),
  JWT_SECRET: z.string(),
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "debug", "trace"])
    .optional(),
  LOGTAIL_TOKEN: z.string().optional(),
  MONGO_DB_CONNECTION_STRING: z.string(),
  MONGO_DB_NAME: z.string().default("access-code-map"),
  MONGOOSE_DEBUG: z
    .string()
    .transform<boolean>(booleanTransformer)
    .default("false"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3001),
  REFRESH_TOKEN_EXPIRY: z.string().default("60 * 60 * 24 * 30"),
  REFRESH_TOKEN_SECRET: z.string(),
  SESSION_EXPIRY: z.string().default("60 * 15"),
  TRUST_PROXY: z.coerce.number().default(0),
  VERSION: z.string().default("dev"),
  WHITELISTED_DOMAINS: z.string(),
});

export const ENV = envSchema.parse(process.env);

export const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};

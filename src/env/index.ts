import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(3333)
});

const _env = envSchema.safeParse(process.env);

if (_env.success == false) {
    console.log("Incorrect enviroument variables", _env.error.format());
    throw new Error();
}

export const env = _env.data;
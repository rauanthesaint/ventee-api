import "dotenv/config";
import type { FastifyLoggerOptions } from "fastify";
import type { PinoLoggerOptions } from "fastify/types/logger";
import z from "zod";

const schema = z.object({
    PORT: z.coerce.number().int().min(1000).max(9999).default(5000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    HOSTNAME: z.url(),
    BOT_TOKEN: z.string().min(1),
});

export const env = schema.parse(process.env);

export const loggerOptions: FastifyLoggerOptions & PinoLoggerOptions = {
    level: "info",
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
        },
    },
};

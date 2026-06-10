import Fastify from "fastify";
import { env, loggerOptions } from "./config.js";
import { Bot, webhookCallback } from "grammy";

const app = Fastify({
    logger: env.NODE_ENV === "development" ? loggerOptions : true,
});

const bot = new Bot(env.BOT_TOKEN);

bot.command("start", async (ctx) => {
    await ctx.reply("Hello!");
});

app.register(
    (instance) => {
        instance.get("/", async (req, rep) => {
            return rep.status(200).send(req.headers);
        });

        if (env.NODE_ENV === "production") {
            instance.post("/webhook", webhookCallback(bot, "fastify"));
        }
    },
    { prefix: "/v1" },
);

await app.listen({ port: env.PORT, host: "0.0.0.0" });

if (env.NODE_ENV === "production") {
    await bot.api.setWebhook(`${env.HOSTNAME}/v1/webhook`);
} else {
    await bot.api.deleteWebhook();
    await bot.start();
}

import Fastify from "fastify";
import { env, loggerOptions } from "./config";
import { Bot, webhookCallback } from "grammy";

const application = Fastify({
    logger: env.NODE_ENV === "development" ? loggerOptions : true,
});

// add cors plugin

const bot = new Bot(env.BOT_TOKEN);

bot.command("start", async (ctx) => {
    await ctx.reply("Hello!");
});

application.register(
    (instance) =>
        instance.get("/", async (req, rep) => {
            return rep.status(200).send(req.headers);
        }),
    { prefix: "v1" },
);

if (env.NODE_ENV === "development") {
    await bot.api.deleteWebhook();
    await bot.start();
} else {
    application.post("/webhook", webhookCallback(bot, "fastify"));
    await application.listen({ port: env.PORT });
    await bot.api.setWebhook(`${env.HOSTNAME}/webhook`);
}

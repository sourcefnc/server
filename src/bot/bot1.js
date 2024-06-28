import { Telegraf } from "telegraf";

const bot = new Telegraf('7439778841:AAEf2S0J8J5OiZfGx_MHtFt26ZtQcChETkw');

bot.start(ctx => {
    ctx.reply('hello admin !!')
    console.log(ctx.from.id);
})

export default bot;
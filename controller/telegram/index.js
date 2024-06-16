const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const token = process.env.TELEGRAMAPI;
const tool = require("../../utils/tools")
const bot = new TelegramBot(token, { polling: true });

const src = require("./src/index")

bot.on('message', async(msg) => {
    try {
        if (msg["reply_to_message"]) {
            console.log(msg)
        } else {
            await router(msg)
        }
    } catch (e) {
        console.log(e);
    }

});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    try {
        await callBackRouter(msg, action, opts);
    } catch (e) {
        console.log(e);
    }

});


async function router(data) {
    const uid = data.chat.id;
    const req = tool.pathRouter(data.text);
    switch (req.command) {
        case "start":
            await src.menu.star(bot, uid, req, data);
            var s = tool.starRouter(req.params)
            if(s&&s.length>0)
            {
                if(s[0].type=='export')
                {
                    return src.menu.exportSeed(bot, uid, req, data)
                }
            }
            return src.menu.menu(bot, uid, req, data)
            break;
        case "menu":
            await src.menu.menu(bot, uid, req, data);
            break;
        case "debug":
            console.log(uid)
            return src.menu.debug(bot, uid, req, data)
            break;
        default:
            req.params = [
                data.text
            ]
            break;
    }
}

async function callBackRouter(data, action, opts) {
    const uid = data.chat.id;
    const req = tool.pathRouter(action);
    switch (req.command) {
        case "menu":
            await src.menu.menu(bot, uid, req, data);
            break;
        case "dev":
            await src.menu.dev(bot, uid, req, data);
        case "empty":
            return null;
        case "close":
            break;
        default:
            break;
    }
    bot.deleteMessage(opts.chat_id, opts.message_id);
}

async function init() {

}

function getBot() {
    return bot;
}

module.exports = {
    init,
    getBot
}
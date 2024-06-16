const db = require("../../../utils/db");
const tg = require("../../../utils/tg");
const lan = require("../../../utils/lan")


async function star(bot, uid, req, raw) {
    await db.newAccount(raw.from);
    return true;
}

async function menu(bot, uid, req, raw) {
    var text = lan.getText()
    var finalText = text['mainMenu'][0];
    return await tg.tryBotSendMessage(bot, uid, finalText, {
        parse_mode: 'MarkDown',
        disable_web_page_preview: "true",
        reply_markup: JSON.stringify({
            inline_keyboard: lan.mainMenuButton()
        })
    });
}

async function exportSeed(bot, uid, req, raw) {
    var text = lan.getText()
    var finalText = text['export'][0];
    return await tg.tryBotSendMessage(bot, uid, finalText, {
        parse_mode: 'MarkDown',
        disable_web_page_preview: "true",
        reply_markup: JSON.stringify({
            inline_keyboard: [lan.backAndClose()]
        })
    });
}


async function debug(bot, uid, req, raw) {
    return await tg.tryBotSendMessage(bot, uid, "test", {
        parse_mode: 'MarkDown',
        disable_web_page_preview: "true",
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{
                    text: "debug",
                    web_app: {
                        url: 'https://cash.tonspay.top/?tgWebAppStartParam=3c9d8a250e863301af28449d3e84e6c6'
                    }
                },
                {
                    text: "debug share",
                    url: "https://t.me/share/url?url=www.tonspay.top&text=Tonspay,best-crypto-payment"
                }],
                [
                    {
                        text : "website",
                        web_app:{
                            //url:'https://app.binance.com/payment/secpay?linkToken=0176d1a4ea5144bc816a3daf4a982bae&_dp=Ym5jOi8vYXBwLmJpbmFuY2UuY29tL3BheW1lbnQvc2VjcGF5P3RlbXBUb2tlbj1scVhJOGdoWVVUb1dCYW8yWVkzNWtXVjZlZTFYQmZCZQ' 
                        }
                    }
                ]
            ]
        })
    });
}

async function dev(bot, uid, req, raw) {
    var text = lan.getText()
    var finalText = text['dev'][0];
    return await tg.tryBotSendMessage(bot, uid, finalText, {
        parse_mode: 'MarkDown',
        disable_web_page_preview: "true",
        reply_markup: JSON.stringify({
            inline_keyboard: [lan.backAndClose()]
        })
    });
}
module.exports = {
    star,
    menu,
    debug,
    dev,
    exportSeed
}

const telegram = require("./controller/telegram/index");
const webview = require("./controller/web/index");

async function init()
{
  await telegram.init()
  await webview.init()
}

init()


const telegram = require("./controller/telegram/index");
const webview = require("./controller/web/index");

const monitor = require("./controller/monitor/index");

async function init()
{
  await telegram.init()
  await webview.init()
  await monitor.init()
}

init()

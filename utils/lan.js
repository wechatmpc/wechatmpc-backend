require('dotenv').config()

const text = [{
    "mainMenu": [
        `👛 Tonspack Bot 👛

Welcome to Tonspack wallet .

This bot is a MPC wallet for mulity chains
`,
    ],
    'export':[
        `🚧 Currently Not Allow To Export 🚧`
    ],
    "dev":[
`*🚧This function is under constructing*🚧

*Please try others*`
    ]
}]

const btn = [{
    "mainMenu": [
        `Wallet`
    ],
    "backAndClose": [
        `🏡 Menu`,
        `❎ Close`
    ]
}]

function backAndClose(lan) {
    var raw = getBtn(lan);
    return [{
            "text": raw.backAndClose[0],
            "callback_data": "/menu"
        },
        {
            "text": raw.backAndClose[1],
            "callback_data": "/close"
        }
    ]
}

function mainMenuButton( lan) {
    var raw = getBtn(lan)
    var ret = [
        [{
            "text": raw.mainMenu[0],
            web_app: {
                url: 'https://pack.tons.ink/'
            }
        } ],
        backAndClose(lan)
    ]

    return ret;
}

/**
 * Get the raw data
 */
function getText(lan) {
    return text[0];
}

function getBtn(lan) {
    return btn[0];
}

module.exports = {
    getText,
    getBtn,
    mainMenuButton,
    backAndClose,
}
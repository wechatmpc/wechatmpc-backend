/**
 * This controller is to build a api request system for wallet
 */
const root = process.cwd();
require('dotenv').config();
var querystring = require('querystring');
var express = require('express');
const fs = require("fs");
var app = express();
var bodyParser = require('body-parser');
const modules = require("../../modules/index")
const redis = require("../../utils/redis")
const qr = require('qrcode');
const b58 = require("b58")

const auth = require("./middleware/auth");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.listen(50001, async function() {
    console.log('web-server start')
})

async function sendErr(res, err) {
    if (!err) {
        err = "unknow error"
    }
    return await res.status(500).send({
        "code": 500,
        "error": err
    })
}

/**
 * Get
 */

//Ping
app.get('/ping', auth.auth, async function(req, res) {
    res.status(200).send({
        "code": 200,
        "data": res.locals.auth
    })
})



app.post('/connect', auth.auth, async function(req, res) {
    const verfi = modules.wallet.metamask.newMetamaskConnection(res.locals.auth, req.body['sign']);
    res.status(200).send({
        "code": 200,
        "data": verfi
    })
})

/**
 * Post
 */

app.post('/auth', async function(req, res) {
    const verfi = tgVerfiy(process.env.TELEGRAMAPI, req.body.initData)
    if (verfi) {
        // console.log(req.body.initData)
        const rawData = querystring.decode(req.body.initData);
        const userData = JSON.parse(rawData.user)
        const token = await auth.newkey(userData.id)
        console.log(token)
        console.log(userData.id)
        res.status(200).send({
            "code": 200,
            "token": token,
            "data": userData
        })
    } else {
        await sendErr(res)
    }
})

const crypto = require("crypto");

function tgVerfiy(apiToken, telegramInitData) {
    const initData = new URLSearchParams(telegramInitData);

    initData.sort();

    const hash = initData.get("hash");
    initData.delete("hash");

    const dataToCheck = [...initData.entries()].map(([key, value]) => key + "=" + value).join("\n");

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(apiToken).digest();

    const _hash = crypto.createHmac("sha256", secretKey).update(dataToCheck).digest("hex");

    return hash === _hash;
}

//INIT
async function init() {

}

module.exports = {
    init
}
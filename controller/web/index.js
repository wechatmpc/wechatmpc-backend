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

const cors = require('cors');
app.use(cors())

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
app.get('/ping',  async function(req, res) {
    res.status(200).send({
        "code": 200,
        "data": "pong"
    })
})

app.post('/wechat/login', async function(req, res) {
    return modules.wx.wxLogin(req,res)
})
app.post('/wechat/qr', async function(req, res) {
    return modules.wx.getWxQrcode(req,res)
})
app.get('/wechat/dl/:msg', async function(req, res) {
    return modules.wx.getQuickDeeplink(req,res)
})

app.post('/alipay/login', async function(req, res) {
  return await modules.alipay.aliLogin(req, res);
});


//INIT
async function init() {
    await redis.init()
    modules.wx.ACTokenManager()
}

module.exports = {
    init
}

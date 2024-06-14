const api = require("./utils/apis")
const tonUtils = require("./utils/ton");
const db = require("./utils/db")
const cashlink = require("@tonlink/api")
const redis = require("./utils/redis");
const orbs = require("@orbs-network/ton-access")
const _ton = require("@ton/ton")
const kg = require("./modules/auth/index")

const qr = require('qrcode');

const b58 = require("b58")

const nacl = require("tweetnacl")

const web3 = require("web3")

const hd = require("ethereumjs-wallet")

require('dotenv').config()

function seedToKp()
{
    var kp = new nacl.sign.keyPair()
    console.log(kp)
    console.log(
        nacl.sign.keyPair.fromSeed(kp.publicKey)
    )
    console.log(
        nacl.sign.keyPair.fromSeed(kp.publicKey)
    )
    console.log(
        nacl.sign.keyPair.fromSeed(kp.publicKey)
    )
    console.log(
        nacl.sign.keyPair.fromSeed(kp.publicKey)
    )
}

async function test() {
    var kp = nacl.sign.keyPair.fromSecretKey(
        b58.decode(process.env.WLLET_SK)
    )
    const master = hd.hdkey.fromMasterSeed(kp.publicKey);
    var child = master.deriveChild(1111111111)
    var child_wallet = child.getWallet()
    console.log(child_wallet.getAddressString())
    console.log(
        b58.encode(nacl.sign.keyPair.fromSeed(child_wallet.getPrivateKey()).publicKey),
        b58.encode(nacl.sign.keyPair.fromSeed(child_wallet.getPrivateKey()).secretKey)
    )
}

test()
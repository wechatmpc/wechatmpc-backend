const ton = require("./ton")
const evm = require("./evm")
const sol = require("./sol")



const b58 = require("b58")
const nacl = require("tweetnacl")
const hd = require("ethereumjs-wallet")

require('dotenv').config()

function getKp(uid)
{
    var kp = nacl.sign.keyPair.fromSecretKey(
        b58.decode(process.env.WLLET_SK)
    )
    const master = hd.hdkey.fromMasterSeed(kp.publicKey);
    var evm = master.deriveChild(uid)
    var evmWallet = evm.getWallet()
    var evmKp = {
        address : evmWallet.getAddressString(),
        privateKey : evmWallet.getPrivateKeyString()
    }
    var naclKp = nacl.sign.keyPair.fromSeed(evmWallet.getPrivateKey())
    var solKp = {
        address : b58.encode(naclKp.publicKey),
        privateKey :b58.encode(naclKp.secretKey),
    }
    var tonKp = ton.getTonWalletV4KeyPair(naclKp.secretKey,0)
    return {
        naclKp : naclKp,
        evmKp : evmKp,
        solKp : solKp,
        tonKp : tonKp
    }

}

module.exports = {
    getKp,
    ton,
    evm,
    sol
}
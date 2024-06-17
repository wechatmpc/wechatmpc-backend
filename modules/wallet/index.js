const ton = require("./ton")
const evm = require("./evm")
const sol = require("./sol")



const b58 = require("b58")
const nacl = require("tweetnacl")
const hd = require("ethereumjs-wallet")

require('dotenv').config()

function getKp(uid)
{
    var row = Math.ceil(uid/process.env.WLLET_HD_MAX)
    var subRow = Math.ceil(uid%process.env.WLLET_HD_MAX)
    var kp = nacl.sign.keyPair.fromSecretKey(
        b58.decode(process.env.WLLET_SK)
    )
    const master = hd.hdkey.fromMasterSeed(kp.publicKey);
    const subKp = nacl.sign.keyPair.fromSeed(
        (
            (
                master.deriveChild(row)
            ).getWallet()
        ).getPrivateKey()
    );
    const subMaster = hd.hdkey.fromMasterSeed(subKp.publicKey);
    var evm = subMaster.deriveChild(subRow)
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

function getAddress(uid)
{
    const kp = getKp(uid);
    return{
        evm : kp.evmKp.address,
        sol : kp.solKp.address,
        ton : kp.tonKp.address.toString(true,false,false)
    }
}

/**
 * The action router 
 */
async function action()
{

}

module.exports = {
    getKp,
    getAddress,
    ton,
    evm,
    sol
}
const btc = require("bitcoinjs-lib")
const TESTNET = btc.networks.testnet;
const bip32 = require('bip32')
const ecpair=require('ecpair');
const ecc=require('tiny-secp256k1');
const nacl = require("tweetnacl")
const bitcoinMessage = require('bitcoinjs-message')
const api = require("../../utils/apis")
function getKeyPair(sec)
{
    const ECPair=ecpair.ECPairFactory(ecc);
    const kp = ECPair.fromPrivateKey(sec,{})

    var private_key=kp.privateKey.toString('hex');
    var public_key=kp.publicKey.toString('hex');
    const { address }=btc.payments.p2pkh({pubkey:kp.publicKey});
    return {
        address:address,
        publicKey:public_key,
        privateKey:private_key
    }
}

function connect(kp)
{
    return kp.tonKp.address
}

function sign(kp,data)
{
    const message = Buffer.from(data);
    const ECPair=ecpair.ECPairFactory(ecc);
    const kps = ECPair.fromPrivateKey(Buffer.from(kp.btcKp.privateKey,'hex'),{})
    var privateKey = kps.privateKey
    var signature = bitcoinMessage.sign(message, privateKey, kps.compressed)
    return signature.toString('base64')
}

async function signAndSendTxn(kp,tx)
{
}

module.exports = {
    getKeyPair,
    connect,
    sign,
    signAndSendTxn
}
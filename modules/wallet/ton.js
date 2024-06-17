const tonCrypto = require("@ton/crypto")
const ton = require("@ton/ton")
const keyPairFromSecretKey = tonCrypto.keyPairFromSecretKey
const nacl = require("tweetnacl")
function getTonWalletV4KeyPair(sec,workchain)
{
    const kp = keyPairFromSecretKey(sec);
    return ton.WalletContractV4.create({ publicKey: kp.publicKey, workchain: workchain });
}

function connect(kp)
{
    return kp.tonKp.address
}

function sign(kp,data)
{
    const messageBytes = Buffer.from(data);
    return {
        address:kp.naclKp.address,
        message:data,
        sign:b58.encode(nacl.sign(messageBytes, b58.decode(kp.naclKp.privateKey))) 
    }
}

async function signAndSendTxn(kp,tx)
{

}

module.exports = {
    getTonWalletV4KeyPair,
    connect,
    sign,
    signAndSendTxn
}
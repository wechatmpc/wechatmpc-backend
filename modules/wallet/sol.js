const web3 = require("@solana/web3.js")
const nacl = require("tweetnacl")
function connect(kp)
{
    return kp.solKp.address
}

function sign(kp,data)
{
    const messageBytes = Buffer.from(data);
    return nacl.sign.detached(messageBytes, kp.solKp.privateKey);
}

async function signAndSendTxn(kp,tx)
{

}

module.exports = {
    connect,
    sign,
    signAndSendTxn
}
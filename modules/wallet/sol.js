const web3 = require("@solana/web3.js")
const nacl = require("tweetnacl")
const b58 = require("b58")
function connect(kp)
{
    return kp.solKp.address
}

function sign(kp,data)
{
    const messageBytes = Buffer.from(data);
    return {
        address:kp.solKp.address,
        message:data,
        sign:b58.encode(nacl.sign(messageBytes, b58.decode(kp.solKp.privateKey))) 
    }
}

async function signAndSendTxn(kp,tx)
{

}

module.exports = {
    connect,
    sign,
    signAndSendTxn
}
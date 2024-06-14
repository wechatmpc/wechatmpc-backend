const web3 = require("@solana/web3.js")

function connect(kp)
{
    return kp.solKp.address
}

function sign(kp,data)
{
    
}

async function signAndSendTxn(kp,tx)
{

}

module.exports = {
    connect,
    sign,
    signAndSendTxn
}
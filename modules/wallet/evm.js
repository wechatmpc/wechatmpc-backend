const web3 = require("web3")

function connect(kp)
{
    return kp.evmKp.address
}

function sign(kp,data)
{
    const account = web3.eth.accounts.privateKeyToAccount(kp.evmKp.privateKey);
    return account.sign(data);
}

async function signAndSendTxn(kp,tx)
{

}

module.exports = {
    connect,
    sign,
    signAndSendTxn
}
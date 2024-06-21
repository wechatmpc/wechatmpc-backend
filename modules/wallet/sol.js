const web3 = require("@solana/web3.js")
const nacl = require("tweetnacl")
const b58 = require("b58")
const chains = require("./chains.json")

let sol_rpc_url = chains.solana.rpc;

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
    try{
        const conn = new web3.Connection(sol_rpc_url);

        const rawSign =  new Uint8Array(b58.decode(tx.d))
    
        const realTx =web3.Transaction.populate(web3.Message.from(rawSign))
        const signer = web3.Keypair.fromSecretKey(b58.decode(kp.solKp.privateKey))
        return await web3.sendAndConfirmTransaction(
            conn,
            realTx,
            [signer]
        )
    }catch(e)
    {
        console.error(e)
        return {
            status:false,
            reason:e
        }
    }

}

module.exports = {
    connect,
    sign,
    signAndSendTxn
}
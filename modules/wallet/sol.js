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
        var ret = [];
        const txs = JSON.parse(
            tx.d
        )
        for(var u = 0 ; u<txs.length ; u++)
        {
            const ele = txs[u]
            const rawSign =  new Uint8Array(b58.decode(ele))
    
            const realTx =web3.Transaction.populate(web3.Message.from(rawSign))
                
            let blockhashObj = await conn.getRecentBlockhash();
            realTx.recentBlockhash = blockhashObj.blockhash;
    
            const signer = web3.Keypair.fromSecretKey(b58.decode(kp.solKp.privateKey))
            console.log(signer.publicKey.toString())

            const simulate = await conn.simulateTransaction(realTx,[signer],[signer.publicKey])
            console.log(
                "🚧 Do conn.simulateTransaction",
                simulate,
                simulate.value.accounts
            )
            // if(!simulate.value.logs)

            var addFee = true;
            simulate.value.logs.forEach(ele => {
                if(ele == 'Program ComputeBudget111111111111111111111111111111 success')
                {
                    addFee = false
                }
            });
            if(addFee)
            {
                const unitsConsumed = simulate.value.unitsConsumed+300;
                const unitsPrice = 20000
                realTx.add(
                    web3.ComputeBudgetProgram.setComputeUnitLimit({ 
                        units: unitsConsumed 
                    })
                )
                realTx.add(
                    web3.ComputeBudgetProgram.setComputeUnitPrice({ 
                        microLamports: unitsPrice
                    })
                )
            }


            realTx.sign(signer);
            realTx.partialSign(signer);
            var finalSign = realTx.serialize()
            console.log("final Sign",finalSign)

            ret.push(
                Buffer.from(finalSign).toString("base64")
            )
        }
        return ret;
        
        return await web3.sendAndConfirmTr
        
        ansaction(
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
const Web3 = require("web3")
const chains = require("./chains.json")
function connect(kp)
{
    return kp.evmKp.address
}   

function sign(kp,data)
{
    const account = Web3.eth.accounts.privateKeyToAccount(kp.evmKp.privateKey);
    return account.sign(data);
}

async function signAndSendTxn(kp,data)
{
    var web3 = getWeb3(data.c.i)
    if(web3)
        {
            try{
                const txns = JSON.parse(data.d);
                const gas = web3.utils.toHex(21000);
                const gasPrice = await web3.eth.getGasPrice();
                const nonce = await web3.eth.getTransactionCount( kp.evmKp.address);

                var transaction = {
                    to: txns.t, 
                    value: 0,
                    gas,
                    gasPrice,
                    nonce, 
                    chainId: data.c.i,
                    data:""
                };
                if(txns.v && txns.v > 0)
                    {
                        transaction['value'] = txns.v
                    }

                if(txns.d)
                    {
                        transaction['data'] = txns.d
                        transaction['gas'] = await web3.eth.estimateGas({
                            value:transaction.value,
                            to: txns.t,
                            data: txns.d
                        })
                    }
                if(txns.g && txns.g > 0)
                    {
                        transaction.gas = txns.g;
                    }
                // console.log(transaction)
                const signedTx = await web3.eth.accounts.signTransaction(transaction, kp.evmKp.privateKey);
                const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                return receipt;
            }catch(e){
                console.error(e)
                return {
                    status:false,
                    reason:e
                }

            }
        }

    return false;
}

function getWeb3(chain)
{
    if(chains.evm[chain])
        {
            return new Web3(new Web3.providers.HttpProvider(chains.evm[chain].httpProvider[0]))
        }else{
            return false;
        }
}

module.exports = {
    connect,
    sign,
    signAndSendTxn
}
const tonCrypto = require("@ton/crypto")
const ton = require("@ton/ton")
const keyPairFromSecretKey = tonCrypto.keyPairFromSecretKey
const nacl = require("tweetnacl")
const TonWeb = require("tonweb");
require('dotenv').config();
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
    
    try{
        const client = new ton.TonClient({
            endpoint: `https://toncenter.com/api/v2/jsonRPC?api_key=${process.env.TONCENTERAPIKEY}`,
          });
          
          let keyPair = keyPairFromSecretKey(kp.naclKp.secretKey);
          let workchain = 0;
          let wallet = ton.WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
          let contract = client.open(wallet);
          let seqno = await contract.getSeqno();

          const txn = JSON.parse(tx.d)
          console.log("🚧tx",txn)
          
          const msg = [];

          txn.forEach(e => {
            msg.push(
                ton.internal({
                    value: (Number(e.v)/Math.pow(10,9)).toString(),
                    to: e.t,
                    bounce:false,
                    body: e.d,
                  })
            )

          });
          const ret = await contract.sendTransfer({
            seqno,
            secretKey: keyPair.secretKey,
            messages: msg
          });

          console.log("🚧 Ret , ",ret)
          return 1 ;
    }catch(e)
    {
        console.error(e)
        return 1 ;
    }

}

module.exports = {
    getTonWalletV4KeyPair,
    connect,
    sign,
    signAndSendTxn
}
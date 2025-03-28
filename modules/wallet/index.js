const ton = require("./ton")
const evm = require("./evm")
const sol = require("./sol")
const btc = require("./btc")



const b58 = require("b58")
const nacl = require("tweetnacl")
const hd = require("ethereumjs-wallet")

const redis = require("../../utils/redis")

require('dotenv').config()

function getKp(uid)
{
    var row = Math.ceil(uid/process.env.WLLET_HD_MAX)
    var subRow = Math.ceil(uid%process.env.WLLET_HD_MAX)
    var kp = nacl.sign.keyPair.fromSecretKey(
        b58.decode(process.env.WLLET_SK)
    )
    const master = hd.hdkey.fromMasterSeed(kp.publicKey);
    const fromSeed = (
        (
            master.deriveChild(row)
        ).getWallet()
    ).getPrivateKey()
    const subKp = nacl.sign.keyPair.fromSeed(
        fromSeed
    );
    const subMaster = hd.hdkey.fromMasterSeed(subKp.publicKey);
    var evm = subMaster.deriveChild(subRow)
    var evmWallet = evm.getWallet()
    var evmKp = {
        address : evmWallet.getAddressString(),
        privateKey : evmWallet.getPrivateKeyString()
    }
    var naclKp = nacl.sign.keyPair.fromSeed(evmWallet.getPrivateKey())
    var solKp = {
        address : b58.encode(naclKp.publicKey),
        privateKey :b58.encode(naclKp.secretKey),
    }
    var tonKp = ton.getTonWalletV4KeyPair(naclKp.secretKey,0)
    var btcKp = btc.getKeyPair(fromSeed)
    return {
        naclKp : naclKp,
        evmKp : evmKp,
        solKp : solKp,
        tonKp : tonKp,
        btcKp : btcKp,
    }

}

function getAddress(uid)
{
    const kp = getKp(uid);
    return{
        evm : kp.evmKp.address,
        sol : kp.solKp.address,
        ton : kp.tonKp.address.toString(
            {
                urlSafe: true,
                bounceable: false,
                testOnly: false
            }
        ),
        btc : kp.btcKp.address
    }
}

/**
 * The action router 
 */

async function mpc_action(data)
{
    let ret = data.ret;
    if(typeof data.ret == "object")
    {
        console.log("🚧need JSON.stringify(ret)",typeof data.ret,typeof data.ret == "object" , typeof data.ret != "string" , typeof data.ret != "number" , typeof data.ret != "boolean" ,ret)
        ret = JSON.stringify(ret)
    }
    await redis.setAction(data.i,ret)
    return data;
}
async function action(uid,data)
{
    //Action routers
    switch(data.t)
    {
        case 0 : //Connect wallet
            return await connect(uid,data)
            break;
        case 1 : //Sign message
            return await sign(uid,data)
            break;
        case 2 : //Sign and send message
            console.log("signAndSend(uid,data)",data)
            return await signAndSend(uid,data)
            break;
        default:
            return false;
            break;
    }
}

async function connect(uid,data)
{
    var c = false;
    if(data.i)
    {
        const adds = getAddress(uid)
        switch(data.c.t)
        {
            case 0 :
                c = adds.evm;
                break;
            case 1 : 
                c = adds.sol;
                break;
            case 2 : 
                c = adds.ton;
                break;
            case 3 : 
                c = adds.btc;
                break;
            default :
                return false;
        }
        await redis.setAction(data.i,c)
    }
    return c;
}

async function sign(uid,data)
{
    var c = false;
    if(data.i && data.d)
    {
        const kps = getKp(uid)
        switch(data.c.t)
        {
            case 0 :
                c = evm.sign(kps,data.d);
                break;
            case 1 : 
                c = sol.sign(kps,data.d);
                break;
            case 2 : 
                c = ton.sign(kps,data.d);
                break;
            case 3 : 
                c = btc.sign(kps,data.d);
                break;
            default :
                return false;
        }
        await redis.setAction(data.i,JSON.stringify(c))
    }
    return c;
}

async function signAndSend(uid,data)
{
    var c = false;
    if(data.i && data.d)
    {
        const kps = getKp(uid)
        switch(data.c.t)
        {
            case 0 :
                c = await evm.signAndSendTxn(kps,data);
                break;
            case 1 : 
                c = await sol.signAndSendTxn(kps,data);
                break;
            case 2 : 
                c = await ton.signAndSendTxn(kps,data);
                break;
            default :
                return false;
        }
        await redis.setAction(data.i,JSON.stringify(c))
    }

    console.log(c,data.i ,data.d)
    return c;
}

async function balanceAggregator(data)
{

}

module.exports = {
    getKp,
    getAddress,
    action,
    mpc_action,
    ton,
    evm,
    sol,
    balanceAggregator
}
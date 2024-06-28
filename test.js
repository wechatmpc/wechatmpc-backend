const api = require("./utils/apis")
const tonUtils = require("./utils/ton");
const db = require("./utils/db")
const cashlink = require("@tonlink/api")
const redis = require("./utils/redis");
const orbs = require("@orbs-network/ton-access")
const _ton = require("@ton/ton")
const kg = require("./modules/auth/index")

const qr = require('qrcode');

const b58 = require("b58")

const nacl = require("tweetnacl")

const web3 = require("web3")
const solanaweb3  =require("@solana/web3.js")

const hd = require("ethereumjs-wallet")


const tonCrypto = require("@ton/crypto")
const ton = require("@ton/ton")
require('dotenv').config()

function seedToKp()
{
    var kp = new nacl.sign.keyPair()
    console.log(kp)
    console.log(
        nacl.sign.keyPair.fromSeed(kp.publicKey)
    )
    console.log(
        nacl.sign.keyPair.fromSeed(kp.publicKey)
    )
    console.log(
        nacl.sign.keyPair.fromSeed(kp.publicKey)
    )
    console.log(
        nacl.sign.keyPair.fromSeed(kp.publicKey)
    )
}

function seedTest()
{
    var kp = nacl.sign.keyPair.fromSecretKey(
        b58.decode(process.env.WLLET_SK)
    )
    const master = hd.hdkey.fromMasterSeed(kp.publicKey);
    var child = master.deriveChild(1111111111)
    var child_wallet = child.getWallet()
    console.log(child_wallet.getAddressString())
    console.log(
        b58.encode(nacl.sign.keyPair.fromSeed(child_wallet.getPrivateKey()).publicKey),
        b58.encode(nacl.sign.keyPair.fromSeed(child_wallet.getPrivateKey()).secretKey)
    )
}

function b58Test()
{
    var d =  {
        t:1,
        i:"1234567",
        d:"Hello qwq",
        c:{
            t:0,
            i:1
        },
        r:""
        }

    var c =  {
        t:0,
        i:"1234567",
        d:"wallet.tonspay.top",
        c:{
            t:1,
            i:1
        },
        r:""
        }
    console.log(
        b58.encode(
            Buffer.from(JSON.stringify(c))
        )
    )
}

async function evmTest()
{
    const account = web3.eth.accounts.privateKeyToAccount('0x1caa5efc57cea53e3761a2aa17fc9c09fea2468012bca29a6a3646b7ceb690e6');
    console.log(account)
    const data = account.sign("Hello world");
    console.log(data)
}

async function solTest()
{
    const account = new solanaweb3.Keypair()
    console.log(account)
    const messageBytes = Buffer.from("Hello world");
    const data = nacl.sign.detached(messageBytes, account.secretKey);
    console.log(data)

    const result = nacl.sign.detached.verify(
        messageBytes,
        data,
        account.publicKey.toBytes()
      );
    
    console.log(result);
}

function getTonWalletV4KeyPair(sec,workchain)
{
    const kp = tonCrypto.keyPairFromSecretKey(sec);
    return ton.WalletContractV4.create({ publicKey: kp.publicKey, workchain: workchain });
}

async function tonTest()
{
    const naclKp = new nacl.sign.keyPair()
    var tonKp = getTonWalletV4KeyPair(naclKp.secretKey,0)
    console.log(tonKp)
}

async function setTimeoutTest()
{
    console.log("setTimeoutTest 0")
}

async function test() {
    // await tonTest()
    console.log(
        JSON.parse(
            Buffer.from(b58.decode('3PDashQ58rEaLGCGZzevU5j2spW2rtJNzDoPcnP1RS26ajjk52jkqZkup5jPYTb78o4EMjf6SqsHaS3eUcfTTyptsbXpNtfrpr3R7vhbevmWwNpH7inGgdqCzBrhA85XvK7QPGZ5xBPuSNag')).toString()
        )
    )
    // await setTimeoutTest()
    // setTimeout(
    //     async function(){
    //         console.log('setTimeoutTest 1')
    //     },2000
    // );
    // console.log("setTimeoutTest 2")
}

test()
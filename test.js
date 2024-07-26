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

// const Web3 = require("web3")
const web3 = require("web3")
const solanaweb3  =require("@solana/web3.js")

const hd = require("ethereumjs-wallet")


const tonCrypto = require("@ton/crypto")
const ton = require("@ton/ton")

const btc = require("bitcoinjs-lib")
var bitcoinMessage = require('bitcoinjs-message')
const bip32 = require('bip32')
const ecpair=require('ecpair');
const ecc=require('tiny-secp256k1');

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


async function sol_version_tx_test()
{
    var tx = '';
    const rawSign =  new Uint8Array(b58.decode(tx))
    // const realTx =solanaweb3.Transaction.populate(solanaweb3.Message.from(rawSign))
    const realTx = solanaweb3.VersionedTransaction.deserialize(rawSign) //solanaweb3.VersionedMessage.deserialize(rawSign)
    // const realTx = new solanaweb3.Transaction()
    console.log(typeof(realTx))
    console.log(realTx.constructor.name == "VersionedTransaction")
}

async function btcTest()
{
    // const randomPrivate =  Buffer.from(
    //     (new nacl.sign.keyPair()).publicKey
    // )

    const randomPrivate = Buffer.from(
        (nacl.sign.keyPair.fromSecretKey(
            b58.decode(
                "67788VzaDjvjDLVUEjBi3wMHFEvyNiycWge4nozjoou1esLNyyjYdLcdvfG4ARNCg6FUBjEYt8XBKbz78nHVjhLW"
            )
        )).publicKey
    )
    const ECPair=ecpair.ECPairFactory(ecc);
    // ECPair.fromPrivateKey()
    
    // const kp =ECPair.makeRandom({network:btc.networks.testnet})
    const kp = ECPair.fromPrivateKey(randomPrivate,{})
    console.log(
        kp
    )

    var private_key=kp.privateKey.toString('hex');
    var public_key=kp.publicKey.toString('hex');
    console.log('pri_key = '+private_key);
    console.log('pub_key = '+public_key);

    const { address }=btc.payments.p2pkh({pubkey:kp.publicKey});
    console.log('address = '+address);
    // console.log(bip32)

    var privateKey = kp.privateKey
    var message = 'This is an example of a signed message.'

    var signature = bitcoinMessage.sign(message, privateKey, kp.compressed)
    console.log("🚧 BITCOIN SIGNATURE",signature.toString('base64'))

    var oldkp = ECPair.fromPrivateKey(Buffer.from(privateKey,'hex'),{})
    console.log(
        oldkp
    )
}
async function test() {
    await btcTest()
    // await seedTest()
    // await evmTest()
    // await sol_version_tx_test()
    // await tonTest()
    // await setTimeoutTest()
    // setTimeout(
    //     async function(){
    //         console.log('setTimeoutTest 1')
    //     },2000
    // );
    // console.log("setTimeoutTest 2")
    // console.log(
    //     Buffer.from(
    //         b58.encode(
    //             Buffer.from('https://raydium-v3.tons.ink/')
    //         )
    //     ).toString()
    // )

    // console.log(
    //     Web3
    // )
}

test()
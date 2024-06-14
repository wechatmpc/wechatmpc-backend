var MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
    //DB name
const mainDB = "tonspay"

//Sheet name
const sUser = "users";
const sUserWallet = "user_wallets";
const sMerchant = "merchant";
const sMerchantApiKey = "merchantApiKey";
const sPaymentMethod = "paymentMethod";
const sInvoice = "invoices";

//DB struct
const userStruct = {
    id: 0,
    is_bot: false,
    first_name: '',
    last_name: '',
    username: '',
    language_code: '',
    createTime: 0,
}

const userWalletStruct = {
    uid: 0, //uid
    type: 0, // Type of wallet : 0 TONWalletBot | 1 Phantom | 2 Metamask
    pk: "", // Address of user
    data: {}, // Details connection data 
    createTime: 0,
}

const merchantStruct = {
    uid: 0, //uid
    name: "", //Self name
    type: 0,
    createTime: 0,
}

const merchantPaymentMethodStruct = {
    uid: 0, //merchantId
    methodId: 0, //PaymentMethodId uid+timestamp+type to string(36)
    type: 0, // Type of payment : 0:TON | 1:SOL | 2:ARB 
    address: "", // Address to recive payment 
    callback : "",
    label: "" //Name for merchant remember
}



const invoiceStruct = {
    id: 0, //Invoice id : uid+timestamp+invoiceCont to string(36)
    uid: 0, //merchantId
    amount: 0, //Amount in int . decimails depends on the chain it select 
    amountUsd: 0,
    type: 0, //payment type :: 0:Mainnet token , 1:USDT , 2:USDC , 3:DAI (Different chain have different token )
    token: 0, //Payment Token type 
    createTime: 0,
    methodId: -1, //PaymentMethodId default -1 : allows all kinds of payment . 
    status: 0, //Payment status : 0 : Pending | 1 : Pay success | 2 : Pay cancel
    comment: "", //The invoice comment for user 
    callback : "",
    paymentResult: {}
}
const paymentResultStruct = {
    "paymentDetails": {
        "from":"",//The address of payer
        "amount":0,//How much this transaction paid on chain .
        "hash" : "",//The transaction hash of this payment . 
    }, //Token payment hash
    "routerFeeDetails":{
        "from":"",//The address of payer . 
        "amount":"",//How much being charged by payment router .
        "hash" : "" , //The sub transaction of router fee .
        "isPrepaid":true, //If this transaction being prepaird by merchant by Token . 
    },
}

const merchantApiKeyStruct = {
    uid: "",
    key: "", //RandomKey :: APIKEY:UID+timestamp+Random(6) toString(36)
    createTime: 0,
}

function unique(arr) {
    var obj = {};
    return arr.filter(function(item, index, arr) {
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}

/**
 * User sytstem 
 */

async function newAccount(data) {
    if ((await getAccountById(data.id)).length > 0) {
        return false;
    }
    const pool = await MongoClient.connect(process.env.SQL_HOST)
    var db = pool.db(mainDB);
    var ret = await db.collection(sUser).insertOne(data);
    await pool.close();
    return ret;
}
async function getAccountById(uid) {
    const pool = await MongoClient.connect(process.env.SQL_HOST)
    var db = pool.db(mainDB);
    var ret = await db.collection(sUser).find({
        id: uid
    }).project({}).toArray();
    await pool.close();
    return ret;
}

module.exports = {
    newAccount,
    getAccountById,
    unique,
}
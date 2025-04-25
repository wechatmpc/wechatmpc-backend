var MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
    //DB name
const mainDB = "tonspay"

//Sheet name
const sUser = "users";

//Merchant and Merchant inform . from collector
const sMerchants = "merchant";
const sMerchantGoods = "merchant_goods"

//Provider (who own the ticket)
const sProvider = "provider";
const sProviderGoods = "provider_goods";

//Orders controller
const sOrder = "order";
const sPayment = "payment";


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
const redis = require("../../utils/redis")
const tool = require("../../utils/tools")
const api = require("../../utils/apis")
const config = require("./config.json")
const { address } = require("bitcoinjs-lib")

// async function evmOracle()
// {
//     let oracels = []
//     let tokens = JSON.parse(JSON.stringify(
//         config.evm.tokens
//     ))
//     for(let i = 0 ; i < tokens.length ; i ++)
//     {
//         let search = tokens[i].token[0].address
//         let chain = tokens[i].token[0].chain
//         for(let u = 1 ; u < tokens[i].token.length ; u++)
//         {
//             let tartget = tokens[i].token[u];
//             search+=(","+tartget.address)
//         }
//         let price = await api.okxGetPrice(chain,search)

//         // console.log(
//         //     price?.data,
//         //     price?.data&&price.data.length == tokens[i].token.length

//         // )
//         if(price?.data&&price.data.length == tokens[i].token.length)
//         {
//             let tmpPrice = [];
//             for(let u = 1 ; u < tokens[i].token.length ; u++)
//                 {
//                     tokens[i].token[u].price = price.data[u].lastPrice
//                 }
//                 console.log(tokens[i].token)
//             oracels.concat(oracels,tokens[i].token)
//         }
//     }

//     console.log(oracels)
//     return oracels ;
// }


async function binanceOracle()
{
    let oracels = []
    let tokens = JSON.parse(JSON.stringify(
        config.binance
    ))
    for(let i = 0 ; i < tokens.length ; i ++)
    {
        let price = await api.binanceTicker(tokens[i].pair);
        if(price && price?.price)
        {
            tokens[i]['price'] = price?.price
        }
        
        await tool.sleep(1000)
    }
    console.log(tokens)
    return oracels ;
}


async function oracle()
{
    // evmOracle()
    let price = binanceOracle()
    await redis.setStorage("binance_price_oracle",JSON.stringify(
        {
            price
        }
    ))
}

async function loop()
{
    while(true)
    {
        await oracle()
        await tool.sleep(3600000) //1 H
        
    }
}

async function init()
{
    try{
        await loop();
        
    }catch(e)
    {
        console.error(e)
    }
    
}


module.exports = {
    init
}
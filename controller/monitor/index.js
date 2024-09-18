const redis = require("../../utils/redis")
const tool = require("../../utils/tools")

const config = require("./config.json")

async function evmOracle()
{

}

async function oracle()
{
    await redis.setStorage("price_oracle",JSON.stringify(
        {

        }
    ))
}

async function loop()
{
    while(true)
    {
        await oracle()
        await tool.sleep(86400000) //1 day
        
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
export{
    init
}
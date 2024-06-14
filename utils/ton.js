const TonWeb = require('tonweb');

const tonweb = new TonWeb();

async function getBalance(address)
{
    return await tonweb.getBalance(address);
}

module.exports = {
    getBalance,
    TonWeb
}
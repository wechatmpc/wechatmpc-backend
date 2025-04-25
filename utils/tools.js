function sleep (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function unique(arr) {
    var obj = {};
    return arr.filter(function(item, index, arr){
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}

var memoryStorage ={};

function getStorage(key)
{
    return memoryStorage[key];
}

function setStorage(key,data)
{
    memoryStorage[key]=data;
    return data;
}

function delStorage(key)
{
    delete memoryStorage[key]
}

module.exports = {
    unique,
    getStorage,
    setStorage,
    delStorage,
    sleep
}
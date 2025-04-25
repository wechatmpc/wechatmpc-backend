const req = require("./request");
require('dotenv').config()
async function anyRequest(url)
{
    var options = {
        'method': 'GET',
        'url': url,
        'headers': {
          'user-agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
          'Content-Type': 'application/json'
        },
      };
      return req.doRequest(options);
}
async function anyRequests(options)
{
      return req.doRequest(options);
}


module.exports = {
    anyRequest,
    anyRequests,
}
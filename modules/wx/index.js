require('dotenv').config();

function getOpenId(code) {
    return new Promise((resolve, reject) => {
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.APPID}&secret=${process.env.APPSECRET}&js_code=${code}&grant_type=authorization_code`
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  
function wxLogin(req, res) {
    const { code } = req.body
    getOpenId(code)
    .then(async (data) => {
      const { openid } = data
    //   console.log(openid)
      res.send(
        {
            code:200,
            uid:openid
        }
      )
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send(err.message)
    })
  }

module.exports = {
    wxLogin
}
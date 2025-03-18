require('dotenv').config();

let accessToken = ""

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

function ACTokenManager() {
  const url_at = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.APPID}&secret=${process.env.APPSECRET}`
  function updateToken() {
    fetch(url_at)
      .then((response) => response.json())
      .then((data) => {
        accessToken = data.access_token
      })
      .catch((err) => {
        console.error(err)
      })
  }
  updateToken()
  setInterval(
    () => {
      updateToken()
    },
    1000 * 4 * 60
  )
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


  async function getWxQrcode(req, res) {
    const qrcode_key = "random"
    const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        scene: qrcode_key,
        width: 280,
        page: "pages/init/index",
        env_version: "trial",
        // env_version: "release",
        check_path: false
      })
    }).then(async (response) => {
      res.setHeader("Access-Control-Expose-Headers", "scene")
      res.setHeader("scene", qrcode_key)
      response.body.pipe(res)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send(err.message)
      })
  }
module.exports = {
    wxLogin,
    getWxQrcode,
    ACTokenManager
}
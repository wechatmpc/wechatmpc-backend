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
 try {
    const qrcode_key = "4k6oagQM";
    const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        scene: qrcode_key,
        width: 280,
        page: "pages/QR/QR",
        env_version: "trial",
        // env_version: "release",
        check_path: false
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`微信API返回错误: ${response.status} - ${errorText}`);
    }
    res.setHeader("Access-Control-Expose-Headers", "scene");
    res.setHeader("scene", qrcode_key);
    res.setHeader("Content-Type", "image/png");
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("获取微信小程序码出错:", err);
    res.status(500).send(err.message);
  }
}
async function getDeeplink(req, res) {
  try {
     const query = "aBHBRBtcQa6W9QkPfMDHyrDYDmfHMM3F5Zb7c4ABZs5XMKs2L2byhqCrxAtth4EuUdW7ks9hFuymWsEBJHKejCnFZi9KVTe12kVzZ9PHU82RqM8WNVLE2iRcQXiULPPyWkeFs6WemfHnckc3Xx8T7E3mMM1LwLLwe3dVqSPL5mcJMT3H4ZL2Nj7Zo6eTNe2AgWcbgQAJ6mzYfom3G8bZn";
     const url = `https://api.weixin.qq.com/wxa/generatescheme?access_token=${accessToken}`;
     
     const response = await fetch(url, {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       },
       body: JSON.stringify({
        "jump_wxa":{
          path: "pages/QR/QR",
          query: query,
          env_version: "trial",
        },
        "is_expire":true,
        "expire_type":1,
        "expire_interval":1
       })
     });
     if (!response.ok) {
       const errorText = await response.text();
       throw new Error(`微信API返回错误: ${response.status} - ${errorText}`);
     }
      const ret =  await response.json();
      res.send(
        ret?.openlink
      );
   } catch (err) {
     console.error("获取微信小程序码出错:", err);
     res.status(500).send(err.message);
   }
}

async function getQuickDeeplink(req, res) {
  try {
     const query = req.params.msg;
     const url = `https://api.weixin.qq.com/wxa/generatescheme?access_token=${accessToken}`;
     
     const response = await fetch(url, {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       },
       body: JSON.stringify({
        "jump_wxa":{
          path: "pages/QR/QR",
          query: query,
          env_version: "trial",
        },
        "is_expire":true,
        "expire_type":1,
        "expire_interval":1
       })
     });
     if (!response.ok) {
       const errorText = await response.text();
       throw new Error(`微信API返回错误: ${response.status} - ${errorText}`);
     }
      const ret =  await response.json();
      return res.status(200).redirect(ret?.openlink? ret.openlink :"weixin://dl/business/?t=xS9rExPnQvk")
   } catch (err) {
     console.error("获取微信小程序码出错:", err);
     return res.status(500).send(err.message);
   }
}
module.exports = {
    wxLogin,
    getWxQrcode,
    ACTokenManager,
    getDeeplink,
    getQuickDeeplink
}
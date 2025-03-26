require('dotenv').config();
const fs = require('fs');
const {AlipaySdk} = require('alipay-sdk');
const fetch = require('node-fetch');

let accessToken = "";

// 初始化 Alipay SDK
const alipaySdk = new AlipaySdk({
  appId: process.env.ALIPAY_APPID,
  privateKey: fs.readFileSync('/cert/alipay/private.pem', 'ascii'),
  alipayRootCertPath: '/cert/alipay/alipayRootCert.crt',
  alipayPublicCertPath: '/cert/alipay/alipayCertPublicKey_RSA2.crt',
  appCertPath: '/cert/alipay/appCertPublicKey.crt',
  signType: 'RSA2',
  gateway: 'https://openapi.alipay.com/gateway.do',
  charset: 'utf-8'
});

// console.log(alipaySdk)

/**
 * 根据 authCode 获取支付宝用户 ID
 */
 
async function aliLogin(req, res) {
  const { code } = req.body;
  const openId = await getUserId(code)
    if(openId)
    {
        res.send({
          code: 200,
          uid: openId
        });
    }else{
        res.status(500).send("Server Error");
    }
}
 
async function getUserId(authCode) {
  try {
    const result = await alipaySdk.exec('alipay.system.oauth.token', {
      grant_type: 'authorization_code',
      code: authCode
    });
    return result?.openId || false;
  } catch (error) {
    console.error("获取用户ID失败:", error);
    throw error;
  }
}

/**
 * 启动 Access Token 管理（如果需要）
 */
async function updateAccessToken() {
  try {
    const result = await alipaySdk.exec('alipay.system.oauth.token', {
      grant_type: 'client_credentials'
    });
    accessToken = result.access_token;
  } catch (error) {
    console.error("更新 Access Token 失败:", error);
  }
}

// 每 4 分钟刷新一次 Token（如果适用）
setInterval(updateAccessToken, 1000 * 4 * 60);

/**
 * 获取支付宝小程序二维码
 */
async function getAliQrcode(req, res) {
  try {
    const qrcodeKey = "4k6oagQM";
    const result = await alipaySdk.exec('alipay.open.mini.qrcode.create', {
      biz_content: JSON.stringify({
        scene: qrcodeKey,
        width: 280,
        page: "pages/QR/QR"
      }),
      access_token: accessToken
    });

    if (result.code === '10000') {
      const response = await fetch(result.qrcode_url);
      res.setHeader("Access-Control-Expose-Headers", "scene");
      res.setHeader("scene", qrcodeKey);
      res.setHeader("Content-Type", "image/png");
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } else {
      throw new Error(result.sub_msg || "获取二维码失败");
    }
  } catch (error) {
    console.error("获取支付宝小程序码失败:", error);
    res.status(500).send(error.message);
  }
}

/**
 * 获取支付宝小程序 Deeplink
 */
async function getDeeplink(req, res) {
  try {
    const query = "your_custom_query";
    const result = await alipaySdk.exec('alipay.open.mini.deeplink.create', {
      biz_content: JSON.stringify({
        jump_mini: {
          path: "pages/QR/QR",
          query
        },
        is_expire: true,
        expire_type: 1,
        expire_interval: 1
      }),
      access_token: accessToken
    });

    res.send(result.openlink);
  } catch (error) {
    console.error("获取支付宝 Deeplink 失败:", error);
    res.status(500).send(error.message);
  }
}

/**
 * 获取快速 Deeplink 并重定向
 */
async function getQuickDeeplink(req, res) {
  try {
    const queryParam = req.params.msg;
    const result = await alipaySdk.exec('alipay.open.mini.deeplink.create', {
      biz_content: JSON.stringify({
        jump_mini: {
          path: "pages/QR/QR",
          query: queryParam
        },
        is_expire: true,
        expire_type: 1,
        expire_interval: 1
      }),
      access_token: accessToken
    });

    res.redirect(result.openlink || "alipay://platformapi/startApp?appId=20000067");
  } catch (error) {
    console.error("获取支付宝快速跳转链接失败:", error);
    res.status(500).send(error.message);
  }
}

module.exports = {
aliLogin,
  getUserId,
  getAliQrcode,
  getDeeplink,
  getQuickDeeplink
};

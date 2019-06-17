const fs = require('fs')
const path = require('path')

// 调试时暂不支持前端引用，但已经在git的pull request中看到有人提交了，目测新版本可以直接使用
const {google} = require('googleapis')

const keyPath = path.join(__dirname, '../static/oauth2.keys.json')
let keys = {redirect_uris: ['']}
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web
}

//
const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  // keys.redirect_uris[0]
  'http://localhost:3030/oauth2callback'
)
const scopes = ['https://www.googleapis.com/auth/blogger']

module.exports.getCode = function (req, res) {
  // 实际拼出一个url,供页面跳转并登录google
  // 类似于：https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fblogger&response_type=code&client_id=${access_type}&redirect_uri=http%3A%2F%2Flocalhost%3A3030%2Foauth2callback
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' ')
  })
  // res.redirect(authorizeUrl)
  res.send(authorizeUrl)
}

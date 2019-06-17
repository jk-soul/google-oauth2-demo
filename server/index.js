var history = require('connect-history-api-fallback')
var express = require('express') // 引入express模块
var app = express() // express对象
const translate = require('./translate')
const gApi = require('./api')
// const testStr = {name: 'matt', sex: 'male', age: 20, skills: ['js', 'ts', 'css', 'html', 'node']} // 版本检查返回的数据，假数据，自行修改
let port = 3030
app.use(express.json())
app.use(history({
  // verbose: true,
  index: '/'
  // rewrites: [ {
  //   // from: /^\/(?!api)/, to: '/'
  // }]
}))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// 静态资源
app.use(express.static('dist'))

// app.get('/test', function (req, res) {
//   res.send(JSON.stringify(testStr))
// })
// app.get('/download', function (req, res) { // 新版本文件下载接口
//   res.download('./package.json')
// })

app.get('/api/code', gApi.getCode)
app.post('/api/translte', translate)

app.listen(port, function () { // 服务端口监听
  console.log(`server now listening at port ${port}`)
})

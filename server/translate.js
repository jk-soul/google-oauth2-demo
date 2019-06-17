function token (a = '') {
  // var k = ''
  var b = 406644
  var b1 = 3293161072

  var jd = '.'
  var sb = '+-a^+6'
  var Zb = '+-3^+b+-f'

  for (var e = [], f = 0, g = 0; g < a.length; g++) {
    var m = a.charCodeAt(g)
    /* eslint-disable-next-line */
    m < 128 ? e[f++] = m : (m < 2048 ? e[f++] = m >> 6 | 192 : ((m & 64512) == 55296 && g + 1 < a.length && (a.charCodeAt(g + 1) & 64512) == 56320 ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023), e[f++] = m >> 18 | 240, e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224, e[f++] = m >> 6 & 63 | 128), e[f++] = m & 63 | 128)
  }
  a = b
  for (f = 0; f < e.length; f++) {
    /* eslint-disable-next-line */
    a += e[f],
    a = RL(a, sb)
  }
  a = RL(a, Zb)
  a ^= b1 || 0
  a < 0 && (a = (a & 2147483647) + 2147483648)
  a %= 1E6
  return a.toString() + jd + (a ^ b)
}
function RL (a, b) {
  var t = 'a'
  var Yb = '+'
  for (var c = 0; c < b.length - 2; c += 3) {
    /* eslint-disable-next-line */
    var d = b.charAt(c + 2),
      /* eslint-disable-next-line */
      d = d >= t ? d.charCodeAt(0) - 87 : Number(d),
      /* eslint-disable-next-line */
      d = b.charAt(c + 1) == Yb ? a >>> d : a << d
      /* eslint-disable-next-line */
    a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
  }
  return a
}
let axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

module.exports = async function (req, res) {
  let body = req.body || {}
  let text = body.text
  if (!text)res.send('')
  let url = `https://translate.google.cn/translate_a/t?client=t&sl=auto&tl=en&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&otf=2&ssel=0&tsel=0&kc=1&tk=${token(text)}&q=${encodeURI(text)}`
  let result = null
  if (text.length > 200) {
    result = await axios.post(url,
      {q: text},
      {
        // headers: {
        //   'Accept': '*/*',
        //   'Content-Type': 'application/json; charset=UTF-8',
        //   'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        //   'Cookie': ''
        // }
      })
      .catch(err => {
        console.log('err', err)
        res.send()
      })
  } else {
    result = await axios.get(url)
      .catch(err => {
        console.log('err', err)
        res.send()
      })
  }
  res.send(result.data || [])
}


import axios from 'axios'
import store from './vuex/index'
import oldBlogJson from './blog.json'
let blogId = '7732444926663092470'
let logs = oldBlogJson.data || []

function getHttpConfig () {
  if (!store.state.access_token) { return {} }
  return {
    headers: {
      authorization: store.state.token_type + ' ' + store.state.access_token
    }
  }
}

async function sleep (t = 5000) {
  return new Promise(resolve => {
    setTimeout(() => { resolve(`await${t} ms`) }, t)
  })
}

export function getContentSource (obj) {
  let arr = []
  obj.roomImages.forEach(room => {
    if (room.typeName) {
      arr.push({
        tpl: `<h1></h1>`,
        text: room.typeName
      })
    }
    if (room.description) {
      arr.push({
        tpl: `<div style="font-size:16px;color: #666;padding-top: 10px;">{replace-text}</div>`,
        text: room.description
      })
    }
    if (!room.data && !room.data.length) return
    room.data.forEach(item => {
      if (!item.link) return
      arr.push({
        tpl: `<img style="width: 715px;height:403.69px;padding-top: 10px;" src="${item.link}"><br/>`
      })
    })
  })
  if (obj.title) {
    arr.push({
      tpl: `<a href="https://design.homestyler.com/cn/detail2D/${obj.assetId}"><div styele="font-size: 20px;">{replace-text}</div></a>`,
      text: obj.title,
      type: 'title'
    })
  }
  if (obj.description) {
    if (obj.roomImages[0] && obj.description !== obj.roomImages[0].description) {
      arr.push({
        tpl: `<div style="font-size:16px;color: #666;padding-top: 10px;">{replace-text}</div>`,
        text: obj.description
      })
    }
  }
  arr.push({tpl: '<a href="https://www.homestyler.com/int/">homestyler</a>&nbsp;'})
  arr.push({tpl: '<a href="https://www.homestyler.com/floorplan/">floorplan</a>'})
  return arr
}

async function translate (text) {
  let url = `/api/translte`
  let res = await axios.post(url, {text: text}).catch(err => {
    console.log(err)
    throw err
  })
  return res.data
}

export async function translateContent (contentSource) {
  let str = ''
  for (let index in contentSource) {
    let target = contentSource[index]
    if (target.hasTranslate || !target.text) {
      str += target.tpl.replace('{replace-text}', target.text || '')
      continue
    }
    let res = await translate(target.text)
    target.translate = true
    target.translateText = res[0]
    await sleep()
    str += target.tpl.replace('{replace-text}', target.translateText || '')
  }
  return str
}

async function translateAndPost (contentSource, id) {
  try {
    let str = await translateContent(contentSource)
    let targetTitle = contentSource.find(i => i.type === 'title')
    let title = targetTitle && targetTitle.translateText ? targetTitle.translateText + ' - homestyler' : ''
    if (id) {
      let res = await post(str, title, id)
      return res
    }
  } catch (err) {
    let msg = err.toString ? err.toString() : JSON.stringify(err)
    logs.push({type: 'error', msg: msg, assetId: id})
  }
}

async function post (content, title, id) {
  let url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`
  let body = {
    'kind': 'blogger#post',
    'blog': {
      'id': blogId
    },
    'title': title || 'homestyler design',
    'content': content
  }
  let res = await axios.post(url, body, {...getHttpConfig()})
    .catch(err => {
      console.log(err)
      throw err
    })
  let log = {type: 'success', blog: res.data.id, assetId: id}
  logs.push(log)
  return log
}

export function getLogs () {
  return logs
}

export function downFile (filename, context) {
  let blob = new Blob([context])
  let href = URL.createObjectURL(blob)
  let a = document.createElement('a')
  a.download = filename
  a.href = href
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(href)
}

export default{
  getContentSource,
  translateContent,
  translateAndPost,
  post,
  getLogs,
  downFile
}

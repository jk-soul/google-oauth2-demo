# oauth2-project

> A Vue.js project about oauth2

google oauth2 login

步骤一：去api服务中心添加你的项目与凭据（https://console.developers.google.com/apis/dashboard），在Library中添加你需要的api，可以看到对应的api有详细的例子

步骤二：下载你的凭据 oauth2.keys.json（这里面设置好了google登录后的回调地址，要与你前端项目中的地址匹配）

步骤三：生成google登录的url，并前往登录

步骤四：登录完毕后，会根据 oauth2.keys.json 中的回调地址返回

步骤五：回调地址中的query中有必要的信息需要保存（code），并根据code再向google获取token，保存token中的必要信息

步骤六：获取的token中refresh_token，当token超时时就可以根据refresh_token和code去更新token，而不至于再去登录一遍

参考文档：https://developers.google.com/identity/protocols/OAuth2

移除了blog.vue及blog.json文件，可以自行添加

google translate

http： post,/api/translte,{text:text}

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

node server/index

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



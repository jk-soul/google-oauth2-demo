import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {web as keys} from '../../static/oauth2.keys.json'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    code: '',
    access_token: '',
    expires_time: 0,
    refresh_token: '',
    token_type: 'Bearer',
    codeUrl: '', // 调转至google登录
    redirect_uri: 'http://localhost:3030/oauth2callback', // google登录成功后回调页面
    grant_type: 'authorization_code',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    refreshTokenUrl: 'https://oauth2.googleapis.com/token'
  },
  getters: {
    isExpires: (state, getters) => {
      return !state.expires_time || new Date().valueOf() >= state.expires_time
    }
  },
  mutations: {
    INITTOKEN (state) {
      state.code = localStorage.getItem('code') || ''
      state.access_token = localStorage.getItem('access_token') || ''
      state.expires_time = localStorage.getItem('expires_time') || ''
      state.refresh_token = localStorage.getItem('refresh_token') || ''
      state.token_type = localStorage.getItem('token_type') || ''
    },
    SETTOKEN (state, token) {
      state.access_token = token.access_token
      state.refresh_token = token.refresh_token
      state.token_type = token.token_type
      localStorage.setItem('access_token', token.access_token)
      localStorage.setItem('refresh_token', token.refresh_token)
      localStorage.setItem('token_type', token.token_type)
    },
    SETCODE (state, code) {
      state.code = code
      localStorage.setItem('code', code)
    },
    SETACCESSTOKEN (state, accessToken) {
      state.access_token = accessToken
      localStorage.setItem('access_token', accessToken)
    },
    SETEXPIRESTIME (state, expiresIn = 1) {
      let now = Date.now()
      state.expires_time = now + (expiresIn - 1) * 1000
      localStorage.setItem('expires_time', state.expires_time)
    }
  },
  actions: {
    async getUrl ({commit, state}) {
      let res = await axios.get('/api/code')
        .catch(err => {
          console.log('err', err)
        })
      if (!res || res.status !== 200) return
      state.codeUrl = res.data
      return res.data
    },
    async getToken ({commit, state}, obj) {
      commit('SETCODE', obj.code)
      let body = {
        code: obj.code,
        client_id: keys.client_id,
        client_secret: keys.client_secret,
        grant_type: 'authorization_code',
        redirect_uri: state.redirect_uri

      }
      let res = await axios.post(state.tokenUrl, body)
      if (res.status !== 200) return
      let tokenObj = res.data
      commit('SETTOKEN', tokenObj)
      commit('SETEXPIRESTIME', tokenObj.expires_in)
    },
    async refreshToken ({commit, state}) {
      if (!state.refresh_token) return
      let body = {
        refresh_token: state.refresh_token,
        client_id: keys.client_id,
        client_secret: keys.client_secret,
        grant_type: 'refresh_token'
      }
      let res = await axios.post(state.refreshTokenUrl, body).catch(() => {
        location.href = '/login'
      })
      // console.log(res)
      if (!res || res.status !== 200) {
        console.log('no refresh token')
        location.href = '/login'
        return
      }
      console.log('get refresh token success')
      commit('SETACCESSTOKEN', res.data.access_token)
      commit('SETEXPIRESTIME', res.data.expires_in)
    }
  }
})

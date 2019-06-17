<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['code', 'refresh_token']),
    ...mapGetters(['isExpires'])
  },
  methods: {
    initToke () {
      this.$store.commit('INITTOKEN')
    },
    refresh () {
      this.$store.commit('INITTOKEN')
    }
  },
  mounted () {
    console.log('init token')
    this.initToke()
    if (this.isExpires && location.href.indexOf('login') < 0 && location.href.indexOf('oauth2callback') < 0) {
      console.log('token is expires and refresh token')
      this.$store.dispatch('refreshToken')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

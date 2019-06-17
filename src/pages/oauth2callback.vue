<template>
  <div class="auth-warp">
     <router-link :to="{name:'home'}">home</router-link>
      <router-link :to="{name:'oauth2callback'}">oauth2callback</router-link>
    <div v-show="access_token">
     <router-link :to="{name:'blog'}">授权成功，前往blog</router-link>
    </div>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
export default {
  data: () => ({
    token: null
  }),
  computed: {
    ...mapState(['access_token']),
    ...mapGetters(['isExpires'])
  },
  // methods: {
  //   getQueryTail (query) {
  //     let str = '?'
  //     let groups = []
  //     for (let key in query) {
  //       groups.push(`${key}=${query[key]}`)
  //     }
  //     return str + groups.join('&')
  //   },
  //   setCode (code) {
  //     this.$store.dispatch('SETCODE', code)
  //   }
  // },
  mounted () {
    let query = this.$route.query
    if (query && query.code) {
      this.$store.dispatch('getToken', query)
    }
  }

}
</script>
<style scoped>
.auth-warp{
  text-align: center
}
</style>

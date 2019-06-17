<template>
  <div class="login">
    <h1>{{ msg }}</h1>
    <div>
      <router-link :to="{name:'home'}">home</router-link>
      <router-link :to="{name:'profile'}">profile</router-link>
      <router-link :to="{name:'oauth2callback'}">oauth2callback</router-link>
    </div>
    <div>
      url:{{url}}
    </div>
    <div> <button class="btn" @click="goToAuth">google登录</button> </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      msg: 'Welcome to Blog App',
      url: ''
    }
  },
  mounted () {
    this.getUrl()
  },
  methods: {
    async  getUrl () {
      this.url = await this.$store.dispatch('getUrl')
    },
    async goToAuth () {
      location.href = this.url
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login{
  text-align: center;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.btn{
  height: 30px;
  width: 80px;
  background-color:#2e92de;
  color: #ffff;
  border-radius: 4px;
  cursor: pointer;
}
</style>

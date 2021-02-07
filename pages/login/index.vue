<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign {{ isLogin ? 'in' : 'up' }}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="isLogin" to="/register">need an account?</nuxt-link>
            <nuxt-link v-if="!isLogin" to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages,field) in errors">
              <li v-for="(message,index) in messages" :key="index">
                {{field}} {{message}}
              </li>
            </template>

          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name" />
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="email" v-model="user.email" placeholder="Email"
                required />
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="password" v-model="user.password" placeholder="Password"
                required minlength="8" />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign {{ isLogin ? 'in' : 'up' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    login,
    register
  } from '@/api/user'
  const Cookie = process.client ? require('js-cookie') : undefined
  export default {
    middleware: "notAuthenticated",
    name: 'LoginIndex',
    data() {
      return {
        user: {
          email: '',
          password: '',
          username: ""

        },
        errors: {} // 错误信息
      }
    },
    computed: {
      isLogin() {
        return this.$route.name === 'login'
      },
    },
    methods: {
      async onSubmit() {
        // 提交表单请求
        try {
          console.log(11111)
          const {
            data
          } = this.isLogin ? await login({
              user: this.user
            }) :
            await register({
              user: this.user
            })
          // 保存登录信息
          this.$store.commit('setUser', data.user)
          // 为了方式刷新页面数据丢失　，我们需要把数据持久化
          Cookie.set('user', data.user)
          // 跳转首页
          this.$router.push("/")
        } catch (err) {
          console.dir(err)
          this.errors = err.response.data.errors
        }
      },
    },
  }
</script>

<style>
</style>